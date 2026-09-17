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
  title: "Fabrixplasm — Precision CNC Machining & Fabrication",
  description: "Fabrixplasm is a precision CNC machining and fabrication company specializing in custom parts, sub-assemblies, and structural components engineered to critical specifications.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Early connection to the Unsplash CDN — reduces DNS/TLS latency so the
            WebP photos in Works / Capabilities appear as fast as possible. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
