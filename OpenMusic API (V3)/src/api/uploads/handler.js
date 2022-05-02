const { goodResponse, badResponse } = require('../../utils/response');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadPictureHandler = this.postUploadPictureHandler.bind(this);
  }

  async postUploadPictureHandler(request, h) {
    let response;

    try {
      const { data } = request.payload;
      this._validator.validatePictureHeaders(data.hapi.headers);

      const filename = await this._service.writeFile(data, data.hapi);

      response = goodResponse(h, 201, {
        message: 'Gambar berhasil diunggah.',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
        },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = UploadsHandler;
