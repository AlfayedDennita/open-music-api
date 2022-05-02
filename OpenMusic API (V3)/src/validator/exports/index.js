const { ExportPlaylistSongsPayloadSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const ExportsValidator = {
  validateExportPlaylistSongsPayload: (payload) => {
    validationHandler(ExportPlaylistSongsPayloadSchema, payload);
  },
};

module.exports = ExportsValidator;
