const { goodResponse, badResponse } = require('../../utils/response');

class PlaylistsHandler {
  constructor({ playlistsService, usersService, validator }) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    let response;

    try {
      this._validator.validatePlaylistPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { name } = request.payload;

      await this._usersService.getUserById(credentialId);
      const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

      response = goodResponse(h, 201, {
        message: 'Playlist berhasil ditambahkan.',
        data: { playlistId },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async getPlaylistsHandler(request, h) {
    let response;

    try {
      const { id: credentialId } = request.auth.credentials;

      await this._usersService.getUserById(credentialId);
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      response = goodResponse(h, 200, {
        data: { playlists },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    let response;

    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;

      await this._usersService.getUserById(credentialId);
      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.removePlaylistById(id);

      response = goodResponse(h, 200, {
        message: 'Playlist berhasil dihapus.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = PlaylistsHandler;
