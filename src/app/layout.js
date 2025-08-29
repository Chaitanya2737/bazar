import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import ProviderAuth from "@/lib/ProviderAuth";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/component/navBar/page";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Structured Data (JSON-LD) for rich snippets

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Basic Meta */}
        <title>Bazar.sh - Business Hub for Small & Medium Enterprises</title>
        <meta
          name="description"
          content="Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises. Promote your brand using SMS, WhatsApp, Meta ads, and engage your customers with powerful push notifications."
        />
        <meta
          name="keywords"
          content="bazar, business hub, small business website, medium business website, business website builder, small business platform, medium business hub, create business website, SMS marketing, WhatsApp business promotion, Meta ads for business, push notifications, Bazar.sh, local business marketing, digital marketing for small business, online store builder, business promotion tools, grow business online, easy website builder, affordable business website, business CRM tools, ecommerce for local businesses, India business hub, local store promotion, online business tools, WhatsApp marketing India, SMS campaigns for business, Facebook ads for business, Google ads alternative, no-code business website, website builder for India, promote business online, customer engagement tools, SME digital tools"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Bazar.sh - Grow Your Small or Medium Business Online"
        />
        <meta
          property="og:description"
          content="Build a professional website with Bazar.sh and market your business via SMS, WhatsApp, Meta ads, and push notifications. Start growing today!"
        />
        <meta property="og:url" content="https://bazar.sh" />
        <meta property="og:site_name" content="Bazar.sh" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bazar.sh - Business Hub for SMEs" />
        <meta
          name="twitter:description"
          content="Create and promote your business website with Bazar.sh using SMS, WhatsApp, Meta ads, and push notifications."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png"
        />
        <meta name="twitter:creator" content="@BazarSH" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://bazar.sh" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Bazar.sh",
              url: "https://bazar.sh",
              description:
                "Bazar.sh is a business hub for small and medium enterprises to create professional websites and promote via SMS, WhatsApp, Meta ads, and push notifications.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://bazar.sh/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Bazar.sh",
                logo: {
                  "@type": "ImageObject",
                  url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
                  width: 200,
                  height: 60,
                },
              },
              sameAs: [
                "https://twitter.com/BazarSH",
                "https://facebook.com/BazarSH",
                "https://instagram.com/BazarSH",
              ],
            }),
          }}
        />
      </Head>

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
    </html>
  );
}
