import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { CodeHttpEnum } from "src/shared/enums/http-code.enum";
import { ErrorResponse } from "src/shared/helpers/response.helper";

export const ValidationMiddleware = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      const error = new ErrorResponse(
        errorMessages.join(", "),
        CodeHttpEnum.validator
      );
      return next(error);
    }

    return next();
  };
};
