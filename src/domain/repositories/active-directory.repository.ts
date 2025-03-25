import { AdParamInterface } from "../../shared/interfaces/param.interface";

export interface ActiveDirectoryRepository {
  authenticate(
    username: string,
    password: string,
    connection: AdParamInterface
  ): Promise<boolean>;
}
