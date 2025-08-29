import Navbar, { SupportNavForLaptop } from "@/component/navBar/page";
import DisplayOffer from "@/component/user/SiteOffer/DisplayOffer";
import React from "react";

// Server-rendered metadata for SEO & social sharing
export const metadata = {
  title: "Special Offer - Exclusive Deals",
  description:
    "Explore our latest exclusive offers and deals. Sign up now to unlock special discounts and promotions!",
  keywords: "offers, deals, discounts, promotions, exclusive",
  openGraph: {
    title: "Special Offer - Exclusive Deals",
    description:
      "Explore our latest exclusive offers and deals. Sign up now to unlock special discounts and promotions!",
    url: "https://www.bazar.sh/offers",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
        width: 1200,
        height: 630,
        alt: "Bazar.sh Special Offer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Special Offer - Exclusive Deals",
    description:
      "Explore our latest exclusive offers and deals. Sign up now to unlock special discounts and promotions!",
    images: [
      "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
    ],
  },
  alternates: {
    canonical: "https://www.bazar.sh/offers",
  },
};

export default function Page() {
  return (
    <>
      <Navbar />
      <SupportNavForLaptop />
      <DisplayOffer />
    </>
  );
}
