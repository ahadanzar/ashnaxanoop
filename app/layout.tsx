import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ml",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description =
  "Together with their families, Ashna & Anoop request the pleasure of your company. Sunday, 6 December 2026 · Bolgatty Palace, Ernakulam.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ashna & Anoop · 6 December 2026",
  description,
  openGraph: {
    title: "Ashna & Anoop · Wedding Invitation",
    description,
    type: "website",
    images: [{ url: "/assets/couple.jpg", width: 1200, height: 1500, alt: "Ashna and Anoop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashna & Anoop · Wedding Invitation",
    description,
    images: ["/assets/couple.jpg"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ead6ca",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable} ${malayalam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
