const { goodResponse, badResponse } = require('../../utils/response');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    let response;

    try {
      this._validator.validateSongPayload(request.payload);

      const {
        title, year, performer, genre, duration,
      } = request.payload;

      const songId = await this._service.addSong({
        title, year, performer, genre, duration,
      });

      response = goodResponse(h, 201, {
        message: 'Lagu berhasil ditambahkan.',
        data: { songId },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async getSongsHandler(_request, h) {
    let response;

    try {
      const songs = await this._service.getSongs();

      response = goodResponse(h, 200, {
        data: { songs },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async getSongByIdHandler(request, h) {
    let response;

    try {
      const { id } = request.params;

      const song = await this._service.getSongById(id);

      response = goodResponse(h, 200, {
        data: { song },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async putSongByIdHandler(request, h) {
    let response;

    try {
      this._validator.validateSongPayload(request.payload);

      const { id } = request.params;
      const {
        title, year, performer, genre, duration,
      } = request.payload;

      await this._service.editSongById(id, {
        title, year, performer, genre, duration,
      });

      response = goodResponse(h, 200, {
        message: 'Lagu berhasil diperbarui.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async deleteSongByIdHandler(request, h) {
    let response;

    try {
      const { id } = request.params;

      await this._service.removeSongById(id);

      response = goodResponse(h, 200, {
        message: 'Lagu berhasil dihapus.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = SongsHandler;
