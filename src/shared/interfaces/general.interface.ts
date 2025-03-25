import { Request, Response } from "express";

export interface ServiceResponseInterface {
  req: Request;
  res: Response;
  data?: any;
  message?: string;
  statusCode?: number;
}
