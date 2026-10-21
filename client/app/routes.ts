import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("layouts/site-layout.tsx", [
    index("routes/home.tsx"),
    route("artists", "routes/artists.tsx"),
    route("artists/:slug", "routes/artist.tsx"),
    route("portfolio", "routes/portfolio.tsx"),
    route("after-care", "routes/after-care.tsx"),
    route("pricing", "routes/pricing.tsx"),
    ...prefix("shop", [index("routes/shop/index.tsx"), route("cart", "routes/shop/cart.tsx")]),
    route("booking", "routes/booking.tsx"),
    route("careers", "routes/careers.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
  route("login", "routes/auth/login.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("reset-password", "routes/auth/reset-password.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  layout("layouts/portal-layout.tsx", [
    ...prefix("portal", [
      index("routes/portal/index.tsx"),
      layout("layouts/portal-admin-layout.tsx", [
        ...prefix("admin", [
          index("routes/portal/admin/index.tsx"),
          route("bookings", "routes/portal/admin/bookings.tsx"),
          route("bookings/:id", "routes/portal/admin/booking.tsx"),
          route("artists", "routes/portal/admin/artists.tsx"),
          route("artists/:slug", "routes/portal/admin/artist.tsx"),
          route("portfolio", "routes/portal/admin/portfolio.tsx"),
          route("site-content", "routes/portal/admin/site-content/layout.tsx", [
            index("routes/portal/admin/site-content/index.tsx"),
            route("settings", "routes/portal/admin/site-content/settings.tsx"),
            route("about", "routes/portal/admin/site-content/about.tsx"),
            route("pricing", "routes/portal/admin/site-content/coming-soon.tsx", {
              id: "site-content-pricing",
            }),
            route("booking", "routes/portal/admin/site-content/coming-soon.tsx", {
              id: "site-content-booking",
            }),
            route("aftercare", "routes/portal/admin/site-content/coming-soon.tsx", {
              id: "site-content-aftercare",
            }),
          ]),
          route("staff", "routes/portal/admin/staff.tsx"),
          route("staff/:id/remove", "routes/portal/admin/staff-remove.tsx"),
          route("*", "routes/portal/not-found.tsx", { id: "portal-admin-not-found" }),
        ]),
      ]),
      layout("layouts/portal-artist-layout.tsx", [
        ...prefix("artist", [
          index("routes/portal/artist/index.tsx"),
          route("requests", "routes/portal/artist/requests.tsx"),
          route("requests/:id", "routes/portal/artist/request.tsx"),
          route("profile", "routes/portal/artist/profile.tsx"),
          route("portfolio", "routes/portal/artist/portfolio.tsx"),
          route("*", "routes/portal/not-found.tsx", { id: "portal-artist-not-found" }),
        ]),
      ]),
      route("*", "routes/portal/not-found.tsx", { id: "portal-not-found" }),
    ]),
  ]),
] satisfies RouteConfig;
