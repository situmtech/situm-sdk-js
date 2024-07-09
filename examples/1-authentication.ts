import SitumSDK from "../src";

/**
 * You can use multiple ways of authenticating.
 *
 * - Using your apikey
 * - Using a user/password combination
 * - Using a jwt
 *
 * In addition you can specify timeouts and a custom domain
 */

// Initialize the sdk specifying apikey based auth
const sdkAPiKeyAuth = new SitumSDK({
  auth: {
    apiKey: "YOUR_API_KEY",
  },
});

// Initialize the sdk specifying basic auth
const sdkBasicAuth = new SitumSDK({
  auth: {
    password: "example@example.com",
    username: "example@example.com",
  },
});

// Initialize the sdk specifying auth and timeouts
const sdkWithTimeouts = new SitumSDK({
  auth: {
    apiKey: "YOUR_API_KEY",
  },
  timeouts: {
    default: 10000, // ms
  },
});

// Initialize the sdk specifying auth and custom domain
const sdkWithCustomDomain = new SitumSDK({
  auth: {
    apiKey: "YOUR_API_KEY",
  },
  domain: "http://dashboard.situm.com",
});

// Initialize the sdk specifying a jwt
const sdkWithJwt = new SitumSDK({
  auth: {
    jwt: "YOUT_JWT",
  },
});
