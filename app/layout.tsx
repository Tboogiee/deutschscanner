import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DeutschScanner — Your next escape is already on your ticket",
    template: "%s | DeutschScanner",
  },
  description:
    "Discover curated lakes, old towns, palaces and coastlines reachable from Berlin with regional transport and the Deutschlandticket.",
  keywords: [
    "Deutschlandticket trips",
    "day trips from Berlin",
    "regional train travel Germany",
    "Berlin weekend trips",
  ],
  openGraph: {
    title: "DeutschScanner",
    description: "Curated escapes from Berlin, already covered by your ticket.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1728,
        height: 910,
        alt: "DeutschScanner — Your next escape is already on your ticket",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeutschScanner",
    description: "Curated escapes from Berlin, already covered by your ticket.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
