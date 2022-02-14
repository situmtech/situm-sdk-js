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

  // Fetching paths
  const paths = await sdk.cartography.getPaths();

  console.log("Fetching paths: ");
  paths.forEach((path) => {
    console.log(`Info for path: ${JSON.stringify(path)}`);
  });

  // Fetching info from a path searching by building
  await sdk.cartography.getPathsByBuildingId(5962).then((data) => {
    console.log(data);
  });

  // We've got functions to perform CRUD operations for buildings
  await sdk.cartography.updatePath(5962, {
    nodes: [
      {
        id: 1,
        floorId: 12220,
        x: 56.417,
        y: 11.716,
      },
      {
        id: 2,
        floorId: 12220,
        x: 111.006,
        y: 12.038,
      },
    ],
    links: [
      {
        source: 1,
        target: 2,
        origin: "both",
        tags: [],
      },
      {
        source: 2,
        target: 3,
        origin: "both",
        tags: [],
      },
    ],
  });
})();
