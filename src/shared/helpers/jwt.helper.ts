import jwt from "jsonwebtoken";
import { config } from "../infrastructure/environment";
import { TokenI } from "src/domain/entities/auth";

const { jwtSecretKey, expiresIn } = config.server;

export function generateToken(payload: TokenI): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn });
}

export function generateRefreshToken(payload: TokenI): string {
  return jwt.sign(payload, jwtSecretKey!, { expiresIn: "30d" });
}

export function verificarToken(token: string) {
  try {
    return jwt.verify(token, jwtSecretKey!);
  } catch (error: any) {
    throw new Error(error);
  }
}
