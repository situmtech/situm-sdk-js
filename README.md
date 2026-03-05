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

**Situm SDK JS** is primarily used to **embed and control the Situm Map Viewer** in your web app (or web-view) and to **interact with it through the Javascript postMessage API**.

Under the hood, the SDK:

- Creates and configures the Map Viewer `iframe`.
- Wraps the [Javascript PostMessage API](https://situm.com/docs/javascript-api-postmessage/) actions as **typed `viewer.xxx` functions**.
- Exposes viewer events as **`viewer.on(ViewerEventType.XYZ, callback)`**.

This keeps your app code small and focused while still letting you use the full power of the Map Viewer.

### Minimal viewer example

```html
<div id="viewer1"></div>
```

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

Each [**postMessage action**](https://situm.com/docs/javascript-api-postmessage/#sending-actions-to-the-viewer) is exposed as a **typed method on the `Viewer` instance**. For example:

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

For the complete, always up‑to‑date list of actions and payloads, see the generated [API reference](https://developers.situm.com/sdk_documentation/sdk-js/index.html) and the [Javascript PostMessage API docs](https://situm.com/docs/javascript-api-postmessage/).

### Subscribing to viewer events

The SDK exposes the **viewer events** (the `type` values in incoming postMessage events) via the `viewer.on` helper:

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

Internally this listens to the `message` event on `window`, parses the `data` field, and routes the event to the registered callbacks.

### Where to go next

- **PostMessage API details** (all actions & events): [Javascript PostMessage API docs](https://situm.com/docs/javascript-api-postmessage/).
- **Map Viewer configuration, query params, profiles, etc.**: see the Map Viewer docs in `https://situm.com/docs/map-viewer-specifications/`.
- **Concrete integration examples**: check the `examples/` folder in this repository.

<br />

## Using the REST API domains

Besides the Map Viewer integration, this SDK also wraps Situm's REST APIs in several **domains**:

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

- **Quickstart & guides**: `https://situm.com/docs/websdk-javascript-sdk-quickstart-guide/`
- **Javascript PostMessage API** (Map Viewer actions & events): `https://situm.com/docs/javascript-api-postmessage/`
- **Full API reference** (all domains & methods): `https://developers.situm.com/sdk_documentation/sdk-js/index.html`

You can also run `yarn doc` in this repository to build the API reference locally from JSDoc annotations, then open `docs/public/index.html`.

## Examples

<!-- JLAQ review this section -->
You can find several examples under the `examples/` folder, including:

- Basic Viewer embedding with buttons.
- Realtime positions overlay.
- Trajectory playback.

Serve the folder with any static web server (for example `npx serve examples`) and open the desired HTML file in your browser.

## Development

See [`DEVELOPMENT.md`](DEVELOPMENT.md) for more information.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

Please refer to [`CHANGELOG.md`](CHANGELOG.md) for notable changes for each version of the library, and check the Git tags in this repository for released versions.

## Submitting Contributions

You will need to sign a Contributor License Agreement (CLA) before making a submission. See `https://situm.com/contributions/` for more information.

## License

This project is licensed under the MIT license – see the [`LICENSE`](LICENSE) file for details.
