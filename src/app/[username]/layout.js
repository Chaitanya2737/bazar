import Script from "next/script";
import React from "react";


export default function UserLayout({ children }) {
  return (
    <>
      {/* Render the child components */}
      <div>{children}</div>
    </>
  );
}
