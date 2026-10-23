// Turns the portal into an installable home-screen app. Added only on portal
// and login pages, so public visitors never get an "Install app" prompt.
export const portalAppLinks = [
  { rel: "manifest", href: "/portal.webmanifest" },
  { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
];
