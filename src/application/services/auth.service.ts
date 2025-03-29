import moment from "moment";
import {
  LoginI,
  LoginOtpI,
  LoginResponseI,
  OtpUserType,
  ResendOtpI,
  ResetPasswordI,
  UserI,
} from "src/domain/entities/auth";
import { AuthRepository } from "src/domain/repositories/auth.repositorty";
import {
  generateRefreshToken,
  generateToken,
} from "src/shared/helpers/jwt.helper";
import {
  AUTH_FAILED,
  FIND_RECORD_FAILED,
  USER_EXISTS,
} from "src/shared/constants/messages";
import { config } from "src/shared/infrastructure/environment";
import { CryptoHelper } from "src/shared/helpers/crypto.helper";
import { GoogleHelper } from "src/shared/helpers/google.helper";
import { LoginTypeEnum } from "src/shared/enums/login.enum";
import { maskString } from "src/shared/helpers/string.helper";
import { OtpTypeEnum } from "src/shared/enums/opt.enum";
import { randomCharacters } from "src/shared/helpers/random.helper";
import { sendMail } from "src/shared/helpers/email.helper";
import { ErrorResponse } from "src/shared/helpers/response.helper";
import { CodeHttpEnum } from "src/shared/enums/http-code.enum";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signUp(user: UserI): Promise<string> {
    const findUser = await this.authRepository.findUser(user.email);
    if (findUser) throw new ErrorResponse(USER_EXISTS, CodeHttpEnum.badRequest);

    if (user.type === LoginTypeEnum.google) {
      const { googleClientId } = config.server;
      const googleHelper = new GoogleHelper();
      const payload = await googleHelper.verify(
        user.password,
        user.email,
        googleClientId
      );
      if (payload === null)
        throw new ErrorResponse(
          AUTH_FAILED("credenciales incorrectas"),
          CodeHttpEnum.badRequest
        );
      user.password = null;
    } else {
      const cryptoHelper = new CryptoHelper();
      user.password = await cryptoHelper.encryptPassword(user.password);
    }

    const newUser = await this.authRepository.createUser(user);

    const contextMail = {
      companyName: "Workspace",
      fullName: `${newUser.firstname} ${newUser.lastname}`,
      mailFooter: "Workspace@info.com",
      username: newUser.email,
      type:
        newUser.type === LoginTypeEnum.google
          ? "Google"
          : "Usuario y contraseña",
    };
    await sendMail(
      "Registro de usuario",
      "register",
      newUser.email,
      contextMail
    );

    return "Se ha registrado correctamente el usuario";
  }

  async signIn(user: LoginI): Promise<LoginResponseI | string> {
    let userLogin = await this.authRepository.findUserForLogin(
      user.email,
      user.type
    );
    if (!userLogin)
      throw new ErrorResponse(
        AUTH_FAILED("la cuenta no existe"),
        CodeHttpEnum.badRequest
      );

    const validAuthentication = await this.authenticateUser(user, userLogin);

    if (!validAuthentication)
      throw new ErrorResponse(
        AUTH_FAILED("credenciales incorrectas"),
        CodeHttpEnum.badRequest
      );

    const otpCode = randomCharacters("COMBINED", 8);
    const textObfuscate = await this.sendOptEmail(
      "login",
      "Código de verificación para inicio de sesión",
      userLogin,
      otpCode,
      OtpTypeEnum.login
    );

    return `Se ha enviado un código de verificación para inicio de sesión a la dirección de correo ${textObfuscate}.`;
  }

  async authenticateUser(user: LoginI, userLogin: UserI) {
    let authenticate = false;

    const { googleClientId } = config.server;
    const googleHelper = new GoogleHelper();
    const cryptoHelper = new CryptoHelper();

    switch (user.type) {
      case LoginTypeEnum.google:
        const payload = await googleHelper.verify(
          user.password,
          user.email,
          googleClientId
        );
        if (payload !== null) {
          authenticate = true;
        }
        break;
      case LoginTypeEnum.local:
        authenticate = await cryptoHelper.comparePassword(
          user.password!,
          userLogin.password!
        );
        break;
      default:
        break;
    }

    return authenticate;
  }

  async generateToken(userLogin: UserI, user: LoginI): Promise<LoginResponseI> {
    const refreshToken = generateRefreshToken({
      id: userLogin.id,
      firstname: userLogin.firstname,
      lastname: userLogin.lastname,
      email: userLogin.email,
    });

    const session = await this.authRepository.saveSession({
      token: refreshToken,
      userId: userLogin.id,
      ipAddress: user.ipAddress,
      information: user.information,
    });

    const token = generateToken({
      id: userLogin.id,
      firstname: userLogin.firstname,
      lastname: userLogin.lastname,
      email: userLogin.email,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
    };
  }

  async singInOtp(loginOtp: LoginOtpI): Promise<LoginResponseI> {
    const userLogin = await this.authRepository.findUser(loginOtp.email);
    if (!userLogin)
      throw new ErrorResponse(
        FIND_RECORD_FAILED("usuario"),
        CodeHttpEnum.badRequest
      );

    const userOtp = await this.authRepository.findOtp(
      loginOtp.otp,
      userLogin.id,
      OtpTypeEnum.login
    );
    if (!userOtp)
      throw new ErrorResponse(
        AUTH_FAILED("el código de verificación es incorrecto"),
        CodeHttpEnum.badRequest
      );

    const otpCreatedAt = moment(userOtp.createdAt);
    const curretDate = moment();
    const differenceInMinutes = Math.abs(
      otpCreatedAt.diff(curretDate, "minutes")
    );
    await this.authRepository.updatedOtpUser(
      loginOtp.otp,
      userLogin?.id!,
      OtpTypeEnum.login
    );

    if (differenceInMinutes >= 5) {
      throw new ErrorResponse(
        AUTH_FAILED("el código de verificación ha expirado"),
        CodeHttpEnum.badRequest
      );
    }

    return await this.generateToken(userLogin, {
      email: loginOtp.email,
      information: loginOtp.information,
      ipAddress: loginOtp.ipAddress,
    } as unknown as LoginI);
  }

  async resendOtp(userOtp: ResendOtpI): Promise<string> {
    const userLogin = await this.authRepository.findUser(userOtp.email);
    if (!userLogin)
      throw new ErrorResponse(
        FIND_RECORD_FAILED("usuario"),
        CodeHttpEnum.badRequest
      );

    const otpCode = randomCharacters("COMBINED", 8);
    const subject =
      userOtp.type === OtpTypeEnum.login
        ? "Código de verificación para inicio de sesión"
        : "Código de verificación para reestablecer contraseña";
    const template =
      userOtp.type === OtpTypeEnum.login ? "login" : "forget-password";
    const textObfuscate = await this.sendOptEmail(
      template,
      subject,
      userLogin,
      otpCode,
      userOtp.type
    );
    return `Se ha enviado un código de verificación para inicio de sesión a la dirección de correo ${textObfuscate}.`;
  }

  async forgetPassword(email: string): Promise<string> {
    const userLogin = await this.authRepository.findUserForLogin(
      email,
      LoginTypeEnum.local
    );
    if (!userLogin)
      throw new ErrorResponse(
        FIND_RECORD_FAILED("usuario"),
        CodeHttpEnum.badRequest
      );

    const otpCode = randomCharacters("COMBINED", 8);
    const textObfuscate = await this.sendOptEmail(
      "forget-password",
      "Código de verificación para reestablecer contraseña",
      userLogin,
      otpCode,
      OtpTypeEnum.resetPassword
    );
    return `Se ha enviado un código de verificación para reestablecer su contraseña a la dirección de correo ${textObfuscate}.`;
  }

  async resetPassword(resetPassword: ResetPasswordI): Promise<string> {
    const cryptoHelper = new CryptoHelper();
    const findUser = await this.authRepository.findUserForLogin(
      resetPassword.email,
      LoginTypeEnum.local
    );
    if (!findUser)
      throw new ErrorResponse(
        FIND_RECORD_FAILED("usuario"),
        CodeHttpEnum.badRequest
      );

    const userOtp = await this.authRepository.findOtp(
      resetPassword.otp,
      findUser.id,
      OtpTypeEnum.resetPassword
    );
    if (!userOtp)
      throw new ErrorResponse(
        AUTH_FAILED("el codigo de verificación es incorrecto"),
        CodeHttpEnum.badRequest
      );

    const otpCreatedAt = moment(userOtp.createdAt);
    const curretDate = moment();
    const differenceInMinutes = Math.abs(
      otpCreatedAt.diff(curretDate, "minutes")
    );

    if (differenceInMinutes >= 5) {
      throw new ErrorResponse(
        AUTH_FAILED("el código de verificación ha expirado"),
        CodeHttpEnum.badRequest
      );
    }

    resetPassword.password = await cryptoHelper.encryptPassword(
      resetPassword.password
    );

    await this.authRepository.updatePassword(
      findUser.id,
      resetPassword.password
    );

    return "Se ha reestablecido su contraseña correctamente";
  }

  async sendOptEmail(
    template: string,
    subject: string,
    userLogin: UserI,
    otp: string,
    type: OtpUserType
  ): Promise<string> {
    await this.authRepository.createOtp({
      type,
      userId: userLogin.id!,
      otp,
    });
    const textObfuscate = maskString(userLogin.email);
    const contextMail = {
      companyName: "Workspace",
      fullName: `${userLogin.firstname} ${userLogin.lastname}`,
      mailFooter: "workspace@info.com",
      code: otp,
    };
    sendMail(subject, template, userLogin.email, contextMail);
    return textObfuscate;
  }

  async signOut(sessionId: number): Promise<string> {
    const findSession = await this.authRepository.findSession(sessionId);
    if (!findSession)
      throw new ErrorResponse(
        FIND_RECORD_FAILED("sesión"),
        CodeHttpEnum.badRequest
      );

    await this.authRepository.updateSession(sessionId);

    return "Se ha cerrado la sesión correctamente";
  }
}
