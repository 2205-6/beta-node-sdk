The Node SDK is to be used within the developer's application code. There are 2 primary pieces to it:

1. Client
2. Config

## Client

The Client is responsible for:

- Holding flag data (including audiences and attributes)
- Evaluating flag data (evaluateFlag(flagKey))
- Fetching flag data from Sovereign
- Establishing SSE connection

## Config

Config is responsible for:

- Storing configuration details (SDK key, Sovereign address, user context object)
- Instantiating the Client object
- Invoking the initial connection on the Client
