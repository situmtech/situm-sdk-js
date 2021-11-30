import SitumSDK from "../src";

// Initialize the sdk specifying auth and base domain (later is optional)
const sdkAPiKeyAuth = new SitumSDK({
  auth: {
    apiKey: "YOUR_API_KEY",
    email: "example@example.com",
  },
  domain: "https://dashboard.situm.com",
});

// Initialize the sdk specifying auth and base domain (later is optional)
const sdkBasicAuth = new SitumSDK({
  auth: {
    password: "example@example.com",
    username: "example@example.com",
  },
  domain: "https://dashboard.situm.com",
});

// Initialize the sdk specifying auth and timeouts
const sdkWithTimeouts = new SitumSDK({
  auth: {
    apiKey: "YOUR_API_KEY",
    email: "example@example.com",
  },
  timeouts: {
    default: 100, // 100 ms
  },
});
