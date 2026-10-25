import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "Join Ashna & Anoop for an evening of henna, music, and celebration. Saturday, 5 December 2026 at Luminara Hotel.";

export const metadata: Metadata = {
  title: "Ashna & Anoop · Mehndi",
  description,
  openGraph: {
    title: "Ashna & Anoop · Mehndi",
    description,
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#123f34",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
