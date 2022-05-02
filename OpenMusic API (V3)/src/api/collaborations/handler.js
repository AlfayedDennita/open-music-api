const { goodResponse, badResponse } = require('../../utils/response');

class CollaborationsHandler {
  constructor({
    collaborationsService, playlistsService, usersService, validator,
  }) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    let response;

    try {
      this._validator.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._usersService.getUserById(userId);
      const collaborationId = await this._collaborationsService
        .addCollaboration(playlistId, userId);

      response = goodResponse(h, 201, {
        message: 'Kolaborasi berhasil ditambahkan.',
        data: { collaborationId },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async deleteCollaborationHandler(request, h) {
    let response;

    try {
      this._validator.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.verifyCollaboration(playlistId, userId);
      await this._collaborationsService.removeCollaboration(playlistId, userId);

      response = goodResponse(h, 200, {
        message: 'Kolaborasi berhasil dihapus.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = CollaborationsHandler;
