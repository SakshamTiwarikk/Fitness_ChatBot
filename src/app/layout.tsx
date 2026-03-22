import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FORM — AI Fitness Coach",
  description: "Your personal AI-powered fitness coach for beginners. Get gym plans, diet advice, and motivation.",
  openGraph: {
    title: "FORM — AI Fitness Coach",
    description: "Gym plans, diet, and motivation. Built for beginners.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${dm.variable}`}>
      <body className="bg-bg text-white font-dm antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
