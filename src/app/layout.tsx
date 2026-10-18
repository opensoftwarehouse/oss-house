import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ViewTransition } from "react";
import "./globals.css";
import { setLocale, t } from "@/i18n/generated";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
// Mono sets every label and value, above the fold included.
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// The language comes from the request (the `locale` cookie, else
// Accept-Language), so every page renders per request.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await setLocale();
  return {
    title: { default: "OSS House", template: "%s · OSS House" },
    description: t.app.meta.description,
    openGraph: { siteName: "OSS House", locale: t.app.meta.ogLocale },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await setLocale();

  // next-themes puts the theme's class on <html> before the first paint, so
  // React's own class string is told to expect it.
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`h-full font-sans antialiased ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {/* A language switch cross-fades the page; navigations don't. */}
          <ViewTransition
            update={{ locale: "auto", default: "none" }}
            default="none"
          >
            {children}
          </ViewTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
