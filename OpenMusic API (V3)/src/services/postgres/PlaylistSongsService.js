const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async checkSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Lagu sudah berada di playlist.');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    await this.checkSongInPlaylist(playlistId, songId);

    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist.');
    }

    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistsongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `
          SELECT songs.id, songs.title, songs.performer FROM songs
          INNER JOIN playlistsongs ON playlistsongs.song_id = songs.id
          WHERE playlistsongs.playlist_id = $1
        `,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`playlistsongs:${playlistId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async removeSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }

  async verifyPlaylistSong(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu tidak ditemukan dalam playlist.');
    }
  }
}

module.exports = PlaylistSongsService;
