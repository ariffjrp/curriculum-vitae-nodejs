const joi = require('joi');

const createPortofolio = joi.object({
  title: joi.string().required().messages({
    'any.required': 'Title harus diisi',
  }),
  description: joi.string().required().messages({
    'any.required': 'Description harus diisi',
  }),
});

module.exports = {
  createPortofolio,
};
