import type { Types } from "mongoose";
import { sendEmail } from "../email/send-email.js";
import { createPasswordReset, INVITE_DAYS } from "./password-reset.js";
import { inviteEmail } from "../email/account-email.js";

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
    ...inviteEmail({ name: user.name, invitedBy, link }),
  });
}
