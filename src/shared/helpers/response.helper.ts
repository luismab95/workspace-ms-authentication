import colors from "colors";
import { NextFunction, Request, Response } from "express";
import { OK_200 } from "../constants/messages";

export class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const responseHelper = (req: Request, res: Response, data: unknown) => {
  res.json({ message: OK_200, data });
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(colors.red.bold(error.stack));

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    data: null,
    message: message,
  });
};
