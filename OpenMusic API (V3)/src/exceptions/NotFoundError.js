const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 'NotFoundError', 404);
  }
}

module.exports = NotFoundError;
