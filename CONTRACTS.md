Connections:

## Initialization

During initialization, the client SDK will send a POST request to the Bearer:
POST `bearerAddress/connect/serverInit`
with the SDK key in the body, like so: `{ sdkKey: 'beta_sdk_0' }`

From this, it expects an object containing a `flags` and an `audiences` property, like so:

7/19: this is expected to change per the caching conversation. Will update this later.

```json
{
  "flags": [
    {
      "flagKey": "beta-processor",
      "status": true,
      "audiences": ["beta-testers"]
    }
  ],
  "audiences": [
    {
      "audienceKey": "beta-testers",
      "combination": "ANY",
      "conditions": [
        {
          "attribute": "beta",
          "type": "BOOL",
          "operator": "EQ",
          "value": true
        }
      ]
    }
  ]
}
```

## SSE Pushes

The Node SDK will also establish an SSE connection with the Bearer with the SDK key in the address via a GET request:
GET `bearerAddress/subscribe/server/sdkKey`

When any updates are pushed through, the SDK expects the ENTIRE ruleset to be sent through, just like in the above JSON example. It replaces its current ruleset with the new one that was pushed through the SSE.
