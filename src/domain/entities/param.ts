export interface ParamInterface {
  id?: number;
  code?: string;
  name: string;
  description: string;
  value: string;
  protected?: boolean;
  private?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userUpdated?: number;
}
