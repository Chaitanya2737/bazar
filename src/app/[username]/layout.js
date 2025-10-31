import { getUserBySlug } from "@/lib/generateMetadata";
import React from "react";

export async function generateMetadata(props) {
  const { username } = await props.params;
  const decodedSlug = decodeURIComponent(username || "").trim();

  console.log("📍 current routing:", decodedSlug);

  const { user } = (await getUserBySlug(decodedSlug)) || {};

  if (!user) {
    return {
      title: "Bazar SH - Empowering Small & Medium Businesses",
      description: "Grow your business online with Bazar SH.",
    };
  }

  const categoryNames = Array.isArray(user.categories)
    ? user.categories.map((cat) => cat.name)
    : user.categories?.name
    ? [user.categories.name]
    : [];

  const description =
    user.bio?.length > 160 ? user.bio.slice(0, 157) + "..." : user.bio || "";

  let businessIcon = user.businessIcon;

  // ✅ Fix Cloudinary image for WhatsApp + Facebook preview
  if (businessIcon?.startsWith("https://res.cloudinary.com/")) {
    businessIcon = businessIcon.replace(
      /\/upload\/(v\d+\/)?/,
      "/upload/w_1200,h_630,c_fill,q_auto,f_jpg,fl_attachment:false/$1"
    );
  }


  const title = `${user.businessName} | Bazar SH`;
  const url = `https://www.bazar.sh/${encodeURIComponent(user.slug)}`;

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
    "googlebot":
      "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
  };
}

export default function UserLayout({ children }) {
  return <div>{children}</div>;
}
