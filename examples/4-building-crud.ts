import SitumSDK from "../src";

(async function run() {
  // Initialize the situm specifying auth and base domain (later is optional)
  const situm = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
      username: "example@example.com",
    },
    domain: "https://dashboard.situm.com",
  });

  // Fetching paths
  const paths = await situm.cartography.getPaths();

  console.log("Fetching paths: ");
  paths.forEach((path) => {
    console.log(`Info for path: ${JSON.stringify(path)}`);
  });

  // Fetching info from a path searching by building
  await situm.cartography.getPaths({ buildingId: 5962 }).then((data) => {
    console.log(data);
  });

  // We've got functions to perform CRUD operations for buildings
  await situm.cartography.patchPath(5962, {
    links: [
      {
        origin: "both",
        source: 1,
        tags: [],
        target: 2,
      },
      {
        origin: "both",
        source: 2,
        tags: [],
        target: 3,
      },
    ],
    nodes: [
      {
        floorId: 12220,
        id: 1,
        x: 56.417,
        y: 11.716,
      },
      {
        floorId: 12220,
        id: 2,
        x: 111.006,
        y: 12.038,
      },
    ],
  });
})();
