const { SongPayloadSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const SongsValidator = {
  validateSongPayload: (payload) => validationHandler(SongPayloadSchema, payload),
};

module.exports = SongsValidator;
