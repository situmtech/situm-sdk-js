# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
