import { terser } from "rollup-plugin-terser";
import camelCase from "lodash.camelcase";
import commonjs from "rollup-plugin-commonjs";
import dts from "rollup-plugin-dts";
import json from "rollup-plugin-json";
import license from "rollup-plugin-license";
import nodeResolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import path from "path";

const pkg = require("./package.json");

const libraryName = "situm-sdk";

export default [
  {
    input: `src/index.ts`,
    output: [
      {
        file: pkg.main,
        name: camelCase(libraryName),
        format: "cjs",
        sourcemap: true,
        name: "SitumSDK",
        globals: {
          axios: "axios",
        },
      },
      {
        file: pkg.main.replace("cjs", "umd"),
        name: camelCase(libraryName),
        format: "umd",
        sourcemap: true,
        name: "SitumSDK",
        globals: {
          axios: "axios",
        },
      },
      {
        file: pkg.main.replace("cjs", "umd").replace(".js", ".min.js"),
        name: camelCase(libraryName),
        format: "umd",
        sourcemap: true,
        name: "SitumSDK",
        globals: {
          axios: "axios",
        },
        plugins: [terser()],
      },
      { file: pkg.module, format: "es", sourcemap: true },
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ["axios"],
    watch: {
      include: "src/**",
    },
    plugins: [
      // Allow json resolution
      json(),
      // Compile TypeScript files
      typescript({ useTsconfigDeclarationDir: true }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      nodeResolve({
        browser: true,
      }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // Resolve source maps to the original source
      sourceMaps(),
      license({
        sourcemap: true,
        banner: {
          commentStyle: "regular", // The default
          content: {
            file: path.join(__dirname, "LICENSE"),
            encoding: "utf-8", // Default is utf-8
          },
        },
      }),
    ],
  },
  {
    input: "./dist/dts/src/index.d.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  },
];
