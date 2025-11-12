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
yarn pack
yarn publish --access public
```

or for beta channel

```shell
yarn prepare-release
yarn publish --tag beta --access public
```