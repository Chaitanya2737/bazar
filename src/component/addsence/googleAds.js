'use client';
import { useEffect } from 'react';

export default function AdSense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
     <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5404817035821633"
        data-ad-slot="7885801866"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
  );
}
