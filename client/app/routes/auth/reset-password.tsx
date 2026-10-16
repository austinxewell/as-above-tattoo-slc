import { Form, Link, useNavigation, useSearchParams } from "react-router";
import { LoaderCircle } from "lucide-react";
import type { Route } from "./+types/reset-password";
import { graphqlRequest } from "~/lib/graphql";
import { Button } from "~/components/ui/button";
import { AuthShell } from "~/components/auth/auth-shell";
import { PasswordInput } from "~/components/auth/password-input";

const RESET_PASSWORD_MUTATION = /* GraphQL */ `
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

const MIN_PASSWORD_LENGTH = 8;

const labelClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";
const linkClasses =
  "mt-8 block text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent";

export function meta() {
  return [
    { title: "Choose a new password | As Above Tattoo" },
    { name: "robots", content: "noindex" },
    { name: "referrer", content: "no-referrer" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      done: false as const,
      error: `Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (newPassword !== confirmPassword) {
    return { done: false as const, error: "The passwords don't match." };
  }

  try {
    await graphqlRequest(RESET_PASSWORD_MUTATION, { token, newPassword }, request.signal);
  } catch (error) {
    return {
      done: false as const,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }

  return { done: true as const };
}

export default function ResetPassword({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (actionData?.done) {
    return (
      <AuthShell title="Password updated">
        <p role="status" className="text-center leading-7">
          Your password has been changed, and you've been logged out on every device.
        </p>
        <Link to="/login" className={linkClasses}>
          Log in
        </Link>
      </AuthShell>
    );
  }

  if (!token) {
    return (
      <AuthShell title="Invalid link">
        <p className="text-center leading-7">This reset link is missing its token.</p>
        <Link to="/forgot-password" className={linkClasses}>
          Request a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="New password">
      <Form method="post" className="grid gap-6">
        <input type="hidden" name="token" value={token} />

        {actionData?.error && (
          <p role="alert" className="text-sm text-destructive">
            {actionData.error}
          </p>
        )}

        <div>
          <label htmlFor="newPassword" className={labelClasses}>
            New password
          </label>
          <PasswordInput
            id="newPassword"
            name="newPassword"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClasses}>
            Confirm password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          variant="brand"
          size="cta"
          disabled={isSubmitting}
          className="justify-center"
        >
          {isSubmitting ? (
            <>
              Saving
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            </>
          ) : (
            "Save new password"
          )}
        </Button>
      </Form>

      <Link to="/forgot-password" className={linkClasses}>
        Request a new link
      </Link>
    </AuthShell>
  );
}
