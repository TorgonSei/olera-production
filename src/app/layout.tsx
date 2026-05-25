import type { Metadata, Viewport } from "next";
import {
  Hanken_Grotesk,
  Bricolage_Grotesque,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1e8",
};

export const metadata: Metadata = {
  title: {
    default: "Olera — Customer Operations Talent",
    template: "%s | Olera",
  },
  description:
    "Olera matches exceptional customer operations talent with the teams that need them most. Customer Support, Customer Success, and Virtual Assistants — screened, assessed, and ready.",
  keywords: [
    "customer operations talent",
    "customer support hiring",
    "customer success managers",
    "virtual assistants Kenya",
    "remote talent Africa",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Olera",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${bricolage.variable} ${instrument.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
