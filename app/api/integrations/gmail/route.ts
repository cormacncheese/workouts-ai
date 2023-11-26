import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Check if we have previously stored a token.
      // let token;
      // try {
      //   token = fs.readFileSync(TOKEN_PATH, 'utf8');
      // } catch (err) {
      //   // If we don't have a token, redirect the user to the auth URL
      //   const authUrl = oAuth2Client.generateAuthUrl({
      //     access_type: 'offline',
      //     scope: ['https://www.googleapis.com/auth/gmail.readonly']
      //   });
      //   res.redirect(authUrl);
      //   return;
      // }

      // // If we have a token, use it to authenticate the client
      // oAuth2Client.setCredentials(JSON.parse(token));

      // const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      // const { data } = await gmail.users.messages.list({ userId: 'me' });

      return new Response(JSON.stringify({ status: false }), {
        status: 200
      });
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
