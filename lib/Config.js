const Client = require('./Client');

class Config {
  constructor(sdkKey, bearerAddress, reinitializationInterval = 600000) {
    // initialize with sdkKey, bearer address
    this.sdkKey = sdkKey;
    this.bearerAddress = bearerAddress;
    this.reinitializationInterval = reinitializationInterval;
  }

  async connect() {
    const client = new Client(this);
    try {
      await client.getFlags();
      client.setStream();
      return client;
    } catch (e) {
      console.log('connection failed')
      return client;
    }
  }
}

module.exports = Config;