const joi = require('joi');

const registerSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Email harus berupa alamat email yang valid',
    'any.required': 'Email harus diisi',
  }),
  password: joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
    .required()
    .messages({
      'string.min': 'Password harus memiliki minimal {#limit} karakter',
      'string.pattern.base': 'Password harus memiliki minimal 8 karakter, setidaknya 1 huruf besar, dan 1 angka',
      'any.required': 'Password harus diisi',
    }),
  repeatPassword: joi.string()
    .valid(joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Konfirmasi password harus sama dengan password',
      'any.required': 'Konfirmasi password harus diisi',
    }),
  name: joi.string().required().messages({
    'any.required': 'Nama harus diisi',
  }),
});

const loginSchema = joi.object({
  username: joi.string().required().messages({
    'any.required': 'Username harus diisi',
  }),
  password: joi.string().required().messages({
    'any.required': 'Password harus diisi',
  }),
});

const updatePasswordSchema = joi.object({
  oldPassword: joi.string().required().messages({
    'any.required': 'Kata sandi lama harus diisi.',
  }),
  newPassword: joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .messages({
      'string.min': 'Kata sandi baru harus memiliki minimal {#limit} karakter.',
      'string.pattern.base': 'Kata sandi baru harus memiliki setidaknya 1 huruf kecil, 1 huruf besar, dan 1 angka.',
      'any.required': 'Kata sandi baru harus diisi.',
    }),
  repeatPassword: joi.string().valid(joi.ref('newPassword')).required().messages({
    'any.only': 'Konfirmasi kata sandi harus sama dengan kata sandi baru.',
    'any.required': 'Konfirmasi kata sandi harus diisi.',
  }),
});

const updateUsernameSchema = joi.object({
  newUsername: joi.string().alphanum().min(3).max(30)
    .required()
    .messages({
      'string.alphanum': 'Username should only contain alphanumeric characters',
      'string.min': 'Username should have a minimum length of {#limit} characters',
      'string.max': 'Username should have a maximum length of {#limit} characters',
      'any.required': 'Username is required',
    }),
});

const deleteAccountSchema = joi.object({
  username: joi.string().required().messages({
    'any.required': 'Username is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  updateUsernameSchema,
  deleteAccountSchema,
};
