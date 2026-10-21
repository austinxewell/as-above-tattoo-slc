import type { Types } from "mongoose";
import { sendEmail } from "../email/send-email.js";
import { createPasswordReset, INVITE_DAYS } from "./password-reset.js";

type Invitee = {
  _id: Types.ObjectId;
  name: string;
  email: string;
};

export async function emailInvite(user: Invitee, invitedBy: string) {
  const token = await createPasswordReset(user._id, INVITE_DAYS * 24 * 60);
  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}&invite=1`;

  await sendEmail({
    to: [user.email],
    subject: "You're invited to the As Above Tattoo staff portal",
    text: [
      `Hi ${user.name},`,
      "",
      `${invitedBy} added you to the As Above Tattoo staff portal.`,
      `Use this link to set your password. It works once and expires in ${INVITE_DAYS} days:`,
      link,
      "",
      "If you weren't expecting this, you can ignore this email.",
    ].join("\n"),
  });
}
