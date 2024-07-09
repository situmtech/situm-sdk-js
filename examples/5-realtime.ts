import SitumSDK from "../src";

(async function run() {
  // Initialize the situm specifying auth and base domain (later is optional)
  const situm = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
    },
    domain: "https://dashboard.situm.com",
  });

  // Retrieve all devices that are currently positioning.
  await situm.realtime
    .getPositions()
    .then((data) =>
      console.log(
        "Search all  positions of the devices that are currently positioning.",
        JSON.stringify(data),
      ),
    );

  console.log("----");

  // Retrieve the devices that are currently positioning in some building.
  await situm.realtime
    .getPositions({ buildingId: 5962 })
    .then((data) =>
      console.log(
        "Retrieve the devices that are currently positioning in some building: ",
        JSON.stringify(data),
      ),
    );
})();
