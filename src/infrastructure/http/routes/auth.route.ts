import {
  forgotPasswordValidation,
  loginOtpValidation,
  loginValidation,
  resendOtpValidation,
} from "../validations/auth.validation";
import { AuthController } from "../controllers/auth.controller";
import { RenewTokenAccessMiddleware } from "../middlewares/jwt.middleware";
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
 *     parameters:
 *       - in: header
 *         name: X-Client-IP
 *         description: Dirección IP del cliente.
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-Info
 *         description: Agente de usuario del cliente.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               tokenId:
 *                 type: string
 *                 description: Token para autentificación con terceros
 *               entityId:
 *                 type: number
 *                 description: Id de la entidad para autentificación con terceros
 *                 required: true
 *     responses:
 *       200:
 *         description: Token de autentificación
 *       400:
 *         description: Mensaje de error
 */
router.post("/", [ValidationMiddleware(loginValidation)], controller.login);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/otp:
 *   post:
 *     summary: Segundo factor de autentificación de usuario
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: header
 *         name: X-Client-IP
 *         description: Dirección IP del cliente.
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-Info
 *         description: Agente de usuario del cliente.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre del usuario
 *               otp:
 *                 type: string
 *                 description: Código de verificación del usuario
 *     responses:
 *       200:
 *         description: Token de autentificación
 *       400:
 *         description: Mensaje de error
 */
router.post(
  "/otp",
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
 *       - in: header
 *         name: x-refresh-token
 *         description: Token de refresco.
 *         required: true
 *         schema:
 *           type: string
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
 * /ms-authentication/security/forgot-password:
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
 *               username:
 *                 type: string
 *                 description: Nombre del usuario
 *     responses:
 *       200:
 *         description: Mensaje de verificación
 *       400:
 *         description: Mensaje de error
 */
router.post(
  "/forgot-password",
  [ValidationMiddleware(forgotPasswordValidation)],
  controller.forgotPassword
);

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operaciones relacionadas con autentificación
 * /ms-authentication/security/reset-password:
 *   post:
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
 *               username:
 *                 type: string
 *                 description: Nombre del usuario
 *               otp:
 *                 type: string
 *                 description: Código de verificación del usuario
 *     responses:
 *       200:
 *         description: Mensaje de exito
 *       400:
 *         description: Mensaje de error
 */
router.post(
  "/reset-password",
  [ValidationMiddleware(loginOtpValidation)],
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
 *               username:
 *                 type: string
 *                 description: Nombre del usuario
 *               type:
 *                 type: string
 *                 description: tipo de Código de verificación del usuario L, R
 *     responses:
 *       200:
 *         description: Mensaje de exito
 *       400:
 *         description: Mensaje de error
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
