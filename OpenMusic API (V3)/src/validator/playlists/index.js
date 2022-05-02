const { PlaylistPayloadSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => validationHandler(PlaylistPayloadSchema, payload),
};

module.exports = PlaylistsValidator;
