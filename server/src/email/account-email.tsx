import type { CSSProperties } from "react";
import { Button, Heading, Link, Text } from "@react-email/components";
import { INVITE_DAYS, RESET_MINUTES } from "../auth/password-reset.js";
import { buttonStyle, emailColors, eyebrowStyle } from "./email-layout.js";

const bodyStyle: CSSProperties = {
  margin: "0 0 4px",
  fontSize: "15px",
  lineHeight: "24px",
  color: emailColors.ink,
};
const smallStyle: CSSProperties = {
  margin: "20px 0 0",
  fontSize: "13px",
  lineHeight: "20px",
  color: emailColors.muted,
};

type AccountEmailProps = {
  eyebrow: string;
  name: string;
  message: string;
  buttonLabel: string;
  link: string;
  footnote: string;
};

function AccountEmail({ eyebrow, name, message, buttonLabel, link, footnote }: AccountEmailProps) {
  return (
    <>
      <Text style={eyebrowStyle}>{eyebrow}</Text>
      <Heading
        as="h1"
        style={{
          margin: "8px 0 16px",
          fontSize: "24px",
          lineHeight: "30px",
          color: emailColors.ink,
        }}
      >
        Hi {name},
      </Heading>
      <Text style={bodyStyle}>{message}</Text>

      <Button href={link} style={buttonStyle}>
        {buttonLabel}
      </Button>

      <Text style={smallStyle}>
        Button not working? Paste this link into your browser:
        <br />
        <Link href={link} style={{ color: emailColors.gold, wordBreak: "break-all" }}>
          {link}
        </Link>
      </Text>
      <Text style={smallStyle}>{footnote}</Text>
    </>
  );
}

export function inviteEmail({
  name,
  invitedBy,
  link,
}: {
  name: string;
  invitedBy: string;
  link: string;
}) {
  return {
    subject: "You're invited to the As Above Tattoo staff portal",
    preview: `${invitedBy} added you to the staff portal. Set your password to get started.`,
    content: (
      <AccountEmail
        eyebrow="Staff portal invite"
        name={name}
        message={`${invitedBy} added you to the As Above Tattoo staff portal. Set your password to get started. The link works once and expires in ${INVITE_DAYS} days.`}
        buttonLabel="Set your password"
        link={link}
        footnote="If you weren't expecting this, you can ignore this email."
      />
    ),
  };
}

export function passwordResetEmail({ name, link }: { name: string; link: string }) {
  return {
    subject: "Reset your As Above Tattoo password",
    preview: `Use this link to set a new password. It expires in ${RESET_MINUTES} minutes.`,
    content: (
      <AccountEmail
        eyebrow="Password reset"
        name={name}
        message={`Use the button below to set a new password. It works once and expires in ${RESET_MINUTES} minutes.`}
        buttonLabel="Set a new password"
        link={link}
        footnote="If you didn't ask for this, you can ignore this email. Your password won't change."
      />
    ),
  };
}
