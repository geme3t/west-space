import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://east-space.vercel.app"),
  title: "East Riverside Furnished Suite | Windsor, Ontario",
  description: "Comfortable furnished long-term rental in East Riverside, Windsor, Ontario.",
  openGraph: {
    type: "website",
    url: "https://east-space.vercel.app",
    siteName: "East Space",
    title: "East Riverside Furnished Suite | Windsor, Ontario",
    description: "Comfortable furnished long-term rental in East Riverside, Windsor, Ontario.",
    images: [
      {
        url: "/east-space-og.svg",
        width: 1200,
        height: 630,
        alt: "East Space furnished living in East Riverside, Windsor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "East Riverside Furnished Suite | Windsor, Ontario",
    description: "Comfortable furnished long-term rental in East Riverside, Windsor, Ontario.",
    images: ["/east-space-og.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
