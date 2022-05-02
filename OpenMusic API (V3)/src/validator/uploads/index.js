const { PictureHeadersSchema } = require('./schema');
const validationHandler = require('../../utils/validation');

const UploadsValidator = {
  validatePictureHeaders: (headers) => validationHandler(PictureHeadersSchema, headers),
};

module.exports = UploadsValidator;
