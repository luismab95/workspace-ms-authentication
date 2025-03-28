import bcrypt from "bcrypt";
import { config } from "../infrastructure/environment";

const crypto_data = config.server.cryptoData;

export class CryptoHelper {
  async encryptPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async comparePassword(password: string, hashEncrypted: string) {
    const match = await bcrypt.compare(password, hashEncrypted);
    return match;
  }
}
