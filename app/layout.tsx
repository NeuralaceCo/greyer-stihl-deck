import type { Metadata, Viewport } from "next";
import { Asta_Sans, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import "./mock.css";
import "./slides.css";
import "./slides-more.css";
import "./brand.css";
import "./theme.css";

/* Greyer's own faces: Asta Sans for everything, Geist Mono for facts and states, Instrument Sans for UI. */
const sans = Asta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const ui = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-ui", display: "swap" });

/* A private proposal: kept out of search engines. */
export const metadata: Metadata = {
  title: "Greyer × STIHL | Proposal",
  description: "A proposed jobsite demo and crew-lead pilot, for STIHL Commercial Solutions and Pro Dealer leadership.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F8F8F8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${ui.variable}`}>
      <body>{children}</body>
    </html>
  );
}
