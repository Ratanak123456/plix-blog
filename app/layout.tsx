import type { Metadata } from "next";
import { Bangers, Inter, Oswald, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bangers = Bangers({
  weight: "400",
  variable: "--font-plix-bangers",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-plix-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-plix-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlixBlog – Every Piece of Tech Has an Origin Story",
  description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body className={`${bangers.variable} ${oswald.variable} ${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
