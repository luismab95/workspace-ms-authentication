import { MenuI } from "../entities/menu";

export interface MenuRepository {
  get(): Promise<MenuI[]>;
}
