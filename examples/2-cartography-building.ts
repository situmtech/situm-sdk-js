import SitumSDK from "../src";

(async function run() {
  // Initialize the situm specifying auth
  const situm = new SitumSDK({
    auth: {
      apiKey: "YOUR_API_KEY",
    },
  });

  // Fetching buildings
  const buildings = await situm.cartography.getBuildings();

  console.log("Fetching buildings: ");
  buildings.forEach((building) => {
    console.log(
      `Info for building ${building.id}: ${JSON.stringify(building)}`,
    );
  });

  // Fetching info from a building
  await situm.cartography.getBuildingById(5962).then((data) => {
    console.log(data);
  });

  // We've got functions to performa CRUD operations for buildings
  await situm.cartography.createBuilding({
    customFields: [],
    description: "description",
    dimensions: { length: 12, width: 123 },
    info: "the building info",
    location: { lat: 123, lng: 1234 },
    name: "",
    pictureId: "1",
    rotation: 12,
  });

  // Updating/patching a building
  await situm.cartography.patchBuilding(23423, {
    dimensions: { length: 12, width: 123 },
    location: { lat: 123, lng: 1234 },
    name: "The name of the building",
    pictureId: "123",
    rotation: 12,
  });

  // Deleting a building
  await situm.cartography.deleteBuilding(23423);

  const newpoi = await situm.cartography
    .createPoi({
      buildingId: 7277,
      categoryId: 148,
      customFields: [],
      info: "the building info",
      name: `My POI ${new Date().toDateString()}`,
      position: {
        floorId: 15517,
        georeferences: { lat: 42.86972460874978, lng: -8.515350926595511 },
      },
    })
    .then((poi) => {
      console.log(poi);
      return poi;
    });

  situm.cartography
    .patchPoi(newpoi.id, {
      buildingId: 7277,
      name: `My POI ${new Date().toDateString()}`,
      position: {
        floorId: 15517,
        georeferences: { lat: 42.86972460874978, lng: -8.515350926595511 },
      },
    })
    .then(console.log)
    .catch(console.error);
})();
