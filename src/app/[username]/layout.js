import { getUserBySlug } from "@/lib/generateMetadata";
import React from "react";

export async function generateMetadata(props) {
  const { username } = await props.params;
  const decodedSlug = decodeURIComponent(username || "").trim();

  console.log("📍 current routing:", decodedSlug);

  const { user } = (await getUserBySlug(decodedSlug)) || {};

  // 🧩 Fallback metadata
  if (!user) {
    return {
      title: "Bazar SH - Empowering Small & Medium Businesses",
      description: "Grow your business online with Bazar SH.",
      openGraph: {
        type: "website",
        siteName: "Bazar SH",
        title: "Bazar SH - Empowering Small & Medium Businesses",
        description: "Grow your business online with Bazar SH.",
        url: "https://www.bazar.sh",
        images: [
          {
            url: "/favicon.png",
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
        images: [
          "/favicon.png",
        ],
      },
    };
  }

  // 🧠 Prepare user info
  const categoryNames = Array.isArray(user.categories)
    ? user.categories.map((cat) => cat.name)
    : user.categories?.name
    ? [user.categories.name]
    : [];

  const description =
    user.bio?.length > 160 ? user.bio.slice(0, 157) + "..." : user.bio || "";

  // 🧩 Cloudinary image optimization
  let businessIcon = user.businessIcon;
  if (businessIcon?.startsWith("https://res.cloudinary.com/")) {
    businessIcon = businessIcon.replace(
      /\/upload\/(v\d+\/)?/,
      "/upload/w_1200,h_630,c_fill,q_auto,f_jpg/$1"
    );
  }

  // 🧩 Create proper one-line encoded URL
  const title = `${user.businessName} | Bazar SH`;
  const url = `https://www.bazar.sh/${encodeURIComponent(user.slug)}`;

  // 🧠 Log for debugging (server-side)
  console.log("🧠 Generated Metadata:", { title, description, url, businessIcon });

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
