import { AuthService } from "src/application/services/auth.service";
import { AuthRepositoryImpl } from "src/infrastructure/persistence/postgres/auth.repository";
import { MenuRepositoryImpl } from "src/infrastructure/persistence/postgres/menu.repository";

const authRepository = new AuthRepositoryImpl();
const menuRepository = new MenuRepositoryImpl();

export const ServiceContainer = {
  auth: new AuthService(authRepository, menuRepository),
};
