import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import ProviderAuth from "@/lib/ProviderAuth";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/component/navBar/page";

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
  keywords: [
    "bazar",
    "business hub",
    "small business website",
    "medium business website",
    "business website builder",
    "small business platform",
    "medium business hub",
    "create business website",
    "SMS marketing",
    "WhatsApp business promotion",
    "Meta ads for business",
    "push notifications",
    "Bazar.sh",
    "local business marketing",
    "digital marketing for small business",
    "online store builder",
    "business promotion tools",
    "grow business online",
    "easy website builder",
    "affordable business website",
    "business CRM tools",
    "ecommerce for local businesses",
    "India business hub",
    "local store promotion",
    "online business tools",
    "WhatsApp marketing India",
    "SMS campaigns for business",
    "Facebook ads for business",
    "Google ads alternative",
    "no-code business website",
    "website builder for India",
    "promote business online",
    "customer engagement tools",
    "SME digital tools",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  images: [
    {
      url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
      width: 1200,
      height: 630,
      alt: "Bazar.sh Business Hub",
    },
  ],
  alternates: {
    canonical: "https://bazar.sh",
    languages: {
      "en-US": "https://bazar.sh/en",
    },
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
  openGraph: {
    title: "Bazar.sh - Grow Your Small or Medium Business Online",
    description:
      "Build a professional website with Bazar.sh and market your business via SMS, WhatsApp, Meta ads, and push notifications. Start growing today!",
    url: "https://bazar.sh",
    siteName: "Bazar.sh",
    images: [
      {
        url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
        width: 1200,
        height: 630,
        alt: "Bazar.sh Business Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bazar.sh - Business Hub for SMEs",
    description:
      "Create and promote your business website with Bazar.sh using SMS, WhatsApp, Meta ads, and push notifications.",
    creator: "@BazarSH",
    images: [
      "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
    ],
  },
  other: {
    "msapplication-TileImage": "/images/favicon.png",
  },
};

// Structured Data (JSON-LD) for rich snippets
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bazar.sh",
  url: "https://bazar.sh",
  description:
    "Bazar.sh is a business hub for small and medium enterprises to create professional websites and promote via SMS, WhatsApp, Meta ads, and push notifications.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bazar.sh/search?q={search_term_string}", // Replace with actual search URL
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Bazar.sh",
    logo: {
      "@type": "ImageObject",
      url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png", // Replace with actual logo path
      width: 200,
      height: 60,
    },
  },
  sameAs: [
    "https://twitter.com/BazarSH", // Replace with actual Twitter URL
    "https://facebook.com/BazarSH", // Replace with actual Facebook URL
    "https://instagram.com/BazarSH", // Replace with actual Instagram URL
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
    </html>
  );
}
