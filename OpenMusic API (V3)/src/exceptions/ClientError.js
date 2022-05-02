class ClientError extends Error {
  constructor(message, name = 'ClientError', statusCode = 400) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

module.exports = ClientError;
