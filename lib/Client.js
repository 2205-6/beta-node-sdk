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

  setFlag(flag) {
    const updatedFlags = {...this.flags, flag};
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
        this.setFlag(flag) 
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

  addContext(userContext) {
    this.userContext = userContext;
  }
}

module.exports = Client;