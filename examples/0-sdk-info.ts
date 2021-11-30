import SitumSDK from "../src";

// In order to get the version
console.log("Version: ", { version: SitumSDK.version }, "\n");

// The SDK is organized in domains
const sdk = new SitumSDK({});
console.log("Domains: ");
console.log({ user: sdk.user, cartography: sdk.cartography }, "\n");
