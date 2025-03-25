import { AES, enc } from "crypto-js";
import bcrypt from "bcrypt";
import { config } from "../infrastructure/environment";

const crypto_data = config.server.cryptoData;

export class CryptoHelper {
  public decryptedData(data: any): string {
    data = AES.decrypt(data, crypto_data!);
    data = data.toString(enc.Utf8);
    return data;
  }

  async comparePassword(password: string, hashEncrypted: string) {
    const match = await bcrypt.compare(password, hashEncrypted);
    return match;
  }
}
