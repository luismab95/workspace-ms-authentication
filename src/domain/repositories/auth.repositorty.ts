import {
  AttemptsInterface,
  SessionInterface,
  OtpUserInterface,
  OtpUserType,
  UserInterface,
  LoginTypeInterface,
} from "../entities/auth";

export interface AuthRepository {
  createAttempt(attempt: AttemptsInterface): Promise<AttemptsInterface>;
  updatedStatusAttempt(userId: number, status: boolean): Promise<void>;
  getLastAttempt(userId: number): Promise<AttemptsInterface | undefined>;
  saveSession(session: SessionInterface): Promise<SessionInterface>;
  createOtp(otp: OtpUserInterface): Promise<OtpUserInterface>;
  updatedOtpUser(otp: string, userId: number, type: OtpUserType): Promise<void>;
  updateValidateAndTermsUser(userId: number): Promise<void>;
  findOtp(
    otp: string,
    userId: number,
    type: OtpUserType
  ): Promise<OtpUserInterface | undefined>;
  findUserForLogin(username: string): Promise<UserInterface | undefined>;
  findUserTypeLogin(
    loginTypeId: number
  ): Promise<LoginTypeInterface | undefined>;
  toggleBloquedUser(userId: number, status: boolean): Promise<void>;
}
