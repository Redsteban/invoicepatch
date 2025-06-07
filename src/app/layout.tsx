import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/AuthContext";

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
  title: "InvoicePatch - Intelligent Invoice Reconciliation for Managers",
  description: "Process all contractor payments in minutes, not hours or days. Upload contractor invoices and watch AI handle matching, validation, and exception detection in minutes.",
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
        <AuthProvider>
          <Header />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
