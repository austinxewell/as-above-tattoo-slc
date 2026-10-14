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
] satisfies RouteConfig;
