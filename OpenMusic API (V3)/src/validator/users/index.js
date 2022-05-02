const { UserPayloadSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const UsersValidator = {
  validateUserPayload: (payload) => validationHandler(UserPayloadSchema, payload),
};

module.exports = UsersValidator;
