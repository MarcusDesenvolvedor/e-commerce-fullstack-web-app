import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { FullPageBackground } from "@/components/layout/FullPageBackground";
import { HomeBackgroundBody } from "@/components/layout/HomeBackgroundBody";
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
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');}})();`,
        }}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen flex-col antialiased`}
      >
        <ClerkProvider>
          <HomeBackgroundBody />
          <FullPageBackground />
          <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
            <Header />
            <main className="flex-1 w-full bg-transparent">{children}</main>
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
