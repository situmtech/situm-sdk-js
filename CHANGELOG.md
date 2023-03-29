# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.3.0 (2023-03-30)

### Added

- SDKConfiguration may include an optional _httpHeaders_ Record<string, string> to include custom HTTP headers. For now, accepted headers are: _Accept-Language_.

  Usage example:

```js
const SitumSDK = require("@situm/sdk-js");

const situmSDK = new SitumSDK({
  auth: {
    apiKey: "MY-API-KEY",
    email: "MY-EMAIL",
  },
  domain: "https://dashboard.situm.com",
  httpHeaders: {
    "Accept-Language": "es",
  },
});
```

## 0.3.0 (2022-11-02)

### Added

- Handler for fetching the current organization info (activated modules, logos, accent colors)

### Improvements

- Add base domain to the poi categories icon urls. This fixes image urls pointing to wrong environment.

## 0.2.0 (2022-04-22)

## Fixed

- build: Export types propertly to dist/index.d.ts

## 0.1.0 (2022-04-12)

### Improvements

- **BREAKING CHANGES!**
  - renamed method `realtime.getUserPositions` to `realtime.getPositions`
  - renamed method `getFloorsOfBuildingId` to `getFloors`
  - renamed method `updatePath` to `patchPath`
  - renamed method `getPoisOfBuiding` to `getPois, now supports filtering`
  - renamed method `searchGeofences` to `getGeofences`
- build:
  - move to rollup and esbuild as the build system
  - generate cjs, umd and es5 builds
- chore: improve typing system by using generics in the base API
- test:
  - Improve test coverage
- doc:
  - Added documentation for all domain methods
  - Improved typedoc configuration to export symbols of internal
    domain classes. Now you can use `npm run doc` to generate documentation in docs/public

### Fixed

- ensure to pass base configuration in the SitumSDK main class
- remove duplicated User-Agent headers check in apiBase
- crash in browsers due to user-agent header not writeable
- Disable injecting version in headers for now
- double check in content-type header while building request headers

## 0.0.5 (2022-02-21)

### Improvements

- Separated all data mappers (functions to map server responses to TS objects)
  into the adapters/ folder
- Added JSDoc to all API wrappers
- Renamed `getFloorsOfBuilding` to `getFloorsByBuildingId`
- Renamed `searchGeofences` to `getGeofences`

### Fixed

- Crash in cartography fetch request due to improper server response handling

## 0.0.4 (2022-02-14) 💌 edition

### Added

- API wrappers for the POI REST api, now with the complete CRUD

### Fixed

- ES 2017 support

## 0.0.1 (2021-12-30)

This is the first version of the Situm Javascript SDK.Please bear in mind this is the first draft version. You must not use it as a production-ready package. We will publish further more stable versions.

### Added

- Consumer wrappers for the cartography REST API for the cartography (floors, geofences, pois, paths, events)
- Consumer wrappers for the Users REST API
- Consumer wrappers for fetching realtime positioning.
- Support for multiple authentication methods
