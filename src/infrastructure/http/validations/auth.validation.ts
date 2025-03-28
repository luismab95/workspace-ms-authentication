import { body, param } from "express-validator";

const emailBodyValidation = body("email")
  .isEmail()
  .withMessage("Correo electrónico no válido")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Usuario es requerido");

const typeBodyValidation = body("type")
  .isString()
  .withMessage("Tipo debe ser un texto")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Tipo es requerido")
  .isLength({ min: 1, max: 1 })
  .withMessage("Tipo debe tener 1 caracter");

const passwordBodyValidation = body("password")
  .isString()
  .withMessage("Contraseña debe ser un texto")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Contraseña es requerido");

const otpBodyValidation = body("otp")
  .isString()
  .withMessage("Código de verificación debe ser un texto")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Código de verificación es requerido")
  .isLength({ min: 8, max: 8 })
  .withMessage("Código de verificación debe tener 8 caracteres");

export const loginValidation = [
  emailBodyValidation,
  passwordBodyValidation,
  typeBodyValidation,
];

export const loginOtpValidation = [
  emailBodyValidation,
  otpBodyValidation,
  body("ipAddress")
    .isString()
    .withMessage("Ip pública debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Ip pública es requerido"),
  body("information")
    .isString()
    .withMessage("Información del cliente debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Información del cliente es requerido"),
];

export const resetPasswordValidation = [
  emailBodyValidation,
  otpBodyValidation,
  passwordBodyValidation,
];

export const resendOtpValidation = [emailBodyValidation, typeBodyValidation];

export const forgotPasswordValidation = [emailBodyValidation];

export const signOutValidation = [
  param("id").isNumeric().withMessage("Id debe ser un número"),
];

export const signUpValidation = [
  emailBodyValidation,
  typeBodyValidation,
  passwordBodyValidation,
  body("firstname")
    .isString()
    .withMessage("Nombres debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Nombres es requerido")
    .isLength({ max: 100 })
    .withMessage("Nombres solo permite un máximo de 100 caracteres"),
  body("lastname")
    .isString()
    .withMessage("Apellidos debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Apellidos es requerido")
    .isLength({ max: 100 })
    .withMessage("Apellidos solo permite un máximo de 100 caracteres"),
];
