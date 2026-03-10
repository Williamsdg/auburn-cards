import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auburn Cards | Buy & Sell Pokemon & Sports Trading Cards",
  description:
    "Your trusted source for Pokemon and sports trading cards. Browse our collection, buy directly, or sell us your cards. Fair prices and fast shipping.",
  keywords: [
    "trading cards",
    "pokemon cards",
    "sports cards",
    "buy pokemon cards",
    "sell pokemon cards",
    "buy sports cards",
    "sell sports cards",
    "trading card shop",
    "pokemon TCG",
    "sports card shop",
  ],
  openGraph: {
    title: "Auburn Cards | Buy & Sell Pokemon & Sports Trading Cards",
    description:
      "Your trusted source for Pokemon and sports trading cards. Browse, buy, or sell us your cards.",
    siteName: "Auburn Cards",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auburn Cards | Buy & Sell Pokemon & Sports Trading Cards",
    description:
      "Your trusted source for Pokemon and sports trading cards. Browse, buy, or sell us your cards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
