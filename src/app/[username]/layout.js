import { getUserBySlug } from "@/lib/generateMetadata";
import React from "react";

export async function generateMetadata({ params }) {
  const decodedSlug = decodeURIComponent(params?.username || "").trim();

  const { user } = (await getUserBySlug(decodedSlug)) || {};

  const BASE_URL = "https://www.bazar.sh";

  // 🔹 Fallback metadata
  if (!user) {
    const fallbackImage = `${BASE_URL}/og-default.jpg`; // make sure this is 1200x630

    return {
      title: "Bazar SH - Empowering Small & Medium Businesses",
      description: "Grow your business online with Bazar SH.",
      openGraph: {
        type: "website",
        siteName: "Bazar SH",
        title: "Bazar SH - Empowering Small & Medium Businesses",
        description: "Grow your business online with Bazar SH.",
        url: BASE_URL,
        images: [
          {
            url: fallbackImage,
            width: 1200,
            height: 630,
            alt: "Bazar SH",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Bazar SH - Empowering Small & Medium Businesses",
        description: "Grow your business online with Bazar SH.",
        images: [fallbackImage],
      },
    };
  }

  // 🔹 Categories
  const categoryNames = Array.isArray(user.categories)
    ? user.categories.map((cat) => cat.name)
    : user.categories?.name
      ? [user.categories.name]
      : [];

  // 🔹 Description limit
  const description =
    user.bio?.length > 160
      ? user.bio.slice(0, 157) + "..."
      : user.bio || `Visit ${user.businessName} on Bazar SH`;

  // 🔹 Cloudinary 1200x630 Transform (FULL WIDTH FIX)
  let businessIcon = user.businessIcon;

  if (businessIcon?.includes("/upload/")) {
    businessIcon = businessIcon.replace(
      "/upload/",
      "/upload/w_1200,h_630,c_pad,ar_1.91,b_white,q_auto,f_auto/",
    );
  }

  const title = `${user.businessName} | Bazar SH`;
  const url = `${BASE_URL}/${encodeURIComponent(user.slug)}`;

  return {
    title,
    description,
    keywords: `${categoryNames.join(", ")}, ${user.businessName}, Bazar SH`,
    openGraph: {
      type: "website",
      siteName: "Bazar SH",
      title,
      description,
      url,
      images: [
        {
          url: businessIcon,
          width: 1200,
          height: 630,
          alt: user.businessName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [businessIcon],
    },
    alternates: {
      canonical: url,
    },
    robots: "index, follow",
  };
}

export default function UserLayout({ children }) {
  return <div>{children}</div>;
}
