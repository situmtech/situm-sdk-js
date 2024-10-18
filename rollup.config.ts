import path from "path";
import { fileURLToPath } from "url";

import commonjs from "rollup-plugin-commonjs";
import { dts } from "rollup-plugin-dts";
import json from "rollup-plugin-json";
import license from "rollup-plugin-license";
import nodeResolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libraryName = "SitumSDK";
const name = "situm-sdk";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [
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
    output: [
      {
        file: `./dist/cjs/${name}.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `./dist/es5/${name}.js`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `./dist/umd/${name}.js`,
        format: "umd",
        sourcemap: true,
        name: libraryName,
      },
      {
        file: `./dist/umd/${name}.min.js`,
        format: "umd",
        sourcemap: true,
        name: libraryName,
        plugins: [terser()],
      },
    ],
  }),
  bundle({
    input: "./dist/dts/src/index.d.ts",
    plugins: [dts()],
    output: {
      file: `./dist/${name}.d.ts`,
      format: "es",
    },
  }),
];
