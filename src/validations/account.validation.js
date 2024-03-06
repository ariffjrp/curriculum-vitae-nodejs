const joi = require('joi');

const updateAccountSchema = joi.object({
  name: joi.string().optional().messages({
    'string.base': 'Name should be a string',
  }),
  address: joi.string().optional().messages({
    'string.base': 'Address should be a string',
  }),
  phone: joi.string().optional().messages({
    'string.base': 'Phone should be a string',
  }),
  birthdate: joi.date().iso().optional().messages({
    'date.base': 'Birthdate should be a valid date',
    'date.iso': 'Birthdate should be in ISO 8601 format',
  }),
  gender: joi.string().valid('male', 'female', 'other').optional().messages({
    'any.only': 'Gender should be "male", "female", or "other"',
  }),
  bio: joi.string().optional().messages({
    'string.base': 'Bio should be a string',
  }),
});

module.exports = {
    updateAccountSchema,
};