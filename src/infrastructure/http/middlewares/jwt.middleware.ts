import { Response, Request, NextFunction } from "express";
import { ERR_401 } from "src/shared/constants/messages";
import { verifyToken } from "src/shared/helpers/jwt.helper";
import { ErrorResponse } from "src/shared/helpers/response.helper";
import { CodeHttpEnum } from "src/shared/enums/http-code.enum";

export const VerifyTokenAccessMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return next(faliedMiddleware(ERR_401, CodeHttpEnum.unAuthorized));
    }
    const token = authorizationHeader?.split(" ")[1];

    try {
      verifyToken(token);
      return next();
    } catch (err) {
      return next(faliedMiddleware(ERR_401, CodeHttpEnum.unAuthorized));
    }
  } catch (error) {
    return next(faliedMiddleware(ERR_401, CodeHttpEnum.unAuthorized));
  }
};

const faliedMiddleware = (message: string, code: CodeHttpEnum) =>
  new ErrorResponse(message, code);
