const FanaClient = require('./FanaClient');

class FanaConfig {
  constructor(sdkKey, bearerAddress, reinitializationInterval) {
    this.sdkKey = sdkKey;
    this.bearerAddress = bearerAddress;
    this.reinitializationInterval = reinitializationInterval;
  }

  async connect() {
    const client = new FanaClient(this);
    try {
      await client.getFlags();
      client.setStream();
      return client;
    } catch (e) {
      console.log('Fana Server Client: connection failed');
      return client;
    }
  }
}

module.exports = FanaConfig;
