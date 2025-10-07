import { getUserBySlug } from "@/lib/generateMetadata";
import React from "react";

export async function generateMetadata(props) {
  // ✅ Await params first (as per Next.js docs)
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
    user.bio?.length > 160 ? user.bio.slice(0, 157) + "..." : user.bio;

  return {
    title: `${user.businessName} | Bazar SH`,
    description,
    keywords: `${categoryNames.join(", ")}, ${user.businessName}, Bazar SH`,
    openGraph: {
      title: `${user.businessName} | Bazar SH`,
      description,
      url: `https://user.bazar.sh/${encodeURIComponent(user.slug)}`,
      images: [
        {
          url: user.businessIcon || "/default-og.png",
          width: 1200,
          height: 630,
          alt: user.businessName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.businessName} | Bazar SH`,
      description,
      images: [user.businessIcon || "/default-og.png"],
    },
    canonical: `https://user.bazar.sh/${encodeURIComponent(user.slug)}`,
  };
}

export default function UserLayout({ children }) {
  return <div>{children}</div>;
}
