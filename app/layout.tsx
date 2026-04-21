import type { Metadata } from "next";
import { Bangers, Inter, Oswald } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

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
  title: {
    default: "PlixBlog",
    template: "%s | PlixBlog",
  },
  description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
  openGraph: {
    title: "PlixBlog",
    description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
    url: "https://plix-blog.vercel.app",
    siteName: "PlixBlog",
    images: [
      {
        url: "https://plix-blog.vercel.app/talk.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlixBlog",
    description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
    images: ["https://plix-blog.vercel.app/talk.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${bangers.variable} ${oswald.variable} ${inter.variable} antialiased`}>
        <Providers>
          <SiteHeader />
          {children}
          {modal}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
