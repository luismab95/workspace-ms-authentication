import {
  OtpUserI,
  OtpUserType,
  SessionI,
  UserI,
  UserType,
} from "../entities/auth";

export interface AuthRepository {
  saveSession(session: SessionI): Promise<SessionI>;
  createUser(user: UserI): Promise<UserI>;
  createOtp(otp: OtpUserI): Promise<OtpUserI>;
  updatedOtpUser(otp: string, userId: number, type: OtpUserType): Promise<void>;
  findOtp(
    otp: string,
    userId: number,
    type: OtpUserType
  ): Promise<OtpUserI | undefined>;
  findUserForLogin(email: string, type: UserType): Promise<UserI | undefined>;
  findUser(email: string): Promise<UserI | undefined>;
  updatePassword(userId: number, password: string): Promise<void>;
  findSession(sessionId: number): Promise<SessionI | undefined>;
  updateSession(sessionId: number): Promise<void>;
}
