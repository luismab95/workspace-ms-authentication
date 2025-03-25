import { CodeHttpEnum } from "src/shared/enums/http-code.enum";
import { Request, Response, NextFunction } from "express";
import { responseHelper } from "src/shared/helpers/response.helper";
import { ServiceContainer } from "src/shared/infrastructure/services-container";
import {
  LoginInterface,
  LoginOtpInterface,
  ResendOtpInterface,
} from "src/domain/entities/auth";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: LoginInterface = req.body;
      user.ipAddress = req.headers["x-client-ip"] as string;
      user.detail = req.headers["x-device-info"] as string;
      const data = await ServiceContainer.auth.login(user);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async twoFactorAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userOtp: LoginOtpInterface = req.body;
      userOtp.ipAddress = req.headers["x-client-ip"] as string;
      userOtp.detail = req.headers["x-device-info"] as string;
      const data = await ServiceContainer.auth.validOtp(userOtp);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userOtp: ResendOtpInterface = req.body as ResendOtpInterface;
      const data = await ServiceContainer.auth.resendOtp(userOtp);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const username: string = req.body.username;
      const data = await ServiceContainer.auth.forgotPassword(username);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userOtp: LoginOtpInterface = req.body;
      const data = await ServiceContainer.auth.resetPassword(userOtp);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async getManifest(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await ServiceContainer.auth.getManifest();
      res.status(CodeHttpEnum.ok).json(data);
    } catch (error) {
      next(error);
    }
  }
}
