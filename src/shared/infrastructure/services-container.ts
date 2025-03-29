import { AuthService } from "src/application/services/auth.service";
import { AuthRepositoryImpl } from "src/infrastructure/persistence/postgres/auth.repository";

const authRepository = new AuthRepositoryImpl();

export const ServiceContainer = {
  auth: new AuthService(authRepository),
};
