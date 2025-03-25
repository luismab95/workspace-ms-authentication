import { config } from "../infrastructure/environment";
import { sendRequestPost } from "./axios.helper";
import { getMailParameter } from "../utils/parameter.utils";
import { ParamInterface } from "src/domain/entities/param";

export const sendMail = async (
  subject: string,
  templateName: string,
  mail: string,
  context: any,
  findParameters: ParamInterface[]
) => {
  const { msEmail, mailAuthUsername, mailAuthPassword } = config.server;
  const basicAuth = Buffer.from(
    `${mailAuthUsername}:${mailAuthPassword}`,
    "utf-8"
  ).toString("base64");

  const mailParameter = getMailParameter(findParameters);

  sendRequestPost(
    `${msEmail}/send`,
    {
      to: mail,
      subject,
      templateName,
      context,
      mailerHost: mailParameter.host,
      mailerPort: Number(mailParameter.port),
      mailerUser: mailParameter.username,
      mailerPassword: mailParameter.password,
      mailerSecure: mailParameter.secure,
      mailerFrom: mailParameter.from,
    },
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    }
  );
};
