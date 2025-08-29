import React from "react";

// Export metadata at the top level
export const metadata = {
  title: "About Us | Bazar Sh - Empowering Small & Medium Businesses",
  description:
    "BazarSh empowers small and medium businesses with innovative digital tools. Discover our vision, mission, and core values driving growth and seamless online solutions.",
  keywords:
    "BazarSh, online marketplace, mission, vision, business growth, digital tools, small business, medium business, SME, marketing solutions",
  robots: "index, follow",
  openGraph: {
    title: "About Us | BazarSh",
    description:
      "Learn about BazarSh’s vision, mission, and values that empower SMEs to grow digitally and manage their business effectively.",
    type: "website",
    url: "https://www.bazar.sh/about-us",
    siteName: "Bazar Sh",
    images: [
      {
        url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | BazarSh",
    description:
      "Learn about BazarSh’s vision, mission, and values that empower SMEs to grow digitally.",
  },
  canonical: "https://www.bazar.sh/about-us",
};

export default function AboutLayout({ children }) {
  return <div>{children}</div>;
}
