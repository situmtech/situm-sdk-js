/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const isObject = (object) =>
  object === Object(object) &&
  !Array.isArray(object) &&
  typeof object !== "function";

function transformKeys(object, keyTransformation) {
  if (!object) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map((i) => {
      return transformKeys(i, keyTransformation);
    });
  }

  if (!isObject(object)) {
    return object;
  }

  const n = {};

  Object.keys(object).forEach((k) => {
    n[keyTransformation(k)] = transformKeys(object[k], keyTransformation);
  });

  return n;
}

export const toCamel = (key: string): string =>
  key.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });

export const toSnake = (key: string): string =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const keysToCamel = (object: unknown) => transformKeys(object, toCamel);

export const keysToSnake = (object: unknown) => transformKeys(object, toSnake);
