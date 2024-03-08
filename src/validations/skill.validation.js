const joi = require('joi');

const CreateSkills = joi.object({
  name: joi.string().required().messages({
    'any.required': 'Judul harus diisi',
  }),
});

module.exports = {
  CreateSkills,
};
