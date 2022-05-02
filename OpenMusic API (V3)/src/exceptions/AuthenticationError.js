const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 'AuthenticationError', 401);
  }
}

module.exports = AuthenticationError;
