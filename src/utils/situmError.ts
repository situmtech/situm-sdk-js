/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { SitumErrorType, SitumSubError } from "../types";

export default class SitumError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: SitumSubError[] | undefined;

  constructor({ status, code, message, errors }: SitumErrorType) {
    super(message);

    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}
