import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { RoleProvider } from "@/contexts/RoleContext";
import RoleBreadcrumb from "@/components/RoleBreadcrumb";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContractorProvider } from "@/contexts/ContractorContext";

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
  title: "InvoicePatch - Streamlined Invoice Processing",
  description: "Automate your contractor invoice processing with AI-powered reconciliation and approval workflows",
  keywords: "invoicing, contractors, Canada, CRA compliant, HST, GST, payment tracking, automated workflows",
  authors: [{ name: "InvoicePatch Team" }],
  creator: "InvoicePatch",
  publisher: "InvoicePatch",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://invoicepatch.com",
    title: "InvoicePatch - Streamlined Invoice Processing",
    description: "Automate your contractor invoice processing with AI-powered reconciliation and approval workflows",
    siteName: "InvoicePatch",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePatch - Streamlined Invoice Processing",
    description: "Automate your contractor invoice processing with AI-powered reconciliation and approval workflows",
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
          <RoleProvider>
            <ContractorProvider>
              <RoleBreadcrumb />
              {children}
              <Analytics />
            </ContractorProvider>
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
