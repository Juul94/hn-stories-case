import type { Metadata, Viewport } from "next";
import { themeInitScript } from "@/lib/theme/theme";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Hacker News – 10 tilfældige historier",
  description: "10 tilfældige topnyheder fra Hacker News, sorteret efter score.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The inline script sets data-theme before React hydrates, so the attribute may differ.
    <html lang="da" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
