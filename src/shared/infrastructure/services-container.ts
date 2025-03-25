import { AuthService } from "src/application/services/auth.service";
import { ActiveDirectoryRepositoryImpl } from "src/infrastructure/adapters/active-directory.service";
import { AuthRepositoryImpl } from "src/infrastructure/persistence/postgres/auth.repository";
import { MenuRepositoryImpl } from "src/infrastructure/persistence/postgres/menu.repository";
import { ParamRepositoryImpl } from "src/infrastructure/persistence/postgres/param.repository";

const authRepository = new AuthRepositoryImpl();
const paramRepository = new ParamRepositoryImpl();
const activeDirectoryRepository = new ActiveDirectoryRepositoryImpl();
const menuRepository = new MenuRepositoryImpl();

export const ServiceContainer = {
  auth: new AuthService(
    authRepository,
    paramRepository,
    activeDirectoryRepository,
    menuRepository
  ),
};
