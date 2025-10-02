import SitumSDK from "../src";

// In order to get the version
console.log("Version: ", { version: SitumSDK.version }, "\n");

// The SDK is organized in domains
const situm = new SitumSDK({});
console.log("Domains: ");
console.log({ cartography: situm.cartography, user: situm.user }, "\n");
