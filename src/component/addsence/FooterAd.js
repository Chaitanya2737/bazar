"use client";
import { useEffect } from "react";

export default function FooterAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className="mt-8 text-center">
      {/* Google AdSense: Footer_Responsive_Ad */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5404817035821633"
        data-ad-slot="7885801866"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
