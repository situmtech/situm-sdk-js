/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import axios from "axios";
import expect from "expect";

import SitumError from "../../src/utils/situmError";

import mockData from "./mockData.json";

export const getMockData = (name: string) => {
  return mockData[name];
};

export const getAuthenticationException = () => {
  return new SitumError({
    status: 401,
    code: "invalid_credentials",
    message: "Authentication credentials are not valid.",
  });
};

export const checkAuthenticationException = (error: SitumError) => {
  const authenticationException = getAuthenticationException();

  expect(error.code).toEqual(authenticationException.code);
  expect(error.status).toEqual(authenticationException.status);
  expect(error.message).toEqual(authenticationException.message);
};

export const mockAxiosRequest = (responses) => {
  const mockAxios = jest.spyOn(axios, "request");

  const responsesArray = Array.isArray(responses) ? responses : [responses];

  responsesArray.map((response) => mockAxiosResponse(mockAxios, response));

  return mockAxios;
};

export const mockAxiosResponse = (mock, response) => {
  const promiseResponse =
    response instanceof SitumError
      ? Promise.reject({
          response: {
            data: {
              status: response.status,
              code: response.code,
              message: response.message,
            },
          },
        })
      : Promise.resolve({ data: response });

  mock.mockReturnValueOnce(promiseResponse);
};
