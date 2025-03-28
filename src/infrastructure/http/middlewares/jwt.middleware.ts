import { Response, Request, NextFunction } from "express";
import { FIND_RECORD_FAILED, ERR_401 } from "src/shared/constants/messages";
import { verifyToken, generateToken } from "src/shared/helpers/jwt.helper";
import { AuthRepositoryImpl } from "../../persistence/postgres/auth.repository";
import { ErrorResponse } from "src/shared/helpers/response.helper";
import { TokenI } from "src/domain/entities/auth";
import { CodeHttpEnum } from "src/shared/enums/http-code.enum";

export interface CustomRequestInterface extends Request {
  session?: TokenI;
}

export const RenewTokenAccessMiddleware = async (
  req: CustomRequestInterface,
  _res: Response,
  next: NextFunction
) => {
  const authRepository = new AuthRepositoryImpl();
  try {
    const findSession = await authRepository.findSession(Number(req.params.id));
    if (findSession)
      return next(
        faliedToken(FIND_RECORD_FAILED("de la sesión"), CodeHttpEnum.badRequest)
      );
    const refreshTokenPayload = verifyToken(findSession.token) as TokenI;

    delete refreshTokenPayload.iat;
    delete refreshTokenPayload.exp;
    refreshTokenPayload.sessionId = Number(req.params.id);
    const newTokenAccess = generateToken(refreshTokenPayload);
    req.headers["x-access-token"] = newTokenAccess;
    return next();
  } catch (error) {
    return next(faliedToken(ERR_401, CodeHttpEnum.unAuthorized));
  }
};

export const VerifyTokenAccessMiddleware = async (
  req: CustomRequestInterface,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader?.startsWith("Bearer ")) {
      return next(faliedToken(ERR_401, CodeHttpEnum.unAuthorized));
    }
    const token = authorizationHeader?.split(" ")[1];
    try {
      verifyToken(token!) as TokenI;
      return next();
    } catch (err) {
      return next(faliedToken(ERR_401, CodeHttpEnum.unAuthorized));
    }
  } catch (error) {
    return next(faliedToken(ERR_401, CodeHttpEnum.unAuthorized));
  }
};

const faliedToken = (message: string, code: number) =>
  new ErrorResponse(`Acceso no autorizado ${message}`, code);
