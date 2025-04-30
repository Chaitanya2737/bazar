import Script from "next/script";
import React from "react";

// You can define your metadata here for SEO optimization
export const metadata = {
  title: "User Website Preview",
  description: "Preview the personalized bazar for a user",
};

export default function UserLayout({ children }) {
  return (
    <>
      {/* Google Analytics Script for GA4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />

      {/* Initialize Google Analytics */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
          `,
        }}
      />

      {/* Render the child components */}
      <div>{children}</div>
    </>
  );
}
