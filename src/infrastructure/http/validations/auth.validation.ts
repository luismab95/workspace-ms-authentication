import { body } from "express-validator";

const usernameBodyValidation = body("username")
  .isString()
  .withMessage("Usuario debe ser un texto")
  .notEmpty({ ignore_whitespace: true })
  .withMessage("Usuario es requerido")
  .isLength({ max: 100 })
  .withMessage("Usuario debe tener un máximo de 100 caracteres");

export const loginValidation = [
  usernameBodyValidation,
  body("password")
    .isString()
    .withMessage("Contraseña debe ser un texto")
    .optional({ nullable: true })
    .isLength({ min: 8 })
    .withMessage("Contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
  body("tokenId")
    .isString()
    .withMessage("Token debe ser un texto")
    .optional({ nullable: true }),
  body("entityId")
    .isInt()
    .withMessage("Entidad debe ser un número")
    .notEmpty()
    .withMessage("Entidad es requerido"),
];

export const loginOtpValidation = [
  usernameBodyValidation,
  body("otp")
    .isString()
    .withMessage("Código de verificación debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Código de verificación es requerido")
    .isLength({ min: 8, max: 8 })
    .withMessage("Código de verificación debe tener 8 caracteres"),
];

export const resendOtpValidation = [
  usernameBodyValidation,
  body("type")
    .isString()
    .withMessage("Tipo debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Tipo es requerido")
    .isLength({ min: 1, max: 1 })
    .withMessage("Tipo debe tener 1 caracter"),
];

export const forgotPasswordValidation = [usernameBodyValidation];
