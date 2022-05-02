const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 'AuthorizationError', 403);
  }
}

module.exports = AuthorizationError;
