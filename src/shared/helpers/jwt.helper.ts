import jwt from "jsonwebtoken";
import { config } from "../infrastructure/environment";
import { TokenI } from "src/domain/entities/auth";
import { ErrorResponse } from "./response.helper";
import { CodeHttpEnum } from "../enums/http-code.enum";

const { jwtSecretKey, expiresIn } = config.server;

export function generateToken(payload: TokenI): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn });
}

export function generateRefreshToken(payload: TokenI): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn: "30d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, jwtSecretKey!) as TokenI;
  } catch (error: any) {
    throw new ErrorResponse(error, CodeHttpEnum.unAuthorized);
  }
}
