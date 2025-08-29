"use client";

import React from "react";
import Head from "next/head";

export default function UserLayout({ children, metadata }) {
  // Ensure images is always an array to avoid errors
  const images = Array.isArray(metadata?.images) ? metadata.images : [];

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <title>{metadata?.title || "User Website Preview"}</title>
        <meta
          name="description"
          content={metadata?.description || "Preview the personalized bazar for a user"}
        />
        {metadata?.keywords && <meta name="keywords" content={metadata.keywords} />}

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={metadata?.title || "User Website Preview"} />
        <meta
          property="og:description"
          content={metadata?.description || "Preview the personalized bazar for a user"}
        />
        <meta property="og:url" content={metadata?.url || "https://www.bazar.sh"} />
        {images.length > 0 && <meta property="og:image" content={images[0]} />}
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata?.title || "User Website Preview"} />
        <meta
          name="twitter:description"
          content={metadata?.description || "Preview the personalized bazar for a user"}
        />
        {images.length > 0 && <meta name="twitter:image" content={images[0]} />}

        {/* Canonical URL */}
        <link rel="canonical" href={metadata?.url || "https://www.bazar.sh"} />
      </Head>

      {/* Render the page content */}
      <div>{children}</div>
    </>
  );
}
