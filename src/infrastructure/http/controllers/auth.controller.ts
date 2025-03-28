import { CodeHttpEnum } from "src/shared/enums/http-code.enum";
import { Request, Response, NextFunction } from "express";
import { responseHelper } from "src/shared/helpers/response.helper";
import { ServiceContainer } from "src/shared/infrastructure/services-container";
import {
  LoginI,
  LoginOtpI,
  ResendOtpI,
  ResetPasswordI,
  UserI,
} from "src/domain/entities/auth";

export class AuthController {
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: LoginI = req.body;
      const data = await ServiceContainer.auth.signIn(user);
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
      const userOtp: LoginOtpI = req.body;
      const data = await ServiceContainer.auth.singInOtp(userOtp);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: UserI = req.body;
      const data = await ServiceContainer.auth.signUp(user);
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
      const userOtp: ResendOtpI = req.body as ResendOtpI;
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
      const email: string = req.body.email;
      const data = await ServiceContainer.auth.forgetPassword(email);
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
      const resetPassword: ResetPasswordI = req.body;
      const data = await ServiceContainer.auth.resetPassword(resetPassword);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async signOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sessionId: number = Number(req.params.sessionId);
      const data = await ServiceContainer.auth.signOut(sessionId);
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
