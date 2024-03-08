const joi = require('joi');

const createEducation = joi.object({
  schoolName: joi.string().required().messages({
    'any.required': 'Nama Sekolah harus diisi',
  }),
  degree: joi.string().required().messages({
    'any.required': 'Gelar harus diisi',
  }),
  fieldOfStudy: joi.string().required().messages({
    'any.required': 'Bidang Studi harus diisi',
  }),
  startDate: joi.date().required().messages({
    'any.required': 'Tanggal Mulai harus diisi',
  }),
  endDate: joi.date().required().messages({
    'any.required': 'Tanggal Selesai harus diisi',
  }),
});

module.exports = {
  createEducation,
};
