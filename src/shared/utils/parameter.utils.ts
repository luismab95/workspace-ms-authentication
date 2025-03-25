import { ParamInterface } from "src/domain/entities/param";
import {
  AdEnum,
  AppEnum,
  CompanyEnum,
  GoogleEnum,
  LogoEnum,
  MailEnum,
  OtpEnum,
} from "../enums/parameter.enum";
import {
  AdParamInterface,
  AppInterface,
  CompanyParamInterface,
  GoogleParamInterface,
  LogoParamInterface,
  MailParamInterface,
  OtpParamInterface,
} from "../interfaces/param.interface";

export const getMailParameter = (params: ParamInterface[]) => {
  const mailParams: any = {};

  Object.values(MailEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      mailParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración del correo.`
      );
    }
  });

  return {
    host: mailParams["MAILER_HOST"],
    port: Number(mailParams["MAILER_PORT"]),
    username: mailParams["MAILER_USER"],
    password: mailParams["MAILER_PASSWORD"],
    from: mailParams["MAILER_FROM"],
    secure: mailParams["MAILER_SECURE"] === "true",
  } as MailParamInterface;
};

export const getLogoParameter = (params: ParamInterface[]) => {
  const logoParams: any = {};
  const staticUrl = params.find(
    (param) => param.code === AppEnum.staticUrl
  )?.value;

  Object.values(LogoEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      logoParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración del logos.`
      );
    }
  });

  return {
    primary: staticUrl + logoParams["LOGO_PRIMARY"],
    secondary: staticUrl + logoParams["LOGO_SECONDARY"],
    mail: staticUrl + logoParams["LOGO_MAIL"],
    authBackground: staticUrl + logoParams["LOGO_AUTH_BACKGROUND"],
    icon: staticUrl + logoParams["LOGO_ICON"],
  } as LogoParamInterface;
};

export const getCompanyParameter = (params: ParamInterface[]) => {
  const companyParams: any = {};
  const staticUrl = params.find(
    (param) => param.code === AppEnum.staticUrl
  )?.value;

  Object.values(CompanyEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      companyParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración de la compañia.`
      );
    }
  });

  return {
    name: companyParams["COMPANY_NAME"],
    mail: companyParams["COMPANY_MAIL"],
    resetPassword: companyParams["COMPANY_RESET_PASSWORD"],
    terms: staticUrl + companyParams["COMPANY_TERMS"],
  } as CompanyParamInterface;
};

export const getAdParameter = (params: ParamInterface[]) => {
  const logoParams: any = {};

  Object.values(AdEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      logoParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración del directorio activo.`
      );
    }
  });

  return {
    host: logoParams["AD_HOST"],
    domain: logoParams["AD_DOMAIN"],
    port: Number(logoParams["AD_PORT"]),
    username: logoParams["AD_USER"],
    password: logoParams["AD_PASSWORD"],
    secure: logoParams["AD_SECURE"] === "true",
  } as AdParamInterface;
};

export const getGoogleParameter = (params: ParamInterface[]) => {
  const googleParams: any = {};

  Object.values(GoogleEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      googleParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración Google.`
      );
    }
  });

  return {
    domain: googleParams["GOOGLE_DOMAIN"],
    clientId: googleParams["GOOGLE_CLIENT_ID"],
  } as GoogleParamInterface;
};

export const getAppParameter = (params: ParamInterface[]) => {
  const appParams: any = {};

  Object.values(AppEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      appParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración de la aplicación.`
      );
    }
  });

  return {
    authUser: appParams["APP_USER"],
    twoFactor: appParams["APP_TWO_FACTOR"],
    primary: appParams["APP_PRIMARY_COLOR"],
    secondary: appParams["APP_SECONDARY_COLOR"],
    type: appParams["APP_LAYOUT_TYPE"],
    sidebar: appParams["APP_SIDEBAR_TYPE"],
    staticUrl: appParams["APP_STATICS_URL"],
    specilaPwd: appParams["APP_PWD_SPECIAL"] === true,
    numberPwd: appParams["APP_PWD_NUMBER"] === true,
    mayusPwd: appParams["APP_PWD_MAYUS"] === true,
    longPwd: Number(appParams["APP_PWD_LONG"]),
    inactivity: Number(appParams["APP_INACTIVITY"]),
    attemps: Number(appParams["APP_ATTEMPS_LOGIN"]),
  } as AppInterface;
};

export const getOtpParameter = (params: ParamInterface[]) => {
  const otpParams: any = {};

  Object.values(OtpEnum).forEach((property) => {
    const param = params.find((p) => p.code === property);
    if (param) {
      otpParams[property] = param.value;
    } else {
      throw new Error(
        `Falta el parámetro ${property} en la configuración del otp.`
      );
    }
  });

  return {
    long: otpParams["OTP_LONG"],
    typeOtp: otpParams["OTP_TYPE"],
  } as OtpParamInterface;
};
