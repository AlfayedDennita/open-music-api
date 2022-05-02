const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');
const validationHandler = require('../../utils/validation');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    validationHandler(PostAuthenticationPayloadSchema, payload);
  },
  validatePutAuthenticationPayload: (payload) => {
    validationHandler(PutAuthenticationPayloadSchema, payload);
  },
  validateDeleteAuthenticationPayload: (payload) => {
    validationHandler(DeleteAuthenticationPayloadSchema, payload);
  },
};

module.exports = AuthenticationsValidator;
