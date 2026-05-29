import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { ar } from "@/lib/i18n/ar";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: ar.appName,
    template: `%s · ${ar.appName}`,
  },
  description: ar.appDescription,
  applicationName: ar.appName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: ar.appName,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} dark h-full`}>
      <body className="min-h-dvh font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
