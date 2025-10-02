/**
 * Copyright (c) Situm Technologies. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type ApiBase from "../apiBase";

type ResponseImages = {
  id: string;
  url: string;
};

/**
 * Service that exposes the /images domain.
 *
 * Represents the ImagesApi class that provides methods for interacting with Situm's images.
 **/
export default class ImagesApi {
  private apiBase: ApiBase;

  constructor(apiBase: ApiBase) {
    this.apiBase = apiBase;
  }

  /**
   * Uploads a new image to Situm's backend.
   *
   * @param image The image to upload.
   * @param options Optional parameters for the request. Can include `rtf` and `filename`.
   */
  async uploadImage(
    image: Blob,
    options: { rtf?: boolean; filename?: string } = {},
  ): Promise<ResponseImages> {
    const url = "/api/v1/images";

    await this.apiBase.getAuthSession();

    const formData = new FormData();
    formData.append("image", image, options.filename ?? "image.png");
    if (options.rtf === true) {
      formData.append("rtf", "true");
    }

    return this.apiBase.post<ResponseImages>({
      formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url,
    });
  }
}
