The Node SDK is to be used within the developer's application code. There are 2 primary pieces to it:

1. Client
2. Config

## Client

The Client is responsible for:

- Holding flag data
- Holding audience data
- Evaluating flag data (evaluateFlag(flagKey, userContext))
- Fetching flag data from Bearer
- Establishing SSE connection

## Config

Config is responsible for:

- Storing configuration details (SDK key, Bearer address)
- Instantiating the Client object
- Invoking the initial connection on the Client

## How to Use

The Node SDK Client is meant to be established during the initial app server initialization.

```javascript
const sdkClient = require("node-sdk");
const config = new sdkClient.Config("beta_sdk_0", "http://localhost:3001");
```

Then, you must create a Client instance by calling `config.connect()`. Note that this is an asynchronous method, so you should either wrap it with a promise or your own async function. You will be needing access to the returned `client` object, so make sure you define it in scope where you need it.

```javascript
let client;

const initializeSDK = async () => {
  client = await config.connect();
};

initializeSDK();
```

Calling `connect` establishes the initial connection between the SDK and Bearer. This means the `client` object becomes populated with the flag and audience data, and the SSE connection is established.

Now you can use the `client`'s `evaluateFlag` method wherever you need to route users to different experiences. Note that unlike the React SDK, you must pass in the `userContext` object at this point.

```javascript
app.get("/", (req, res) => {
  if (client.evaluateFlag("beta-processor", userContext)) {
    res.send("BETA PROCESSOR IS ON");
  } else {
    res.send("BETA PROCESSOR IS OFF");
  }
});
```

Thanks to the SSE connection, whenever an update comes in, the client object will replace its stored flag/audience data with the update, so any future customer requests will be using the most up-to-date rulesets.
