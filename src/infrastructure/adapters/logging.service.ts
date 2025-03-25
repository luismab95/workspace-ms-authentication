import { config } from "../../shared/infrastructure/environment";
import { Request } from "express";
import { sendRequestPost } from "src/shared/helpers/axios.helper";
import moment from "moment";

export class LoggingServiceImpl {
  async error(err: string, req?: Request): Promise<void> {
    const { msLogs, logsAuthUsername, logsAuthPassword, nodeEnv } =
      config.server;
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

    if (nodeEnv === "dev") {
      console.error(timestamp, "Error: ", err);
      return;
    }

    if (req?.body?.password) req.body.password = "";
    const log = {
      timestamp,
      microservice: "MS-AUTHENTICATION",
      type: "ERROR",
      message: err,
      request: {
        url: req?.originalUrl,
        method: req?.method,
        headers: req?.headers,
        body: req?.body,
        params: req?.params,
        query: req?.query,
      },
    };

    const basicAuth = Buffer.from(
      `${logsAuthUsername}:${logsAuthPassword}`,
      "utf-8"
    ).toString("base64");

    sendRequestPost(`${msLogs}/logs`, log, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });
  }
}
