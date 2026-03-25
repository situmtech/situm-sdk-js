<p align="center">
  <img width="233" src="https://situm.com/wp-content/themes/situm/img/logo-situm.svg" style="margin-bottom:1rem" />
  <h1 align="center">Situm SDK JS</h1>
</p>

<div align="center" style="text-align:center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Latest version:](https://img.shields.io/npm/v/@situm/sdk-js/latest)
![Node compatibility:](https://img.shields.io/node/v/@situm/sdk-js)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

</div>

## Getting started

**Situm SDK JS** is a library designed for developers **integrating Situm into web applications or WebViews**. It provides an easy way to embed and control the Situm Map Viewer, as well as to interact with Situm’s APIs from JavaScript. 

With this SDK, you can seamlessly display indoor maps, control [Situm's Map Viewer](https://situm.com/docs/map-viewer-quickstart-guide/) programmatically, and access Situm data (buildings, POIs, positions, etc.) without dealing with low-level integration details. 

Under the hood, the SDK: 

- Creates and configures the Map Viewer `iframe` 
- Provides simple, typed methods (e.g. `viewer.xxx`) to control the viewer 
- Exposes viewer events through an easy-to-use subscription API (`viewer.on(...)`) 
- Wraps Situm’s REST APIs into a convenient client

By abstracting the underlying communication layer, the SDK lets you focus on your application logic while still leveraging the full capabilities of the Situm Map Viewer. 

### Minimal viewer example

Add a container for the Map Viewer iframe in your HTML:

```html
<div id="viewer1"></div>
```

Create a new Map Viewer instance using the ID from the previous step:

```ts
import SitumSDK, { ViewerEventType } from "@situm/sdk-js";

const sdk = new SitumSDK({
  auth: { apiKey: YOUR_API_KEY },
});

const viewer = sdk.viewer.create({
  domElement: document.querySelector("#viewer1")!,
  buildingId: YOUR_BUILDING_ID,
});

viewer.on(ViewerEventType.MAP_IS_READY, () => {
  console.log("viewer: map is ready");
});
```

You can find more complete HTML examples under the [`examples/`](examples/) folder.

### Public viewer functions (actions)

The SDK provides a set of **typed methods** on the `viewer` instance that allow you to **control and interact with the Map Viewer programmatically**. 

For example: 

```ts
import Situm, { ViewerEventType } from "@situm/sdk-js";

const sdk = new Situm({ auth: { apiKey: YOUR_API_KEY } });
const viewer = sdk.viewer.create({
  domElement: document.querySelector("#viewer1")!,
  buildingId: YOUR_BUILDING_ID,
});

// Example 1: move the camera
viewer.setCamera({
  center: { lat: 43.3623, lng: -8.4115 },
  zoom: 18,
});

// Example 2: open the location picker
viewer.openLocationPicker({
  initialPosition: {
    latitude: 43.3623,
    longitude: -8.4115,
    floorIdentifier: 1,
  },
});
```


You can find the complete list of available public viewer methods and their parameters in the JS SDK API reference: 

→ [**JS SDK API reference**](https://developers.situm.com/sdk_documentation/sdk-js/index.html) 


### Subscribing to viewer events

The SDK allows you to listen to **events triggered by the Map Viewer** using the `viewer.on(...)` method. This makes it easy to react to user interactions such as selecting a POI or requesting directions. 

```ts
import Situm, { ViewerEventType } from "@situm/sdk-js";

const sdk = new Situm({ auth: { apiKey: YOUR_API_KEY } });
const viewer = sdk.viewer.create({ domElement: document.querySelector("#viewer1")! });

viewer.on(ViewerEventType.POI_SELECTED, (payload) => {
  console.log("POI selected", payload.identifier, payload.buildingIdentifier);
});

viewer.on(ViewerEventType.DIRECTIONS_REQUESTED, (payload) => {
  console.log("Directions requested", payload);
});
```

Each event provides a payload with relevant data that you can use to update your application logic. 

You can find the complete list of available events and their payloads in the JS SDK API reference: 

→ [**JS SDK API reference**](https://developers.situm.com/sdk_documentation/sdk-js/index.html) 

<br />

## Using the REST API domains

Besides the Map Viewer integration, this SDK also wraps Situm's REST APIs, dividing them into several **domains**:

| Name           | Explanation                                                                 | Example                          |
|----------------|-----------------------------------------------------------------------------|----------------------------------|
| **Cartography**| Buildings, floors, POIs, geofences…                                        | `sdk.cartography.getBuildings()` |
| **Realtime**   | Real-time location tracking and positioning.                               | `sdk.realtime.getPositions()`    |
| **Viewer**     | Map Viewer embedding and postMessage helpers.                              | `sdk.viewer.create({})`          |
| **User**       | User accounts and authentication.                                          | `sdk.user.getUsers()`            |
| **Reports**    | Analytics & usage reports (e.g. trajectories).                             | `sdk.reports.getTrajectory()`    |
| **Images**     | POI / POI category image management.                                                | `sdk.images.uploadImage()`       |

Basic examples:

```ts
import Situm from "@situm/sdk-js";

const sdk = new Situm({ auth: { apiKey: YOUR_API_KEY } });

// Cartography
const buildings = await sdk.cartography.getBuildings();

// Realtime
const positions = await sdk.realtime.getPositions();
```

For most web integrations you will combine these domains (to fetch data) with the **Viewer** (to display and interact with it).

## Documentation

- **Get started**: Follow the step-by-step guide to quickly integrate the SDK and embed the Map Viewer in your application: 
→ https://situm.com/docs/websdk-javascript-sdk-quickstart-guide/ 

- **JS SDK API reference**: Explore all available methods provided by the SDK to: 
  - Control and interact with the Map Viewer from JavaScript 
  - Use Situm’s REST APIs through the SDK 

→ https://developers.situm.com/sdk_documentation/sdk-js/index.html 

- **Javascript PostMessage API**: If you want to interact with the Map Viewer directly via an iframe (without using this SDK), you can use the PostMessage API.  This approach is recommended only for specific use cases where the SDK cannot be used. 

→ https://situm.com/docs/javascript-api-postmessage/ 

- **Map Viewer configuration**: Learn how to configure the Map Viewer (query parameters, profiles, customization options, etc.): 
→ https://situm.com/docs/map-viewer-quickstart-guide/ 

- **Examples**: Check the examples/ folder in this repository for practical integration use cases, including: 

  - Embedding Situm's Map Viewer in your web app 
  - Realtime data visualization 
  - Situm's REST APIs integration
  - Trajectory playback 
  - ...

## Examples

You can find several examples under the [`examples/`](examples/) folder, including:

- Basic Viewer embedding with buttons.
- Realtime positions and/or trajectory overlay on top of Situm’s Map Viewer. 
- Interacting with the REST APIs both to consume and update data. 

## Development

See [`DEVELOPMENT.md`](DEVELOPMENT.md) for more information.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

Please refer to [`CHANGELOG.md`](CHANGELOG.md) for notable changes for each version of the library, and check the Git tags in this repository for released versions.

## Submitting Contributions

You will need to sign a Contributor License Agreement (CLA) before making a submission. See `https://situm.com/contributions/` for more information.

## License

This project is licensed under the MIT license – see the [`LICENSE`](LICENSE) file for details.
