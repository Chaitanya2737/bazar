import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import ProviderAuth from "@/lib/ProviderAuth";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bazar.sh - Business Hub for Small & Medium Enterprises",
  description:
    "Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises. Promote your brand using SMS, WhatsApp, Meta ads, and engage your customers with powerful push notifications.",
  keywords:
    "bazar, business hub, small business website, medium business website, business website builder, online marketing, push notifications",
  openGraph: {
    title: "Bazar.sh - Business Hub for Small & Medium Enterprises",

    description:
      "Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises. Promote your brand using SMS, WhatsApp, Meta ads, and engage your customers with powerful push notifications.",
    url: "https://bazar.sh",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
        width: 1200,
        height: 630,
        alt: "Bazar.sh Social Preview",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Bazar.sh - Business Hub for Small & Medium Enterprises",
    description:
      "Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises. Promote your brand using SMS, WhatsApp, Meta ads, and engage your customers with powerful push notifications.",
    images: [
      "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
    ],
  },
  alternates: {
    canonical: "https://bazar.sh",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <Analytics />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HX7PDV877D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HX7PDV877D');
        `}
        </Script>
    <script
          async
          id="adsbygoogle-script"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5404817035821633"
          crossOrigin="anonymous"
        ></script>

        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Bazar.sh",
              url: "https://bazar.sh",
              logo: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
              image:
                "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
              description:
                "Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises.",
              telephone: "+91-8421679469",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Madhavnagar",
                addressLocality: "Sangli",
                addressRegion: "Maharashtra",
                postalCode: "416416",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 16.8868513,
                longitude: 74.5860027,
              },
              openingHours: "Mo-Sa 09:00-19:00",
              sameAs: [],
              keywords: metadata.keywords, // ✅ pull directly from metadata
            }),
          }}
        />
      </body>
    </html>
  );
}
