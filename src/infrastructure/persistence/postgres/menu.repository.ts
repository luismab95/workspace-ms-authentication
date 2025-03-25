import { Database } from "lib-database/src/shared/config/database";
import { Menu, Module } from "lib-database/src/entities";
import { MenuRepository } from "src/domain/repositories/menu.repository";
import { MenuInterface } from "src/domain/entities/menu";

export class MenuRepositoryImpl implements MenuRepository {
  async get(): Promise<MenuInterface[]> {
    const dataSource = Database.getConnection();
    const query = dataSource
      .createQueryBuilder()
      .select([
        "m.name as name",
        'm.url as "remoteEntry"',
        "m.path as path",
        'm.exposed_module as "exposedModule"',
        'm.is_auth_route as "isAuthRoute"',
        'mo.name as "moduleName"',
        'm.type_remote as "typeRemote"',
      ])
      .from(Menu, "m")
      .innerJoin(Module, "mo", "mo.id = m.module_id")
      .where(`m.status = :status`, { status: true });

    return await query.getRawMany<MenuInterface>();
  }
}
