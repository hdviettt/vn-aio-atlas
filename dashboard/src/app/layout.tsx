import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const SITE_URL = "https://vn-aio-atlas-dashboard-production.up.railway.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vietnam AI Overview Atlas",
    template: "%s · Vietnam AI Overview Atlas",
  },
  description:
    "An empirical study of Google AI Overview behavior in Vietnamese commercial search — backed by 244K query observations and 1.4M citation events from December 2025 through April 2026.",
  applicationName: "Vietnam AI Overview Atlas",
  authors: [{ name: "Hoang Duc Viet", url: "https://hoangducviet.work" }],
  keywords: [
    "AI Overview",
    "AIO",
    "Vietnamese SEO",
    "GEO",
    "Generative Engine Optimization",
    "Google AI Overview",
    "SEONGON",
    "Vietnam SEO research",
  ],
  openGraph: {
    title: "Vietnam AI Overview Atlas — preliminary findings",
    description:
      "How Google's AI Overview reshapes Vietnamese commercial search. 244K queries, 1.4M citation events, 264 brand projects, 12 verticals.",
    url: SITE_URL,
    siteName: "Vietnam AI Overview Atlas",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vietnam AI Overview Atlas",
    description:
      "An empirical study of Google AI Overview behavior in Vietnamese commercial search.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/?lang=en`,
      vi: `${SITE_URL}/?lang=vi`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
