export interface MailParamInterface {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
  to?: string;
  secure: boolean;
}

export interface LogoParamInterface {
  primary: string;
  secondary: string;
  mail: string;
  authBackground: string;
  icon: string;
}

export interface OtpParamInterface {
  long: number;
  typeOtp: "NUMBER" | "LETTER" | "COMBINED";
}

export interface CompanyParamInterface {
  name: string;
  mail: string;
  resetPassword: string;
  terms: string;
}

export interface AdParamInterface {
  host: string;
  domain: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
}

export interface GoogleParamInterface {
  domain: string;
  clientId: string;
}

export interface AppInterface {
  authUser: string;
  twoFactor: string;
  primary: string;
  secondary: string;
  type: string;
  sidebar: string;
  staticUrl: string;
  specilaPwd: boolean;
  numberPwd: boolean;
  mayusPwd: boolean;
  longPwd: number;
  inactivity: number;
  attemps: number;
}
