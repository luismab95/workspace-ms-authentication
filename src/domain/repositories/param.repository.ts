import { ParamInterface } from "../entities/param";

export interface ParamRepository {
  getParams(): Promise<ParamInterface[]>;
}
