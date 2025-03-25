export interface LoginInterface {
  username: string;
  password?: string;
  tokenId?: string;
  ipAddress?: string;
  detail?: string;
  entityId?: number;
}

export interface LoginResponseInterface {
  token: string;
  refreshToken: string;
  validate: boolean;
}

export interface ResendOtpInterface {
  username: string;
  type: OtpUserType;
}

export interface TokenInterface {
  id: number;
  sessionId?: number;
  code: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  photo?: string;
  iat?: number;
  exp?: number;
}

export interface AttemptsInterface {
  id?: number;
  userId?: number;
  status?: boolean;
  attempt?: number;
  createdAt?: string | Date;
}

export interface SessionInterface {
  id?: number;
  ipAddress: string;
  token: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  detail: string;
  userId: number;
  active?: boolean;
}
export type OtpUserType = "L" | "R";

export interface OtpUserInterface {
  id?: number;
  otp: string;
  type: OtpUserType | string;
  userId: number;
  used?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LoginOtpInterface {
  username: string;
  otp: string;
  ipAddress?: string;
  detail?: string;
}

export interface UserInterface {
  id?: number;
  code?: string;
  email: string;
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  twoFactorAuth?: boolean;
  validate?: boolean;
  entityId: number;
  userTypeId: number;
  auth: AuthBrokerInterface;
  photo: string;
  entityName: string;
  entitycode: string;
  loginTypeId: number;
}

export interface LoginTypeInterface {
  id: number;
  alias: string;
}

export interface AuthBrokerInterface {
  google?: GoogleInterface;
  local?: LocalInterface;
  ad?: AdInterface;
}

export interface LocalInterface {}

export interface AdInterface {
  host: string;
  port: number;
  domain: string;
  username: string;
  password: string;
  secure: boolean;
}

export interface GoogleInterface {
  domain: string;
}
