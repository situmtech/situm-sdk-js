import SitumSDK from "../src";

(async function run() {
  // Initialize the sdk specifying auth and base domain (later is optional)
  const sdk = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
      email: "example@example.com",
    },
  });

  // Fetching info from a building
  const floors = await sdk.cartography.getFloors({ buildingId: 5962 });

  // const geofences = await sdk.cartography.searchGeofences({
  //   buildingIds: [5962],
  // });

  const paths = await sdk.cartography.getPaths({ buildingId: 5962 });

  const pois = await sdk.cartography.getPois({ buildingId: 5962 });

  console.log({
    floors,
    pois,
    paths,
    // geofences,
  });
})();
