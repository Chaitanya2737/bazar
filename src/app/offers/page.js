import DisplayOffer from "@/component/user/SiteOffer/DisplayOffer";
import Head from "next/head";
import React from "react";

const page = () => {
  return (
    <>
      <Head>
        <title>Special Offer - Exclusive Deals</title>
        <meta
          name="description"
          content="Explore our latest exclusive offers and deals. Sign up now to unlock special discounts and promotions!"
        />
        <meta
          name="keywords"
          content="offers, deals, discounts, promotions, exclusive"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Special Offer - Exclusive Deals" />
        <meta
          property="og:description"
          content="Explore our latest exclusive offers and deals. Sign up now to unlock special discounts and promotions!"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.bazar.sh/offers" />
      </Head>
      <DisplayOffer />
    </>
  );
};

export default page;
