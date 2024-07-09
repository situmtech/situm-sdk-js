/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Organization } from "../types";

/**
 * Adapts the server response to our common Organization object,
 * cleaning deprecations, removing redundancies, and more.
 *
 * @param Organization Not normalized organization
 * @param domain Current domain to get the pictures urls
 * @returns Organization normalized object
 */
export function getAdapter(
  organization: Record<string, unknown>,
  domain: string,
): Organization {
  organization.logoPath = organization?.logoPath
    ? domain + organization.logoPath
    : undefined;
  organization.logoLoginPath = organization?.logoLoginPath
    ? domain + organization.logoLoginPath
    : undefined;
  organization.logoFaviconPath = organization?.logoFaviconPath
    ? domain + organization.logoFaviconPath
    : undefined;

  return organization as Organization;
}
