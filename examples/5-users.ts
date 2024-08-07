import SitumSDK from "../src";

(async function run() {
  // Initialize the sdk specifying auth and base domain (later is optional)
  const sdk = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
    },
    domain: "https://dashboard.situm.com",
  });

  // Retrieve all the users that the user can request
  await sdk.user
    .getUsers()
    .then((data) => console.log("Search all users", JSON.stringify(data)));

  console.log("----");

  // Retrieve all the users that the user can request
  await sdk.user
    .getUsers({ fullName: "DS SMITH" })
    .then((data) =>
      console.log("Search user by full name: ", JSON.stringify(data)),
    );
})();
