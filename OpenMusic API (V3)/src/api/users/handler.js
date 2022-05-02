const { goodResponse, badResponse } = require('../../utils/response');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    let response;

    try {
      this._validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this._service.addUser({ username, password, fullname });

      response = goodResponse(h, 201, {
        message: 'Pengguna berhasil ditambahkan.',
        data: { userId },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async getUserByIdHandler(request, h) {
    let response;

    try {
      const { id } = request.params;

      const user = await this._service.getUserById(id);

      response = goodResponse(h, 200, {
        data: { user },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = UsersHandler;
