import Client from './Client.js'

class Config {
  constructor(sdkKey, sovAddress, userContext) {
    // initialize with sdkKey, sovereign address, and userContext
    this.sdkKey = sdkKey;
    this.sovAddress = sovAddress;
    this.userContext = userContext;
  }

  async connect() {
    try {
      const client = new Client(this);
      // get eval object
      await client.getFlags();
      return client;
    } catch (e) {
      console.log('connection failed')
    }
  }
}

module.exports = Config;