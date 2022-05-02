const { PlaylistSongPayloadSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => validationHandler(PlaylistSongPayloadSchema, payload),
};

module.exports = PlaylistSongsValidator;
