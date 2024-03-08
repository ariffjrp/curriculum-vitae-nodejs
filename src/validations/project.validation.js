const joi = require('joi');

const createProject = joi.object({
  title: joi.string().required().messages({
    'any.required': 'Title harus diisi',
  }),
  description: joi.string().required().messages({
    'any.required': 'Description harus diisi',
  }),
  startDate: joi.date().required().messages({
    'any.required': 'Start Date harus diisi',
  }),
  endDate: joi.string().required().messages({
    'any.required': 'End Date Of Study harus diisi',
  }),
});

module.exports = {
  createProject,
};
