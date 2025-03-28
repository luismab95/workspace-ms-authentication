import {
  forgotPasswordValidation,
  loginOtpValidation,
  loginValidation,
  resendOtpValidation,
  resetPasswordValidation,
  signOutValidation,
  signUpValidation,
} from "../validations/auth.validation";
import { AuthController } from "../controllers/auth.controller";
import {
  RenewTokenAccessMiddleware,
  VerifyTokenAccessMiddleware,
} from "../middlewares/jwt.middleware";
import { responseHelper } from "src/shared/helpers/response.helper";
import { ValidationMiddleware } from "../middlewares/express-validator.middleware";
import express, { Request, Response } from "express";

//DEPENDENCIES
const controller = new AuthController();

//ROUTES
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *                 required: true
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 required: true
 *     responses:
 *       200:
 *         description: Token de autentificación o mensaje de exito
 *       400:
 *         description: Mensaje de error
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.post("/", [ValidationMiddleware(loginValidation)], controller.signIn);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/register:
 *   post:
 *     summary: Registro de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 required: true
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 required: true
 *               firstname:
 *                 type: string
 *                 description: Nombres del usuario
 *                 required: true
 *               lastname:
 *                 type: string
 *                 description: Apellidos del usuario
 *                 required: true
 *               type:
 *                 type: string
 *                 description: Tipo de login
 *                 required: true
 *     responses:
 *       200:
 *         description: Mensaje de exito
 *       400:
 *         description: Mensaje de error
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.post(
  "/register",
  [ValidationMiddleware(signUpValidation)],
  controller.signUp
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/mfa:
 *   post:
 *     summary: Segundo factor de autentificación de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 required: true 
 *               otp:
 *                 type: string
 *                 description: Código de verificación del usuario
 *                 required: true 
 *               ipAddress:
 *                 type: string
 *                 description: Ip pública del cliente
 *                 required: true
 *               information:
 *                 type: string
 *                 description: Información del cliente
 *                 required: true
 *     responses:
 *       200:
 *         description: Token de autentificación
 *       400:
 *         description: Mensaje de error
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.post(
  "/mfa",
  [ValidationMiddleware(loginOtpValidation)],
  controller.twoFactorAuth
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/refresh-token/{id}:
 *   post:
 *     summary: Refrescar token de acceso
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la sesión
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Token de autentificación
 *       400:
 *         description: Mensaje de error
 *       401:
 *         description: Acceso no autorizado
 */
router.post(
  "/refresh-token/:id",
  RenewTokenAccessMiddleware,
  (req: Request, res: Response) => {
    responseHelper(req, res, req.headers["x-access-token"] as string);
  }
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/session/{id}:
 *   delete:
 *     summary: Cerrar sessión
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la sesión
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensaje de exito
 *       400:
 *         description: Mensaje de error
 *       401:
 *         description: Acceso no autorizado
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.delete(
  "/session/:id",
  [ValidationMiddleware(signOutValidation), VerifyTokenAccessMiddleware],
  controller.signOut
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/forget-password:
 *   post:
 *     summary: Olvido su contraseña
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 required: true
 *     responses:
 *       200:
 *         description: Mensaje de verificación
 *       400:
 *         description: Mensaje de error
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.post(
  "/forget-password",
  [ValidationMiddleware(forgotPasswordValidation)],
  controller.forgotPassword
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/reset-password:
 *   patch:
 *     summary: Resetear contraseña
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 required: true
 *               otp:
 *                 type: string
 *                 description: Código de verificación del usuario
 *                 required: true
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *                 required: true
 *     responses:
 *       200:
 *         description: Mensaje de exito
 *       400:
 *         description: Mensaje de error
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.patch(
  "/reset-password",
  [ValidationMiddleware(resetPasswordValidation)],
  controller.resetPassword
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/resend-otp:
 *   post:
 *     summary: Reenviar otp
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 required: true
 *               type:
 *                 type: string
 *                 description: tipo de Código de verificación del usuario L, R
 *                 required: true
 *     responses:
 *       200:
 *         description: Mensaje de exito
 *       400:
 *         description: Mensaje de error
 *       422:
 *         description: Mensaje de error de valdiación
 */
router.post(
  "/resend-otp",
  [ValidationMiddleware(resendOtpValidation)],
  controller.resendOtp
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/manifest:
 *   get:
 *     summary: Información de microfronts
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: manifiesto en JSON
 *       400:
 *         description: Mensaje de error
 */
router.get("/manifest", controller.getManifest);

export default router;
