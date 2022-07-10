class Client {
  constructor(config) {
    this.config = config;
    this.clientReady = false;
    this.flags = {};
    this.userContext = this.config.userContext;
  }

  evaluateFlag(flagKey) {
    // this one should have the actual logic to evaluate flags
  }

  setFlag(flagLogic) {
    // set this.flags to the new logic
    // if sov is sending the entire ruleset, just replace the entire thing
    // if not, just pick out the one flag and replace that one
  }

  async getFlags() {
    // probably set this up as a try/catch block?
    // send user context to sovereign (should this be a POST?)
    const { data } = await axios.post(`${this.config.sovAddress}/serverInit/${this.config.sdkKey}`);
    // ^ This is sending the sdk key in the post url; is this safe?

    // store the returned flag data
    data.flags.forEach(flag => {
      this.setFlag(flag)
    })

    this.clientReady = true;
  }

  setStream() {
    let eventSource = new EventSource(`${config.sovAddress}/serverStream/${config.sdkKey}`);
    eventSource.onmessage = (e) => {
      e.flags.forEach(flag => {
        this.setFlag(flag);
      })
    }
  }
}