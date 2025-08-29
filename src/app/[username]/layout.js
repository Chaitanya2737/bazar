import Script from "next/script";
import React from "react";

export const metadata = {
  title: "Bazar SH - Empowering Small & Medium Businesses",
  description:
    "BazarSh provides small and medium businesses with powerful digital solutions to grow online, manage their brand effectively, and reach more customers effortlessly",
  keywords:
    "BazarSh, online marketplace, business growth, digital tools, small business, medium business, SME, marketing solutions",
  robots: "index, follow",
  openGraph: {
    title: "Bazar SH - Empowering Small & Medium Businesses",
    description:
      "Learn about BazarSh’s vision, mission, and values that empower SMEs to grow digitally and manage their business effectively.",
    type: "website",
    url: "https://www.bazar.sh",
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
    title: "Bazar SH - Empowering Small & Medium Businesses",
    description:
      "Learn about BazarSh’s vision, mission, and values that empower SMEs to grow digitally.",
    images: [
      "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
    ],
  },
  canonical: "https://www.bazar.sh",
};
export default function UserLayout({ children }) {
  return (
    <>
      {/* Render the child components */}
      <div>{children}</div>
    </>
  );
}
