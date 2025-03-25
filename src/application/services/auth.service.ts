import moment from "moment";
import {
  LoginInterface,
  LoginResponseInterface,
  UserInterface,
  LoginTypeInterface,
  LoginOtpInterface,
  ResendOtpInterface,
  OtpUserType,
} from "src/domain/entities/auth";
import { ManifestInterface } from "src/domain/entities/menu";
import { ParamInterface } from "src/domain/entities/param";
import { ActiveDirectoryRepository } from "src/domain/repositories/active-directory.repository";
import { AuthRepository } from "src/domain/repositories/auth.repositorty";
import { MenuRepository } from "src/domain/repositories/menu.repository";
import { ParamRepository } from "src/domain/repositories/param.repository";
import { config } from "src/shared/infrastructure/environment";
import { AUTH_FAILED, FIND_RECORD_FAILED } from "src/shared/constants/messages";
import { LoginTypeEnum } from "src/shared/enums/login.enum";
import { OtpTypeEnum } from "src/shared/enums/opt.enum";
import { CryptoHelper } from "src/shared/helpers/crypto.helper";
import { sendMail } from "src/shared/helpers/email.helper";
import { GoogleHelper } from "src/shared/helpers/google.helper";
import {
  generateRefreshToken,
  generateToken,
  generateTokenResetPassword,
} from "src/shared/helpers/jwt.helper";
import { randomCharacters } from "src/shared/helpers/random.helper";
import { maskString } from "src/shared/helpers/string.helper";
import {
  AdParamInterface,
  GoogleParamInterface,
  AppInterface,
} from "src/shared/interfaces/param.interface";
import {
  getAppParameter,
  getOtpParameter,
  getLogoParameter,
  getCompanyParameter,
  getGoogleParameter,
  getAdParameter,
} from "src/shared/utils/parameter.utils";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly paramRepository: ParamRepository,
    private readonly activeDirectoryRepository: ActiveDirectoryRepository,
    private readonly menuRepository: MenuRepository
  ) {}

  async login(user: LoginInterface): Promise<LoginResponseInterface | string> {
    let response: LoginResponseInterface;
    let userLogin = await this.authRepository.findUserForLogin(user.username);
    if (userLogin === undefined || userLogin.entityId !== user.entityId)
      throw new Error(
        AUTH_FAILED(
          "la cuenta se encuentra inaccesible; puede estar bloqueada o no existe"
        )
      );

    const findLoginType = await this.authRepository.findUserTypeLogin(
      userLogin.loginTypeId
    );
    if (findLoginType === undefined)
      throw new Error(
        AUTH_FAILED("no se encontro información de tipo de login de usuario")
      );

    const findParameters = await this.paramRepository.getParams();
    const validAuth = await this.authenticateUser(
      user,
      userLogin,
      findParameters,
      findLoginType
    );
    const autenticate: boolean = validAuth.authenticate;
    userLogin = validAuth.userLogin;

    const appParameter = getAppParameter(findParameters);
    if (!autenticate) {
      await this.validAttempt(userLogin, appParameter);
    }

    if (
      ((appParameter.twoFactor === "USER" && userLogin.twoFactorAuth) ||
        appParameter.twoFactor === "SYSTEM") &&
      findLoginType.alias !== LoginTypeEnum.google
    ) {
      const optParameters = getOtpParameter(findParameters);
      const otp = randomCharacters(
        optParameters.typeOtp,
        Number(optParameters.long)
      );

      await this.authRepository.createOtp({
        type: OtpTypeEnum.login,
        userId: userLogin.id!,
        otp,
      });
      const textObfuscate = maskString(userLogin.email);
      const logoParameter = getLogoParameter(findParameters);
      const companyParameter = getCompanyParameter(findParameters);
      const contextMail = {
        companyName: companyParameter.name,
        imageHeader: logoParameter.mail,
        fullName: `${userLogin.firstname} ${userLogin.lastname}`,
        mailFooter: companyParameter.mail,
        code: otp,
      };
      sendMail(
        "Código de verificación para inicio de sesión",
        "login",
        userLogin.email,
        contextMail,
        findParameters
      );

      return `Se ha enviado un código de verificación para inicio de sesión a la dirección de correo ${textObfuscate}.`;
    } else {
      response = await this.generateToken(userLogin, user);
    }

    if (!userLogin.validate && findLoginType.alias !== LoginTypeEnum.local) {
      await this.authRepository.updateValidateAndTermsUser(userLogin.id!);
      response.validate = true;
    }

    return response;
  }

  async authenticateUser(
    user: LoginInterface,
    userLogin: UserInterface,
    findParameters: ParamInterface[],
    findLoginType: LoginTypeInterface
  ) {
    let authenticate = false;
    let adParameter: AdParamInterface;
    let googleParameter: GoogleParamInterface =
      getGoogleParameter(findParameters);
    const { entityCode } = config.server;
    const cryptoHelper = new CryptoHelper();
    const googleHelper = new GoogleHelper();

    switch (findLoginType.alias) {
      case LoginTypeEnum.ad:
        if (entityCode !== userLogin.entitycode) {
          adParameter = userLogin.auth?.ad!;
        } else {
          adParameter = getAdParameter(findParameters);
        }
        authenticate = await this.activeDirectoryRepository.authenticate(
          user.username,
          user.password!,
          adParameter
        );
        break;

      case LoginTypeEnum.google:
        {
          if (entityCode !== userLogin.entitycode) {
            googleParameter.domain = userLogin.auth?.google!.domain;
          }
          const payload = await googleHelper.verify(
            user.tokenId!,
            user.username,
            googleParameter.clientId,
            googleParameter.domain
          );
          if (payload !== null) {
            authenticate = true;
            userLogin.photo = payload.picture ?? "";
          }
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

    return { userLogin, authenticate };
  }

  async validAttempt(
    userLogin: UserInterface,
    appParameter: AppInterface
  ): Promise<void> {
    const userAttempt = await this.authRepository.getLastAttempt(userLogin.id!);
    const attempt = userAttempt === undefined ? 1 : userAttempt.attempt! + 1;
    await this.authRepository.createAttempt({
      userId: userLogin.id!,
      attempt: attempt > appParameter.attemps ? 1 : attempt,
    });
    if (attempt === appParameter.attemps) {
      await this.authRepository.toggleBloquedUser(userLogin.id!, true);
      throw new Error(
        AUTH_FAILED(
          "su cuenta ha sido bloqueada por razones de seguridad, debido a múltiples intentos de acceso fallidos."
        )
      );
    }
    throw new Error(AUTH_FAILED("creedenciales incorrectas"));
  }

  async generateToken(
    userLogin: UserInterface,
    user: LoginInterface
  ): Promise<LoginResponseInterface> {
    const refreshToken = generateRefreshToken({
      id: userLogin.id!,
      code: userLogin.code!,
      username: userLogin.username,
      firstname: userLogin.firstname,
      lastname: userLogin.lastname,
      email: userLogin.email,
      photo: userLogin.photo,
    });

    const session = await this.authRepository.saveSession({
      token: refreshToken,
      userId: userLogin.id!,
      ipAddress: user.ipAddress!,
      detail: user.detail!,
    });

    const token = generateToken({
      id: userLogin.id!,
      code: userLogin.code!,
      username: userLogin.username,
      firstname: userLogin.firstname,
      lastname: userLogin.lastname,
      email: userLogin.email,
      sessionId: session.id!,
      photo: userLogin.photo,
    });

    await this.authRepository.updatedStatusAttempt(userLogin.id!, false);
    return {
      token,
      refreshToken,
      validate: userLogin.validate!,
    };
  }

  async validOtp(loginOtp: LoginOtpInterface): Promise<LoginResponseInterface> {
    const userLogin = await this.authRepository.findUserForLogin(
      loginOtp.username
    );
    if (userLogin === undefined) throw new Error(FIND_RECORD_FAILED("usuario"));

    const userOtp = await this.authRepository.findOtp(
      loginOtp.otp,
      userLogin?.id!,
      OtpTypeEnum.login
    );
    if (userOtp === undefined)
      throw new Error(AUTH_FAILED("el código de verificación es incorrecto"));

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
      throw new Error(AUTH_FAILED("el código de verificación ha expirado"));
    }

    return await this.generateToken(userLogin, {
      username: loginOtp.username,
      detail: loginOtp.detail,
      ipAddress: loginOtp.ipAddress,
    });
  }

  async resendOtp(userOtp: ResendOtpInterface): Promise<string> {
    const userLogin = await this.authRepository.findUserForLogin(
      userOtp.username
    );
    if (userLogin === undefined) throw new Error(FIND_RECORD_FAILED("usuario"));

    await this.validUserType(userLogin, 2);

    const findParameters = await this.paramRepository.getParams();
    const optParameters = getOtpParameter(findParameters);
    const otp = randomCharacters(
      optParameters.typeOtp,
      Number(optParameters.long)
    );
    const textObfuscate = await this.sendOptEmail(
      "login",
      "Código de verificación para inicio de sesión",
      findParameters,
      userLogin,
      otp,
      userOtp.type
    );
    return `Se ha enviado un código de verificación para inicio de sesión a la dirección de correo ${textObfuscate}.`;
  }

  async forgotPassword(username: string): Promise<string> {
    const userLogin = await this.authRepository.findUserForLogin(username);
    if (userLogin === undefined) throw new Error(FIND_RECORD_FAILED("usuario"));

    await this.validUserType(userLogin, 1);

    const findParameters = await this.paramRepository.getParams();
    const optParameters = getOtpParameter(findParameters);
    const otp = randomCharacters(
      optParameters.typeOtp,
      Number(optParameters.long)
    );

    const textObfuscate = await this.sendOptEmail(
      "forgot-password",
      "Código de verificación para recuperar contraseña",
      findParameters,
      userLogin,
      otp,
      OtpTypeEnum.resetPassword
    );
    return `Se ha enviado un código de verificación para recuperar tu contraseña a la dirección de correo ${textObfuscate}.`;
  }

  async resetPassword(loginOtp: LoginOtpInterface): Promise<string> {
    const userLogin = await this.authRepository.findUserForLogin(
      loginOtp.username
    );

    if (userLogin === undefined) throw new Error(FIND_RECORD_FAILED("usuario"));

    await this.validUserType(userLogin, 1);

    const userOtp = await this.authRepository.findOtp(
      loginOtp.otp,
      userLogin?.id!,
      OtpTypeEnum.resetPassword
    );
    if (userOtp === undefined)
      throw new Error(AUTH_FAILED("el codigo de verificación es incorrecto"));

    const otpCreatedAt = moment(userOtp.createdAt);
    const curretDate = moment();
    const differenceInMinutes = Math.abs(
      otpCreatedAt.diff(curretDate, "minutes")
    );

    if (differenceInMinutes >= 5) {
      throw new Error(AUTH_FAILED("el código de verificación ha expirado"));
    }

    const findParameters = await this.paramRepository.getParams();
    const textObfuscate = maskString(userLogin.email);
    const tokenResetPassword = generateTokenResetPassword({
      id: userLogin.id!,
      code: userLogin.code!,
      username: userLogin.username,
      firstname: userLogin.firstname,
      lastname: userLogin.lastname,
      email: userLogin.email,
    });

    const logoParameter = getLogoParameter(findParameters);
    const companyParameter = getCompanyParameter(findParameters);
    const contextMail = {
      companyName: companyParameter.name,
      imageHeader: logoParameter.mail,
      fullName: `${userLogin.firstname} ${userLogin.lastname}`,
      mailFooter: companyParameter.mail,
      link: `${companyParameter.resetPassword}${tokenResetPassword}`,
    };
    sendMail(
      "Enlace para resetear la contraseña",
      "reset-password",
      userLogin.email,
      contextMail,
      findParameters
    );

    await this.authRepository.updatedOtpUser(
      loginOtp.otp,
      userLogin?.id!,
      OtpTypeEnum.resetPassword
    );

    return `Se ha enviado un enlace para resetear tu contraseña a la dirección de correo ${textObfuscate}.`;
  }

  async validUserType(userLogin: UserInterface, option: number): Promise<void> {
    const findLoginType = await this.authRepository.findUserTypeLogin(
      userLogin.loginTypeId
    );
    if (findLoginType === undefined)
      throw new Error(
        "no se encontro información de tipo de login de usuario."
      );

    if (option === 1) {
      if (findLoginType.alias !== LoginTypeEnum.local)
        throw new Error(
          `No se puede recuperar la contraseña para usuarios con tipo de login ${findLoginType.alias}.`
        );
    }
    if (option === 2) {
      if (findLoginType.alias === LoginTypeEnum.google)
        throw new Error(
          `No se puede crear el código de verificación para usuarios con tipo de login ${LoginTypeEnum.google}.`
        );
    }
  }

  async getManifest(): Promise<ManifestInterface> {
    const manifest = {} as ManifestInterface;
    const menus = await this.menuRepository.get();
    menus.forEach((menu) => {
      manifest[randomCharacters("LETTER", 8)] = { ...menu };
    });
    return JSON.parse(JSON.stringify(manifest));
  }

  async sendOptEmail(
    template: string,
    subject: string,
    findParameters: ParamInterface[],
    userLogin: UserInterface,
    otp: string,
    type: OtpUserType
  ): Promise<string> {
    await this.authRepository.createOtp({
      type,
      userId: userLogin.id!,
      otp,
    });
    const textObfuscate = maskString(userLogin.email);
    const logoParameter = getLogoParameter(findParameters);
    const companyParameter = getCompanyParameter(findParameters);
    const contextMail = {
      companyName: companyParameter.name,
      imageHeader: logoParameter.mail,
      fullName: `${userLogin.firstname} ${userLogin.lastname}`,
      mailFooter: companyParameter.mail,
      code: otp,
    };
    sendMail(subject, template, userLogin.email, contextMail, findParameters);
    return textObfuscate;
  }
}
