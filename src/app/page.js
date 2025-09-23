"use client";
import { useSelector } from "react-redux";
import Navbar, { SupportNavForLaptop } from "@/component/navBar/page";
import Maincomp from "@/component/mainpage/main";
import Head from "next/head";
import NotificationManager from "@/component/notification/NotificationManager";


export default function Home() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  // abcd

  const metadata = {
    title: "Bazar.sh - Business Hub for Small & Medium Enterprises",
    description:
      "Build your business website effortlessly with Bazar.sh — the all-in-one platform for small and medium enterprises. Promote your brand using SMS, WhatsApp, Meta ads, and engage your customers with powerful push notifications.",
    keywords:
      "bazar, business hub, small business website, medium business website, business website builder, ...",
    url: "https://bazar.sh",
    images: [
      "https://res.cloudinary.com/dp8evydam/image/upload/v1752949353/bazar.sh_social_png_ou5arw.png",
    ],
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        {metadata.images.length > 0 && (
          <meta property="og:image" content={metadata.images[0]} />
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        {metadata.images.length > 0 && (
          <meta name="twitter:image" content={metadata.images[0]} />
        )}
        <link rel="canonical" href={metadata.url} />
      </Head>

      <div
        className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4 ${
          darkMode ? "dark" : ""
        }`}
      >
        <Navbar />
        <div className="pb-16 md:pb-16">
          <Maincomp /> 
            
        </div>
        <NotificationManager />
        <SupportNavForLaptop />
      </div>
    </>
  );
}