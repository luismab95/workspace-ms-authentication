import { Database } from "lib-database/src/shared/config/database";
import { Parameter, Entities } from "lib-database/src/entities";
import { ParamInterface } from "src/domain/entities/param";
import { ParamRepository } from "src/domain/repositories/param.repository";
import { config } from "src/shared/infrastructure/environment";

const { entityCode } = config.server;

export class ParamRepositoryImpl implements ParamRepository {
  async getParams(): Promise<ParamInterface[]> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        "p.id as id",
        "p.code as code",
        "p.name as name",
        "p.description as description",
        "p.value as value",
        "p.protected as protected",
        "p.private as private",
      ])
      .from(Parameter, "p")
      .innerJoin(Entities, "e", "p.entity_id = e.id")
      .where(`e.code = :entityCode`, { entityCode });

    return await query.getRawMany<ParamInterface>();
  }
}
