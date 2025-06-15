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
     
      {/* Render the child components */}
      <div>{children}</div>
    </>
  );
}
