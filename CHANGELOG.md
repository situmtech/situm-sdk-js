# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.7 (2022-04-08)


### Features

* bump version to 0.0.4 ([03d1935](https://github.com/situmtech/situm-sdk-js/commit/03d1935634f937438c2f28d15999014c09b11e9a))

### 0.0.6 (2022-04-07)


### Features

* bump version to 0.0.4 ([03d1935](https://github.com/situmtech/situm-sdk-js/commit/03d1935634f937438c2f28d15999014c09b11e9a))


### Bug Fixes

* ensure to pass base configuration in the SitumSDK main class ([ff8d74a](https://github.com/situmtech/situm-sdk-js/commit/ff8d74a10a1bd0f3c0b44e759f6748a197c58433))
* Remove duplicated User-Agent headers check in apiBase ([6e3fe8e](https://github.com/situmtech/situm-sdk-js/commit/6e3fe8edb121a7276ad6fa1df7e6dd90ad7e80d1))

## 0.0.6-beta3 (2022-04-07)

- chore: Improve typing system by using generics in the base API
- refactor: renamed getter methods
  - getFloorsOfBuildingId to getFloors
  - updatePath to patchPath
  - getPoisOfBuiding to getPois, now supports filtering
  - searchGeofences to getGeofences
- doc: Added documentation for all domain methods
- test: Improve test suite organization

### Bug Fixes

- fix: ensure to pass base configuration in the SitumSDK main class ([ff8d74a](https://github.com/situmtech/situm-sdk-js/commit/ff8d74a10a1bd0f3c0b44e759f6748a197c58433))

* Remove duplicated User-Agent headers check in apiBase ([6e3fe8e](https://github.com/situmtech/situm-sdk-js/commit/6e3fe8edb121a7276ad6fa1df7e6dd90ad7e80d1))

### Features

- bump version to 0.0.4 ([03d1935](https://github.com/situmtech/situm-sdk-js/commit/03d1935634f937438c2f28d15999014c09b11e9a))

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
