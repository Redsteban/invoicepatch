import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "InvoicePatch - Professional Invoicing for Canadian Contractors",
  description: "Stop losing money on unpaid invoices. InvoicePatch helps Canadian contractors get paid faster with automated follow-ups, payment tracking, and CRA-compliant invoicing. Get 50% off with early bird pricing.",
  keywords: "invoicing, contractors, Canada, CRA compliant, HST, GST, payment tracking, automated reminders",
  authors: [{ name: "InvoicePatch Team" }],
  creator: "InvoicePatch",
  publisher: "InvoicePatch",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://invoicepatch.com",
    title: "InvoicePatch - Professional Invoicing for Canadian Contractors",
    description: "Stop losing money on unpaid invoices. Get paid 3x faster with CRA-compliant invoicing built for Canadian contractors.",
    siteName: "InvoicePatch",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePatch - Professional Invoicing for Canadian Contractors",
    description: "Stop losing money on unpaid invoices. Get paid 3x faster with CRA-compliant invoicing built for Canadian contractors.",
    creator: "@invoicepatch",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
