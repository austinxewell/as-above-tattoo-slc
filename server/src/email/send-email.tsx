import type { ReactElement } from "react";
import { Resend } from "resend";
import { render, toPlainText } from "@react-email/components";
import { getShopDetails } from "../models/site-settings.js";
import { EmailLayout } from "./email-layout.js";

type SendEmailOptions = {
  to: string[];
  subject: string;
  preview: string;
  content: ReactElement;
  replyTo?: string;
};

async function shopFooter() {
  const shop = await getShopDetails();
  return `As Above Tattoo · ${shop.street}, ${shop.city}, ${shop.state} ${shop.zip}`;
}

export async function sendEmail({ to, subject, preview, content, replyTo }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error(
      "RESEND_API_KEY and EMAIL_FROM must be set in server/.env (or Railway's Variables).",
    );
  }

  const html = await render(
    <EmailLayout preview={preview} footer={await shopFooter()}>
      {content}
    </EmailLayout>,
  );
  const text = toPlainText(html);

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, html, text, replyTo });

  if (error) {
    throw new Error(`Email failed to send: ${error.message}`);
  }
}
