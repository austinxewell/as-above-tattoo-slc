import { Form, Link, useNavigation } from "react-router";
import { LoaderCircle } from "lucide-react";
import type { Route } from "./+types/forgot-password";
import { graphqlRequest } from "~/lib/graphql";
import { Button } from "~/components/ui/button";
import { AuthShell } from "~/components/auth/auth-shell";

const REQUEST_RESET_MUTATION = /* GraphQL */ `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

const labelClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";
const fieldClasses =
  "mt-3 w-full border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent";

export function meta() {
  return [{ title: "Reset password | As Above Tattoo" }, { name: "robots", content: "noindex" }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  try {
    await graphqlRequest(
      REQUEST_RESET_MUTATION,
      { email: String(formData.get("email") ?? "") },
      request.signal,
    );
  } catch (error) {
    return {
      sent: false as const,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }

  return { sent: true as const };
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <AuthShell title="Reset password">
      {actionData?.sent ? (
        <p role="status" className="text-center leading-7">
          If that email belongs to a staff account, a reset link is on its way. It expires in 30
          minutes.
        </p>
      ) : (
        <Form method="post" className="grid gap-6">
          {actionData?.error && (
            <p role="alert" className="text-sm text-destructive">
              {actionData.error}
            </p>
          )}

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClasses}
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
                Sending link
                <LoaderCircle
                  className="size-4 animate-spin"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </Form>
      )}

      <Link
        to="/login"
        className="mt-8 block text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
      >
        Back to login
      </Link>
    </AuthShell>
  );
}
