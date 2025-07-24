// app/layout.js or app/layout.tsx (Next.js 13+ with App Router)

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import ProviderAuth from "@/lib/ProviderAuth";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/component/navBar/page";
import Script from "next/script"; // ✅ Important import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // your existing metadata as it is
};

export default function RootLayout({ children }) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <>
        {/* ✅ Google Analytics Scripts */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <head>
          <link rel="icon" href="/favicon.png" type="image/png" />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <ProviderAuth>{children}</ProviderAuth>
              <Toaster
                toastOptions={{
                  success: { backgroundColor: "#4CAF50" },
                  error: { backgroundColor: "#f44336" },
                  dark: { backgroundColor: "#2D2D2D", color: "white" },
                }}
                className="max-w-lg mx-auto"
              />
            </Providers>
          </ThemeProvider>
        </body>
      </>
    </html>
  );
}
