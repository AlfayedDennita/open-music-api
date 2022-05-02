const { CollaborationPayloadSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => validationHandler(CollaborationPayloadSchema, payload),
};

module.exports = CollaborationsValidator;
