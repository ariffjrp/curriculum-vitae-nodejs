const joi = require('joi');

const createIntership = joi.object({
  companyName: joi.string().required().messages({
    'any.required': 'Company Name harus diisi',
  }),
  role: joi.string().required().messages({
    'any.required': 'Role harus diisi',
  }),
  startDate: joi.date().required().messages({
    'any.required': 'Start Date harus diisi',
  }),
  endDate: joi.string().required().messages({
    'any.required': 'End Date Of Study harus diisi',
  }),
});

module.exports = {
  createIntership,
};
