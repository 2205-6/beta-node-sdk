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
    // setInterval(() => {
    //   console.log('reinitialized');
    //   this.getFlags();
    // }, [this.config.reinitializationInterval])
  }

  evaluateFlag(flagKey, userContext, defaultValue = false) {
    return evaluate(flagKey, userContext, this, defaultValue);
  }

  setFlag(newFlagKey, newFlagData) {
    // for (let flag in this.flags) {
    //   if (flag === Object.keys(newFlag)[0]) {
    //     delete this.flags[flag];
    //     break;
    //   }
    // }
    // const updatedFlags = {...this.flags, ...newFlag};
    // this.flags = updatedFlags;
    this.flags[newFlagKey] = newFlagData;
  }

  async getFlags() {
    try {
      const options = {
        headers: { Authorization: this.config.sdkKey }
      }
      // returns only flags
      const { data } = await axios.get(`${this.config.bearerAddress}/connect/serverInit/`, options);

      this.flags = data;
      this.clientReady = true;
    } catch (e) {
      console.log('Error fetching flag data');
    }
  }

  setStream() {
    // this needs to listen for ALL changes, not just flag disables.
    // consider that sse only stays on for 30 seconds? we need to refresh. but it seems to be working just fine
    try {
      let eventSource = new EventSource(`${this.config.bearerAddress}/stream/server?sdkKey=${this.config.sdkKey}`);
      eventSource.addEventListener(this.config.sdkKey, (e) => {

        const streamedData = JSON.parse(e.data);

        for (let flag in streamedData) {
          this.setFlag(flag, e.data[flag]);
        }
      })
     } catch (e) {
      console.log('error setting up stream');
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