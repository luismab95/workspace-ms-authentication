import { Response, Request, NextFunction } from "express";
import { FIND_RECORD_FAILED, ERR_401 } from "src/shared/constants/messages";
import { verificarToken, generateToken } from "src/shared/helpers/jwt.helper";
import { AuthRepositoryImpl } from "../../persistence/postgres/auth.repository";
import { ErrorResponse } from "src/shared/helpers/response.helper";
import { TokenInterface } from "src/domain/entities/auth";

export interface CustomRequestInterface extends Request {
  session?: TokenInterface;
}

export const RenewTokenAccessMiddleware = async (
  req: CustomRequestInterface,
  _res: Response,
  next: NextFunction
) => {
  const authRepository = new AuthRepositoryImpl();
  const refreshToken = req.headers["x-refresh-token"] as string;
  try {
    const refreshTokenPayload = verificarToken(refreshToken) as TokenInterface;
    const userSessions = await authRepository.findSession(
      refreshTokenPayload.id,
      true
    );
    const sessionLogout = userSessions.find(
      (userSession) => userSession.id === Number(req.params.id)
    );
    if (sessionLogout === undefined)
      return next(faliedToken(FIND_RECORD_FAILED("de la sesión"), 400));

    delete refreshTokenPayload.iat;
    delete refreshTokenPayload.exp;
    refreshTokenPayload.sessionId = Number(req.params.id);
    const newTokenAccess = generateToken(refreshTokenPayload);
    req.headers["x-access-token"] = newTokenAccess;
    next();
  } catch (error) {
    return next(faliedToken(ERR_401, 401));
  }
};

const faliedToken = (message: string, code: number) =>
  new ErrorResponse(`Acceso no autorizado ${message}`, code);
