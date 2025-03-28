export interface LoginI {
  type: UserType;
  email: string;
  password: string;
  ipAddress: string;
  information: string;
}

export interface LoginResponseI {
  token: string;
  refreshToken: string;
}

export interface ResendOtpI {
  email: string;
  type: OtpUserType;
}

export type OtpUserType = "L" | "R";
export type UserType = "L" | "G";

export interface TokenI {
  id: number;
  sessionId?: number;
  email: string;
  firstname: string;
  lastname: string;
  iat?: number;
  exp?: number;
}

export interface SessionI {
  id?: number;
  token: string;
  ipAddress: string;
  information: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  userId: number;
  active?: boolean;
}

export interface OtpUserI {
  id?: number;
  otp: string;
  type: OtpUserType | string;
  userId: number;
  used?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LoginOtpI {
  email: string;
  otp: string;
  ipAddress?: string;
  information?: string;
}

export interface ResetPasswordI {
  email: string;
  password: string;
  otp: string;
}

export interface UserI {
  id?: number;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  type: UserType | string;
  status?: boolean;
}
