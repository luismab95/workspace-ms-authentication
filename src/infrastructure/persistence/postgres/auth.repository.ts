import {
  LoginAttempt,
  OtpUser,
  User,
  Entities,
  UserTypeLogin,
  Session,
} from "lib-database/src/entities";
import { Database } from "lib-database/src/shared/config/database";
import {
  AttemptsInterface,
  SessionInterface,
  OtpUserInterface,
  OtpUserType,
  UserInterface,
  LoginTypeInterface,
} from "src/domain/entities/auth";
import { AuthRepository } from "src/domain/repositories/auth.repositorty";
import { DATABASE_ERR } from "src/shared/constants/messages";
import { ErrorResponse } from "src/shared/helpers/response.helper";

export class AuthRepositoryImpl implements AuthRepository {
  async createAttempt(attempt: AttemptsInterface): Promise<AttemptsInterface> {
    try {
      const dataSource = Database.getConnection();
      const loginAttemptRepository = dataSource.getRepository(LoginAttempt);
      const result = loginAttemptRepository.create(attempt as LoginAttempt);
      return await loginAttemptRepository.save(result);
    } catch (err) {
      throw new Error(DATABASE_ERR);
    }
  }

  async updatedStatusAttempt(userId: number, status: boolean): Promise<void> {
    try {
      const dataSource = Database.getConnection();
      await dataSource
        .createQueryBuilder()
        .update(LoginAttempt)
        .set({ status })
        .where("user_id = :userId", { userId })
        .andWhere("status = true")
        .execute();
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, 400);
    }
  }

  async getLastAttempt(userId: number): Promise<AttemptsInterface | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        'la.id as "id"',
        'la.attempt as "attempt"',
        'la.user_id as "userId"',
        'la.created_at as "createdAt"',
        'la.status as "status"',
      ])
      .from(LoginAttempt, "la")
      .where(`la.user_id = :userId`, { userId })
      .andWhere("la.status = true")
      .orderBy("la.id", "DESC");

    return await query.getRawOne<AttemptsInterface>();
  }

  async saveSession(session: SessionInterface): Promise<SessionInterface> {
    try {
      const dataSource = Database.getConnection();
      const sessionRepository = dataSource.getRepository(Session);
      const result = sessionRepository.create(session as Session);
      return await sessionRepository.save(result);
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, 400);
    }
  }

  async createOtp(otp: OtpUserInterface): Promise<OtpUserInterface> {
    try {
      const dataSource = Database.getConnection();
      const otpRepository = dataSource.getRepository(OtpUser);
      const result = otpRepository.create(otp as OtpUser);
      return await otpRepository.save(result);
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, 400);
    }
  }

  async findOtp(
    otp: string,
    userId: number,
    type: OtpUserType
  ): Promise<OtpUserInterface | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        'ot.id as "id"',
        'ot.otp as "otp"',
        'ot.user_id as "userId"',
        'ot.created_at as "createdAt"',
        'ot.updated_at as "updatedAt"',
        'ot.used as "used"',
        'ot.type as "type"',
      ])
      .from(OtpUser, "ot")
      .where(`ot.user_id = :userId`, { userId })
      .andWhere(`ot.used = :used`, { used: false })
      .andWhere(`ot.type = :type`, { type })
      .andWhere(`ot.otp = :otp`, { otp });

    return await query.getRawOne<OtpUserInterface>();
  }

  async updatedOtpUser(
    otp: string,
    userId: number,
    type: OtpUserType
  ): Promise<void> {
    try {
      const dataSource = Database.getConnection();
      await dataSource
        .createQueryBuilder()
        .update(OtpUser)
        .set({ used: true })
        .where("user_id = :userId", { userId })
        .andWhere("otp = :otp", { otp })
        .andWhere("type = :type", { type })
        .andWhere("used = false")
        .execute();
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, 400);
    }
  }

  async updateValidateAndTermsUser(userId: number): Promise<void> {
    try {
      const dataSource = Database.getConnection();
      await dataSource
        .createQueryBuilder()
        .update(User)
        .set({ terms: true, validate: true })
        .where("id = :userId", { userId })
        .execute();
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, 400);
    }
  }

  async findUserForLogin(username: string): Promise<UserInterface | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        "u.id as id",
        "u.firstname as firstname",
        "u.lastname as lastname",
        "u.code as code",
        'u.two_factor_auth as "twoFactorAuth"',
        "u.email as email",
        "u.validate as validate",
        "u.username as username",
        'u.photo as "photo"',
        "u.password as password",
        'e.user_type_id as "userTypeId"',
        'e.auth as "auth"',
        'e.name as "entityName"',
        'u.entity_id as "entityId"',
        'e.login_type_id as "loginTypeId"',
        'e.code as "entitycode"',
      ])
      .from(User, "u")
      .innerJoin(Entities, "e", "u.entity_id = e.id and e.status = true")
      .where(`UPPER(u.username) = UPPER(:username)`, { username })
      .andWhere(`u.status = :status`, { status: true })
      .andWhere(`u.is_bloqued = :isBloqued`, { isBloqued: false });

    return await query.getRawOne<UserInterface>();
  }

  async findUserTypeLogin(
    loginTypeId: number
  ): Promise<LoginTypeInterface | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select(["utl.id as id", "utl.alias as alias"])
      .from(UserTypeLogin, "utl")
      .where(`utl.status = :status`, { status: true })
      .andWhere(`utl.id = :loginTypeId`, { loginTypeId });

    return await query.getRawOne<LoginTypeInterface>();
  }

  async toggleBloquedUser(userId: number, status: boolean): Promise<void> {
    try {
      const dataSource = Database.getConnection();
      await dataSource
        .createQueryBuilder()
        .update(User)
        .set({ isBloqued: status })
        .where("id = :userId", { userId })
        .execute();
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, 400);
    }
  }

  async findSession(
    userId: number,
    status: boolean
  ): Promise<SessionInterface[]> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select(["s.id as id", "s.token as token", "s.active as active"])
      .from(Session, "s")
      .where(`s.active = :status`, { status })
      .andWhere(`s.user_id = :userId`, { userId });
    return await query.getRawMany<SessionInterface>();
  }
}
