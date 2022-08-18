const EventSource = require('eventsource');
const evaluate = require('./evaluation');
const axios = require('axios');

class FanaClient {
  constructor(config) {
    this.config = config;
    this.clientReady = false;
    this.flags = {};
    this.attemptLimit = 3;

    if (this.config.reinitializationInterval) {
      setInterval(() => {
        console.log('reinitialized');
        this.getFlags();
      }, [this.config.reinitializationInterval]);
    }
  }

  evaluateFlag(flagKey, userContext, defaultValue = false) {
    return evaluate(flagKey, userContext, this, defaultValue);
  }

  setFlag(newFlagKey, newFlagData) {
    this.flags[newFlagKey] = newFlagData;
  }

  async getFlags() {
    try {
      const options = {
        headers: { Authorization: this.config.sdkKey },
      };

      const { data } = await axios.get(
        `${this.config.bearerAddress}/connect/serverInit`,
        options
      );

      this.flags = data;
      this.clientReady = true;
    } catch (e) {
      console.log('Fana Server Client: Error fetching flag data');
    }
  }

  setStream() {
    try {
      let eventSource = new EventSource(
        `${this.config.bearerAddress}/stream/server?sdkKey=${this.config.sdkKey}`
      );

      let attempts = 0;

      eventSource.onopen = () => {
        console.log('successfully connected for streaming');
        attempts = 0;
      }

      eventSource.onerror = () => {
        if (attempts === this.attemptLimit) {
          console.log('attempt limit met, closing eventSource');
          eventSource.close();
        } else {
          attempts++;
          console.log('attempted to connect', attempts)
        }
      }

      eventSource.addEventListener(this.config.sdkKey, (e) => {
        const streamedData = JSON.parse(e.data);

        for (let flag in streamedData) {
          this.setFlag(flag, streamedData[flag]);
        }
      });
    } catch (e) {
      console.log('Fana Server Client: error setting up stream');
    }
  }
}
module.exports = FanaClient;
