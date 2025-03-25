import jwt from "jsonwebtoken";
import { config } from "../infrastructure/environment";
import { TokenInterface } from "src/domain/entities/auth";

const { jwtSecretKey, expiresIn } = config.server;

export function generateToken(payload: TokenInterface): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn });
}

export function generateTokenResetPassword(payload: TokenInterface): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn: '15m' });
}


export function generateRefreshToken(payload: TokenInterface): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn: "30d" });
}

export function verificarToken(token: string) {
  try {
    return jwt.verify(token, jwtSecretKey!);
  } catch (error: any) {
    throw new Error(error);
  }
}
