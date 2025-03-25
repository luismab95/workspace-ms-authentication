import { MenuInterface } from "../entities/menu";

export interface MenuRepository {
  get(): Promise<MenuInterface[]>;
}
