const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1000).max(new Date().getFullYear()).required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number().positive(),
});

module.exports = { SongPayloadSchema };
