const InvariantError = require('../exceptions/InvariantError');

const validationHandler = (Schema, content) => {
  const validationResult = Schema.validate(content);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = validationHandler;
