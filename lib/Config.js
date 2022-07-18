const Client = require('./Client');

class Config {
  constructor(sdkKey, bearerAddress) {
    // initialize with sdkKey, sovereign address
    this.sdkKey = sdkKey;
    this.bearerAddress = bearerAddress;
  }

  async connect() {
    try {
      const client = new Client(this);
      await client.getFlags();
      client.setStream();
      return client;
    } catch (e) {
      console.log('connection failed')
    }
  }
}

module.exports = Config;