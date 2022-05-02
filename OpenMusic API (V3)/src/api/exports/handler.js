const { goodResponse, badResponse } = require('../../utils/response');

class ExportsHandler {
  constructor({
    producerService, playlistsService, usersService, validator,
  }) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postExportPlaylistSongsHandler = this.postExportPlaylistSongsHandler.bind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    let response;

    try {
      this._validator.validateExportPlaylistSongsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      const { targetEmail } = request.payload;

      const user = await this._usersService.getUserById(credentialId);
      const { fullname: userFullName } = user;

      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const { name: playlistName } = playlist;

      const message = {
        playlistId, targetEmail, userFullName, playlistName,
      };

      await this._producerService.sendMessage('export:playlistsongs', JSON.stringify(message));

      response = goodResponse(h, 201, {
        message: 'Permintaan sedang diproses.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = ExportsHandler;
