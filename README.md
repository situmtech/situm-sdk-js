# Situm SDK JS

[![](https://situm.com/wp-content/themes/situm/img/logo-situm.svg)](https://www.situm.es)

Situm SDK JS is a JavaScript library to interact with the Situm REST APIs to build your
own applications with the power of [SITUM](https://situm.com/). This library is used by
SITUM internally to build our dashboards and tools so you can use any fix and feature
we develop publicly.

## Getting Started

The best way to get started is to navigate through the Situm SDK JS documentation site:

- [Guide](https://situm.com/en/docs/sdk-js/guides/quickstart/) will give you a good overview of the library.
- [API Reference](https://situm.com/en/docs/sdk-js/reference/) will help you use a particular class or method.
- [Examples](https://situm.com/en/docs/sdk-js/examples/) will demo some specific features.
- [Support](https://situm.com/en/docs/sdk-js/support/) might answer some of your questions.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

Please refer to [CHANGELOG.md](CHANGELOG.md) for a list of notables changes for each version of the library.

You can also see the [tags on this repository](https://github.com/situmtech/situm-sdk-js/tags).

## Submitting Contributions

You will need to sign a Contributor License Agreement (CLA) before making a submission. [Learn more here.](https://situm.com/contributions/)

## License

This project is licensed under the MIT - see the [LICENSE.txt](LICENSE.txt) file for details.

## Documentation

### API Reference

Run `npm run docs` to build the API reference documentation from jsdoc annotations.

Once the task is done, you can visit `docs/public/index.html` to check the reference

### General documentation

You can read the general documentation that is published at [https://situm.com/en/docs/sdk-js/](https://situm.com/en/docs/sdk-js/) also in this repo. They are written in Markdown.

Warning: internal links in these documents don't work. They are replaced when the documentation is published in [https://situm.com/](https://situm.com/en/docs/sdk-js/)

#### Guides

The folder `docs/guides` contains general information about the Situm SDK JS library.

- Quick start: get started quickly following this tutorial.
- Upgrade considerations: if you have experience with previous versions of Situm SDK JS, this is the place to learn the differences between the former library and the newest one.
- Glossary: terms that appear throughout the documentation.

#### Examples

In the folder `examples/` you can find several folders with example for every feature of Situm SDK JS.

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
npm run bump
```

To publish a release to the `CDN` and `npm`

```
npm run release
```
