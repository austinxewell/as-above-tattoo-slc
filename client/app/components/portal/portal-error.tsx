import { isRouteErrorResponse } from "react-router";
import { NotFound } from "~/components/shared/not-found";
import { ErrorState } from "~/components/shared/error-state";

const portalClasses = "min-h-[50svh] px-0 py-6 md:px-0";

export function PortalError({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <NotFound
        homeTo="/portal"
        homeLabel="Back to dashboard"
        secondaryLink={null}
        className={portalClasses}
      />
    );
  }

  return <ErrorState homeTo="/portal" homeLabel="Back to dashboard" className={portalClasses} />;
}
