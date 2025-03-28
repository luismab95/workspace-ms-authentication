import { OtpUser, Session, User } from "lib-database/src/entities";
import { Database } from "lib-database/src/shared/config/database";
import {
  OtpUserI,
  OtpUserType,
  SessionI,
  UserI,
  UserType,
} from "src/domain/entities/auth";
import { AuthRepository } from "src/domain/repositories/auth.repositorty";
import { DATABASE_ERR } from "src/shared/constants/messages";
import { CodeHttpEnum } from "src/shared/enums/http-code.enum";
import { ErrorResponse } from "src/shared/helpers/response.helper";

export class AuthRepositoryImpl implements AuthRepository {
  async createUser(user: UserI): Promise<UserI> {
    try {
      const dataSource = Database.getConnection();
      const userRepository = dataSource.getRepository(User);
      const result = userRepository.create(user as User);
      return await userRepository.save(result);
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, CodeHttpEnum.badRequest);
    }
  }

  async saveSession(session: SessionI): Promise<SessionI> {
    try {
      const dataSource = Database.getConnection();
      const sessionRepository = dataSource.getRepository(Session);
      const result = sessionRepository.create(session as Session);
      return await sessionRepository.save(result);
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, CodeHttpEnum.badRequest);
    }
  }

  async createOtp(otp: OtpUserI): Promise<OtpUserI> {
    try {
      const dataSource = Database.getConnection();
      const otpRepository = dataSource.getRepository(OtpUser);
      const result = otpRepository.create(otp as OtpUser);
      return await otpRepository.save(result);
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, CodeHttpEnum.badRequest);
    }
  }

  async findOtp(
    otp: string,
    userId: number,
    type: OtpUserType
  ): Promise<OtpUserI | undefined> {
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

    return await query.getRawOne<OtpUserI>();
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
      throw new ErrorResponse(DATABASE_ERR, CodeHttpEnum.badRequest);
    }
  }

  async updatePassword(userId: number, password: string): Promise<void> {
    try {
      const dataSource = Database.getConnection();
      await dataSource
        .createQueryBuilder()
        .update(User)
        .set({ password })
        .where("id = :userId", { userId })
        .execute();
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, CodeHttpEnum.badRequest);
    }
  }

  async updateSession(sessionId: number): Promise<void> {
    try {
      const dataSource = Database.getConnection();
      await dataSource
        .createQueryBuilder()
        .update(Session)
        .set({ active: false })
        .where("id = :sessionId", { sessionId })
        .execute();
    } catch (err) {
      throw new ErrorResponse(DATABASE_ERR, CodeHttpEnum.badRequest);
    }
  }

  async findUserForLogin(
    email: string,
    type: UserType
  ): Promise<UserI | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        "u.id as id",
        "u.firstname as firstname",
        "u.lastname as lastname",
        "u.email as email",
        "u.password as password",
        "u.status as status",
        "u.type as type",
      ])
      .from(User, "u")
      .where(`UPPER(u.email) = UPPER(:email)`, { email })
      .andWhere(`u.type = :type`, { type })
      .andWhere(`u.status = :status`, { status: true });

    return await query.getRawOne<UserI>();
  }

  async findUser(email: string): Promise<UserI | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        "u.id as id",
        "u.firstname as firstname",
        "u.lastname as lastname",
        "u.email as email",
        "u.password as password",
        "u.status as status",
        "u.type as type",
      ])
      .from(User, "u")
      .where(`UPPER(u.email) = UPPER(:email)`, { email });

    return await query.getRawOne<UserI>();
  }

  async findSession(sessionId: number): Promise<SessionI | undefined> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select(["s.id as id", "s.token as token", "s.active as active"])
      .from(Session, "s")
      .where(`s.active = :active`, { active: true })
      .andWhere(`s.id= :sessionId`, { sessionId });
    return await query.getRawOne<SessionI>();
  }
}
