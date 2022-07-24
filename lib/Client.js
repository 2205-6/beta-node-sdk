const EventSource = require('eventsource');
const evaluate = require('./evaluation')
const axios = require('axios');

class Client {
  constructor(config) {
    this.config = config;
    this.clientReady = false;
    this.flags = {};
    /*
      "beta-testers": {
        status:
        audienceKey: {}
      }
    */
  }

  evaluateFlag(flagKey, userContext, defaultValue = false) {
    return evaluate(flagKey, userContext, this, defaultValue);
  }

  setFlag(newFlag) {
    for (let flag in this.flags) {
      if (flag === Object.keys(newFlag)[0]) {
        delete this.flags[flag];
        break;
      }
    }
    const updatedFlags = {...this.flags, ...newFlag};
    this.flags = updatedFlags;
  }

  async getFlags() {
    try {
      const options = {
        headers: { Authorization: this.config.sdkKey }
      }
      // returns only flags
      const { data } = await axios.get(`${this.config.bearerAddress}/connect/serverInit/`, options);
      /* returned flag data should be = 
        { 
          flagKey: {
            status:
            audienceKey: {}
          } 
        }
      */
      // store the returned flag data
      for (let flag in data) { 
        let newFlag = {}
        newFlag[flag] = flags[flag];
        this.setFlag(newFlag) 
      };
      this.clientReady = true;
    } catch (e) {
      console.log(e);
    }
  }

  setStream() {
    // this needs to listen for ALL changes, not just flag disables.
    // consider that sse only stays on for 30 seconds? we need to refresh. but it seems to be working just fine
    try {
      const options = {
        headers: { Authorization: this.config.sdkKey }
      }

      let eventSource = new EventSource(`${this.config.bearerAddress}/stream/server/`, options);
      eventSource.onmessage = (e) => {
        console.log(e.data)
        // e.data.forEach(flag => this.setFlag(flag))
      }
    } catch (e) {
      console.log(e);
    }
  }

}

// let flags = {
//       "beta-header": {
//         "status": true,
//         "beta-testers": {
//           combine: "ANY",
//           conditions: [
//             {
//               "attribute": "beta",
//               "operator": "EQ",
//               "vals": ["true"],
//               "negate": false
//             }
//           ]
//         }
//     },
//     "CA-header": {
//       "status": true,
//       "na-testers": {
//         combine: "ALL",
//         conditions: [
//           {
//             "attribute": "country",
//             "operator": "IN",
//             "vals": ["canada", "usa"],
//             "negate": false
//           },
//           {
//             "attribute": "age",
//             "operator": "GT",
//             "vals": ["18"],
//             "negate": false
//           }
//         ]
//       }
//     }
// }

// let newFlag = {
//   "beta-header": {
//     "status": false,
//     "beta-testers": {
//       combine: "ANY",
//       conditions: [],
//     }
//   }
// }

// const testClient = new Client();
// console.log('testClient flags:', testClient.flags)
// for (let flag in flags) { 
//   let newFlag = {}
//   newFlag[flag] = flags[flag]
//   testClient.setFlag(newFlag) 
// };
// console.log('initial flags:', testClient.flags);
// testClient.setFlag(newFlag);
// console.log('with updated flags:', testClient.flags);
module.exports = Client;