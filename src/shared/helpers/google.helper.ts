import { OAuth2Client } from "google-auth-library";

export class GoogleHelper {
  public verify = async (
    idToken: string,
    username: string,
    googleClientId: string
  ) => {
    const client = new OAuth2Client();

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      if (payload === undefined || payload.email !== username) return null;
      return payload;
    } catch (error) {
      return null;
    }
  };
}
