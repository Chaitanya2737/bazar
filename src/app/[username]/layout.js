import Script from "next/script";
import React from "react";

export const metadata = {
  title: "User Website Preview",
  description: "Preview the personalized bazar for a user",
};

export default function UserLayout({ children }) {
  return (
    <>
      {/* Google Analytics Scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
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
      <div>{children}</div>
    </>
  );
}
