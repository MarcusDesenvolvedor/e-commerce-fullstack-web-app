import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-commerce | Fullstack Web App",
  description:
    "Fullstack e-commerce web app — product catalog, cart, checkout, order history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", dmSans.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ClerkProvider>
          <Header />
          <main className="flex-1 px-6 md:px-8 lg:px-10">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
