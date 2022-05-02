const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan.');
    }

    await this._cacheService.delete(`playlists:${owner}`);

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    try {
      const result = await this._cacheService.get(`playlists:${userId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `
          SELECT playlists.id, playlists.name, users.username FROM playlists
          LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
          INNER JOIN users ON users.id = playlists.owner
          WHERE playlists.owner = $1 OR collaborations.user_id = $1
          GROUP BY playlists.id, users.username
        `,
        values: [userId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`playlists:${userId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async getPlaylistById(id) {
    try {
      const result = await this._cacheService.get(`playlists:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM playlists WHERE id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Playlist tidak ditemukan.');
      }

      await this._cacheService.set(`playlists:${id}`, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }

  async removePlaylistById(id) {
    const selectCollaboratorsQuery = {
      text: 'SELECT user_id FROM collaborations WHERE playlist_id = $1',
      values: [id],
    };

    const selectCollaboratorsResult = await this._pool.query(selectCollaboratorsQuery);

    const deletePlaylistQuery = {
      text: 'DELETE FROM playlists WHERE id = $1 returning owner',
      values: [id],
    };

    const deletePlaylistResult = await this._pool.query(deletePlaylistQuery);
    const { owner } = deletePlaylistResult.rows[0];

    await this._cacheService.delete(`playlists:${id}`);
    await this._cacheService.delete(`playlists:${owner}`);

    if (selectCollaboratorsResult.rowCount) {
      const collaborators = selectCollaboratorsResult.rows;
      const deleteCollaboratorCachePromises = [];

      collaborators.forEach((collaborator) => {
        deleteCollaboratorCachePromises.push(this._cacheService.delete(`playlists:${collaborator.user_id}`));
      });

      await Promise.all(deleteCollaboratorCachePromises);
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Playlist ini tidak diizinkan untuk diakses.');
    }
  }

  async verifyPlaylistAccess(id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaboration(id, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
