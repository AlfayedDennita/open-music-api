const { goodResponse, badResponse } = require('../../utils/response');

class PlaylistSongsHandler {
  constructor({
    playlistSongsService, playlistsService, songsService, validator,
  }) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    let response;

    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.getSongById(songId);
      await this._playlistSongsService.addSongToPlaylist(playlistId, songId);

      response = goodResponse(h, 201, {
        message: 'Lagu berhasil ditambahkan ke playlist.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async getSongsFromPlaylistHandler(request, h) {
    let response;

    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      const songs = await this._playlistSongsService.getSongsFromPlaylist(playlistId);

      response = goodResponse(h, 200, {
        data: { songs },
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }

  async deleteSongFromPlaylistHandler(request, h) {
    let response;

    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.verifyPlaylistSong(playlistId, songId);
      await this._playlistSongsService.removeSongFromPlaylist(playlistId, songId);

      response = goodResponse(h, 200, {
        message: 'Lagu berhasil dihapus dari playlist.',
      });
    } catch (error) {
      response = badResponse(h, error);
    }

    return response;
  }
}

module.exports = PlaylistSongsHandler;
