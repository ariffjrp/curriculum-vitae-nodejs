const joi = require('joi');

const createCertificate = joi.object({
  title: joi.string().required().messages({
    'any.required': 'Judul harus diisi',
  }),
  issuer: joi.string().required().messages({
    'any.required': 'Penerbit harus diisi',
  }),
  issueDate: joi.date().optional().messages({
    'any.required': 'Tanggal Penerbitan harus diisi',
  }),
});

module.exports = {
  createCertificate,
};
