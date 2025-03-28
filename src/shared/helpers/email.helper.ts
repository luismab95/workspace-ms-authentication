import { config } from "../infrastructure/environment";
import { sendRequestPost } from "./axios.helper";

export const sendMail = async (
  subject: string,
  templateName: string,
  mail: string,
  context: any
) => {
  const { msEmail, mailAuthUsername, mailAuthPassword } = config.server;
  const basicAuth = Buffer.from(
    `${mailAuthUsername}:${mailAuthPassword}`,
    "utf-8"
  ).toString("base64");

  sendRequestPost(
    `${msEmail}/send`,
    {
      to: mail,
      subject,
      templateName,
      context,
    },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    }
  );
};
