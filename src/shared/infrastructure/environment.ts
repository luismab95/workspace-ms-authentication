import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
    nodeEnv: process.env.NODE_ENV,
    dbHost: process.env.DB_HOST,
    dbPort: Number(process.env.DB_PORT),
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    cryptoData: process.env.CRYPTO_DATA,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
    msEmail: process.env.MS_EMAIL,
    mailAuthUsername: process.env.MAIL_AUTH_USERNAME,
    mailAuthPassword: process.env.MAIL_AUTH_PASSWORD,
    msLogs: process.env.MS_LOGS,
    logsAuthUsername: process.env.LOGS_AUTH_USERNAME,
    logsAuthPassword: process.env.LOGS_AUTH_PASSWORD,
    entityCode: process.env.ENTITY_CODE,
  },
};
