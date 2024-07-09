import SitumSDK from "../src";

(async function run() {
  // Initialize the situm specifying auth and base domain (later is optional)
  const situm = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
    },
  });

  // Fetching info from a building
  const floors = await situm.cartography.getFloors({ buildingId: 5962 });

  const geofences = await situm.cartography.getGeofences({
    buildingIds: [5962],
  });

  const paths = await situm.cartography.getPaths({ buildingId: 5962 });

  const pois = await situm.cartography.getPois({ buildingId: 5962 });

  console.log({
    floors,
    pois,
    paths,
    // geofences,
  });
})();
