import SitumSDK from "../src";

(async function run() {
  // Initialize the sdk specifying auth
  const sdk = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
      email: "example@example.com",
    },
  });

  // Fetching buildings
  const buildings = await sdk.cartography.getBuildings();

  console.log("Fetching buildings: ");
  buildings.forEach((building) => {
    console.log(
      `Info for building ${building.id}: ${JSON.stringify(building)}`
    );
  });

  // Fetching info from a building
  await sdk.cartography.getBuildingById(5962).then((data) => {
    console.log(data);
  });

  // We've got functions to performa CRUD operations for buildings
  await sdk.cartography.createBuilding({
    name: "",
    pictureId: "1",
    location: { lat: 123, lng: 1234 },
    dimensions: { length: 12, width: 123 },
    description: "description",
    info: "the building info",
    rotation: 12,
    customFields: [],
  });

  // Updating/patching a building
  await sdk.cartography.patchBuilding(23423, {
    rotation: 12,
    pictureId: "123",
    dimensions: { length: 12, width: 123 },
    name: "The name of the building",
    location: { lat: 123, lng: 1234 },
  });

  // Deleting a building
  await sdk.cartography.deleteBuilding(23423);
})();
