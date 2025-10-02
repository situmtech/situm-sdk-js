<p align="center"> <img width="233" src="https://situm.com/wp-content/themes/situm/img/logo-situm.svg" style="margin-bottom:1rem" /> <h1 align="center">Situm SDK JS</h1> </p>

<p align="center" style="text-align:center">

A JavaScript library to interact with the Situm REST APIs to build your own applications with the power of
[SITUM](https://www.situm.com/).

</p>

<div align="center" style="text-align:center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Latest version:](https://img.shields.io/npm/v/@situm/sdk-js/latest)
![Node compatibility:](https://img.shields.io/node/v/@situm/sdk-js)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

</div>

## Getting Started

The SITUM SDK JS is Javascript library to create web applications using the REST API from Situm. This will allow you to fetch geospacial information and create your own js-based applications. We aim to make it easy to use for you and to keep your focus on creating your business logic over our services.

The best way to get started is to navigate through the Situm SDK JS documentation site:

- [Guide](https://situm.com/docs/websdk-javascript-sdk-quickstart-guide/) will give you a good overview of the library.
- [API Reference](https://developers.situm.com/sdk_documentation/sdk-js/index.html) will help you use a particular class or method.
- [Examples](https://github.com/situmtech/situm-sdk-js/tree/main/examples) will demo some specific features.
- [Support](https://situm.com/en/docs/) might answer some of your questions.

This library is organized into distinct domains, each targeting a specific aspect of indoor mapping and positioning. This separation helps you focus on relevant functionality for your application. The main domains are:

| Name           | Explanation                                                                 | Example                                 |
|----------------|-----------------------------------------------------------------------------|-----------------------------------------|
| **Cartography**| Handles map data, such as buildings, floors, and points of interest.        | `sdk.cartography.getBuildings()`        |
| **Realtime**   | Manages real-time location tracking and positioning.                        | `sdk.realtime.getPositions()`           |
| **Viewer**     | Provides tools to render interactive maps and visualizations in your web application. | `sdk.viewer.create({})`           |
| **User**       | Manages user accounts and authentication.                                   | `sdk.user.createUser()`                 |
| **Reports**    | Accesses analytics and reporting features, such as visit or usage reports.  | `sdk.reports.getTrajectory()`         |
| **Images**     | Handles image retrieval and management, such as map or POI images.          | `sdk.images.uploadImage()`         |

Each domain exposes its own set of classes and methods, making it easier to work with geospatial data, live positioning, or map rendering independently.


### Examples:

Fetching all the buildings from the api
```typescript
const sdk = new Situm({auth: {apiKey: YOUR_API_KEY});
const buildings = sdk.cartography.getBuildings();
```

Fetching realtime positions from the api
```typescript
const sdk = new Situm({auth: {apiKey: YOUR_API_KEY});
const buildings = sdk.realtime.getPositions();
```

Render an interactive viewer on a div:
```typescript
const sdk = new Situm({auth: {apiKey: YOUR_API_KEY});
const viewer = sdk.viewer.create({});

viewer.on(ViewerEventType.MAP_IS_READY, () =>
  console.log("viewer1: map is ready")
);
```

Check the examples folder on the repository to see more examples.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

Please refer to [CHANGELOG.md](CHANGELOG.md) for a list of notables changes for each version of the library.

You can also see the [tags on this repository](https://github.com/situmtech/situm-sdk-js/tags).

## Submitting Contributions

You will need to sign a Contributor License Agreement (CLA) before making a submission. [Learn more here.](https://situm.com/contributions/)

## License

This project is licensed under the MIT - see the [LICENSE](LICENSE) file for details.

## Documentation

### API Reference

Run `npm run doc` to build the API reference documentation from jsdoc annotations.

Once the task is done, you can visit `docs/public/index.html` to check the reference

### General documentation

You can read the general documentation that is published at [https://situm.com/en/docs/sdk-js/](https://situm.com/en/docs/sdk-js/) also in this repo.

Warning: internal links in these documents don't work. They are replaced when the documentation is published in [https://situm.com/](https://situm.com/en/docs/sdk-js/)

#### Guides

The folder `docs/guides` contains general information about the Situm SDK JS library.

- Quick start: get started quickly following this tutorial.
- Upgrade considerations: if you have experience with previous versions of Situm SDK JS, this is the place to learn the differences between the former library and the newest one.
- Glossary: terms that appear throughout the documentation.

#### Examples

In the folder `examples/` you can find several folders with example for every feature of Situm SDK JS.

Run them with:

```
npx tsx examples/filename.ts
```

#### Reference topics

The document `docs/reference/topics.md` contains general considerations when working with Situm SDK JS. It's advisable to read them before diving in the API reference.

#### Support

The folder `docs/support` contains several document with support documentation: support options, FAQs, error messages...

## Development

### Run the tests

```
npm test
```

### Build the library

```
npm run build
```

To watch the files

```
npm run build:watch
```

### Generate the docs

```
npm run docs
```

### Release version

```
yarn run prepare-release
yarn npm pack
yarn npm publish
```

or for beta channel

```
yarn prepare-release
yarn npm publish --tag beta
```
