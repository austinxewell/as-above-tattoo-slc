import { Form, Link, redirect, useNavigation } from "react-router";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import type { Route } from "./+types/login";
import { graphqlRequest } from "~/lib/graphql";
import { Button } from "~/components/ui/button";
import { AuthShell } from "~/components/auth/auth-shell";
import { PasswordInput } from "~/components/auth/password-input";

const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;

const ME_QUERY = /* GraphQL */ `
  query Me {
    me {
      id
    }
  }
`;

const labelClasses = "text-[0.65rem] uppercase tracking-[0.2em] text-accent";
const fieldClasses =
  "mt-3 w-full border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent";

export function meta() {
  return [{ title: "Staff login | As Above Tattoo" }, { name: "robots", content: "noindex" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { me } = await graphqlRequest<{ me: { id: string } | null }>(
    ME_QUERY,
    undefined,
    request.signal,
  );

  if (me) {
    throw redirect("/portal");
  }

  return null;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  try {
    await graphqlRequest(
      LOGIN_MUTATION,
      {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      },
      request.signal,
    );
  } catch (error) {
    return {
      error:
        error instanceof TypeError
          ? "We couldn't reach the server. Please try again in a moment."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
    };
  }

  return redirect("/portal");
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <AuthShell title="Staff login">
      <Form method="post" className="grid gap-6">
        {actionData?.error && (
          <div
            role="alert"
            className="flex gap-3 border border-destructive/40 bg-destructive/10 p-4"
          >
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-destructive"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-sm leading-6">{actionData.error}</p>
          </div>
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

        <div>
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <PasswordInput id="password" name="password" required autoComplete="current-password" />
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
              Logging in
              <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </Form>
      <Link
        to="/forgot-password"
        className="mt-8 block text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
      >
        Forgot your password?
      </Link>
    </AuthShell>
  );
}
