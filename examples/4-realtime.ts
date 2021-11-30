import SitumSDK from "../src";

(async function run() {
  // Initialize the sdk specifying auth and base domain (later is optional)
  const sdk = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
      email: "example@example.com",
    },
    domain: "https://dashboard.situm.com",
  });

  // Retrieve all devices that are currently positioning.
  await sdk.realtime
    .getUsersPositions()
    .then((data) =>
      console.log(
        "Search all  positions of the devices that are currently positioning.",
        JSON.stringify(data)
      )
    );

  console.log("----");

  // Retrieve the devices that are currently positioning in some building.
  await sdk.realtime
    .getUsersPositions({ buildingId: 5962 })
    .then((data) =>
      console.log(
        "Retrieve the devices that are currently positioning in some building: ",
        JSON.stringify(data)
      )
    );
})();
