import type { Metadata, Viewport } from "next";
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
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
