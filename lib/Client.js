const EventSource = require('eventsource');
const evaluate = require('./evaluation')
const axios = require('axios');

class Client {
  constructor(config) {
    this.config = config;
    this.clientReady = false;
    /*
      {
        "beta-processor": [audienceKey1, audienceKey2]
      }
    */
    this.flags = {};
    /*
      "beta-testers": {
        combination,
        conditions: []
      }
    */
    this.audiences = {};
  }

  evaluateFlag(flagKey, userContext) {
    return evaluate(flagKey, userContext, this);
  }

  setFlag(flagDetails) {
    this.flags[flagDetails.flagKey] = flagDetails.audiences;
    /*
    the format of this.flags should be an object where the keys are the flag keys, and the values are arrays of audience keys
      {
        'beta-processor': ['beta-testers']
      }
    */
  }

  setAudience(audienceDetails) {
    const { combination, conditions } = audienceDetails;
    this.audiences[audienceDetails.audienceKey] = { combination, conditions };
    /*
      the format of this.audiences should be an object where the keys are the audience keys, and the values are objects
      containing the combination string (ANY/ALL) and an array of conditions objects
    */
  }

  async getFlags() {
    try {
      const { data } = await axios.post(`${this.config.bearerAddress}/connect/serverInit/`, { sdkKey: this.config.sdkKey });
      // store the returned flag data
      data.flags.forEach(flag => this.setFlag(flag));
      // consider - if flag status is off, don't even add it to the property
      data.audiences.forEach(audience => this.setAudience(audience))
      this.clientReady = true;
    } catch (e) {
      console.log(e);
    }
  }

  setStream() {
    // this needs to listen for ALL changes, not just flag disables.
    // consider that sse only stays on for 30 seconds? we need to refresh. but it seems to be working just fine
    try {
      let eventSource = new EventSource(`${this.config.bearerAddress}/subscribe/server`);
      eventSource.onmessage = (e) => {
        console.log(e.data)
        // e.flags.forEach(this.setFlag)
        // e.audiences.forEach(this.setAudience)
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Client;