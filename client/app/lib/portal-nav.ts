import {
  CalendarCheck,
  FileText,
  Images,
  LayoutDashboard,
  Palette,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type PortalNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

export const adminNav: PortalNavItem[] = [
  { label: "Dashboard", to: "/portal/admin", icon: LayoutDashboard, end: true },
  { label: "Bookings", to: "/portal/admin/bookings", icon: CalendarCheck },
  { label: "Artists", to: "/portal/admin/artists", icon: Palette },
  { label: "Portfolio", to: "/portal/admin/portfolio", icon: Images },
  { label: "Site content", to: "/portal/admin/site-content", icon: FileText },
  { label: "Staff", to: "/portal/admin/staff", icon: Users },
];

export const artistNav: PortalNavItem[] = [
  { label: "Dashboard", to: "/portal/artist", icon: LayoutDashboard, end: true },
  { label: "My requests", to: "/portal/artist/requests", icon: CalendarCheck },
  { label: "My profile", to: "/portal/artist/profile", icon: UserRound },
  { label: "My portfolio", to: "/portal/artist/portfolio", icon: Images },
];
