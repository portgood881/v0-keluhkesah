import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Keluh Kesah - Tempat Curhat & Berbagi Pengalaman",
  description: "Keluh Kesah adalah tempat bagi siapa saja untuk mencurahkan isi hati dan berbagi pengalaman. Platform ini dibuat dengan tujuan untuk mengurangi angka stress di Indonesia.",
  keywords: "keluh kesah, curhat, stress, menfess, fess, indonesia, keluhan, pengalaman, curhatan",
  authors: [{ name: "Keluh Kesah Team" }],
  creator: "Keluh Kesah",
  publisher: "Keluh Kesah",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://keluhkesah.cc",
    siteName: "Keluh Kesah",
    title: "Keluh Kesah - Tempat Curhat & Berbagi Pengalaman",
    description: "Platform terpercaya untuk mencurahkan isi hati dan berbagi pengalaman. Kurangi stress dengan curhat di Keluh Kesah.",
    images: [
      {
        url: "https://keluhkesah.cc/keluhkesah.png",
        width: 400,
        height: 400,
        alt: "Keluh Kesah Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keluh Kesah - Tempat Curhat & Berbagi Pengalaman",
    description: "Platform terpercaya untuk mencurahkan isi hati dan berbagi pengalaman.",
    images: ["https://keluhkesah.cc/keluhkesah.png"],
    creator: "@keluhkesah",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  verification: {
    google: "google_verification_code", // Replace with actual Google Search Console code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_ANALYTICS_URL && (
          <Script
            async
            src={`${process.env.NEXT_PUBLIC_ANALYTICS_URL}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID}
          />
        )}
      </body>
    </html>
  );
}
