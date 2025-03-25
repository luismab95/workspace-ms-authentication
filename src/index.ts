import { config } from "./shared/infrastructure/environment";
import { Database } from "lib-database/src/shared/config/database";
import { OK_200 } from "./shared/constants/messages";
import { errorHandler } from "./shared/helpers/response.helper";
import authRoutes from "./infrastructure/http/routes/auth.route";
import colors from "colors";
import cors from "cors";
import express, { Request, Response } from "express";
import swaggerSpec from "./swagger";
import swaggerUi from "swagger-ui-express";

const startServer = async () => {
  try {
    const { port, host, nodeEnv } = config.server;
    const routePrefix = "ms-authentication";
    const corsOptions = {
      origin: "",
    };

    const app = express();
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(cors(corsOptions));

    app.get(`/${routePrefix}`, async (_req: Request, res: Response) => {
      res.status(200).json({
        data: "Welcome, but nothing to show here",
        message: OK_200,
      });
    });

    app.use(`/${routePrefix}/security`, authRoutes);

    if (nodeEnv === "dev")
      app.use(
        `/${routePrefix}/api-docs`,
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
      );

    app.use(errorHandler);

    await Database.connect();

    app.listen(port, host, () => {
      console.info(
        colors.bold.green(`MS-AUTHENTICATION iniciado en ${host}:${port}`)
      );
    });
  } catch (error) {
    colors.red.bold(`Error during start server: ${error}`);
  }
};

startServer();

// Cerrar la conexión a la base de datos al salir de la aplicación
process.on("SIGINT", async () => {
  await Database.disconnect();
  process.exit(0);
});
