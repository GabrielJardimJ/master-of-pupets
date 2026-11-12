import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import "@/styles/liquid-glass.css";
import "@/styles/motion.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  title: "Untold — Design e desenvolvimento web",
  description:
    "Sites, interfaces e experiências digitais com identidade. A Untold conecta design e engenharia para dar forma à presença digital da sua marca.",
  applicationName: "Untold",
  openGraph: {
    title: "Untold — Sites com presença. Por essência.",
    description: "Design e engenharia. Uma mesma direção.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Untold — Creative digital studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Untold — Design e desenvolvimento web",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  robots: siteUrl
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export const viewport: Viewport = {
  themeColor: "#10111A",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-type="service">
      <body>{children}</body>
    </html>
  );
}
