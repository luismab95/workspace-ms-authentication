import ActiveDirectory from "activedirectory2";
import { AdParamInterface } from "../../shared/interfaces/param.interface";
import { CryptoHelper } from "../../shared/helpers/crypto.helper";
import { ActiveDirectoryRepository } from "src/domain/repositories/active-directory.repository";

export class ActiveDirectoryRepositoryImpl
  implements ActiveDirectoryRepository
{
  async authenticate(
    username: string,
    password: string,
    connection: AdParamInterface
  ): Promise<boolean> {
    const cryptoHelper = new CryptoHelper();
    const config = {
      url: connection.host,
      baseDN: connection.domain,
      port: Number(connection.port),
      username: connection.username,
      password: cryptoHelper.decryptedData(connection.password),
      secure: connection.secure,
    };
    const ad = new ActiveDirectory(config);

    return new Promise((resolve, reject) => {
      ad.authenticate(username, password, (err, auth) => {
        if (err) {
          reject(
            new Error(
              "Error al conectar con su directorio activo, por favor contacte al adminstrador."
            )
          );
        } else {
          resolve(auth);
        }
      });
    });
  }
}
