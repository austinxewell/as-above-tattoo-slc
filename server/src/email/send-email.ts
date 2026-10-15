import { Resend } from "resend";

type SendEmailOptions = {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, text, replyTo }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error(
      "RESEND_API_KEY and EMAIL_FROM must be set in server/.env (or Railway's Variables).",
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, text, replyTo });

  if (error) {
    throw new Error(`Email failed to send: ${error.message}`);
  }
}
