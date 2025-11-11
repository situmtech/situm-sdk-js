## Development

### Enable corepack

```shell
corepack enable
```

### Install the dependencies

```shell
yarn install
```

### Run the tests

```shell
yarn test
```

### Build the library

```shell
yarn build
```

To watch the files

```shell
yarn build:watch
```

### Generate the docs

```shell
yarn doc
```

### Release version

```shell
yarn run prepare-release
yarn npm pack
yarn npm publish --access public
```

or for beta channel

```shell
yarn prepare-release
yarn npm publish --tag beta --access public
```

## Versioning

We use [SemVer](http://semver.org/) for versioning.

Please refer to [CHANGELOG.md](CHANGELOG.md) for a list of notables changes for each version of the library.

You can also see the [tags on this repository](https://github.com/situmtech/situm-sdk-js/tags).
