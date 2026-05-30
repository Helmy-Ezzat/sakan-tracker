import { ar } from "@/lib/i18n/ar";

export const APP_NAME = ar.appName;

export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  expenses: "/expenses",
  settlement: "/settlement",
  archive: "/archive",
  settings: "/settings",
} as const;

/** Max content width for mobile-first PWA shell */
export const MOBILE_MAX_WIDTH = "28rem";
