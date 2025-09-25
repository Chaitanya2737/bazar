"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "sonner";

import { loadFromStorage, resetUserPreview } from "@/redux/slice/user/preview";
import { getUserPreview } from "@/redux/slice/user/serviceApi";

import Navbar from "@/component/preview/Navbar";
import MainSection from "@/component/preview/MainSection";
import { Skeleton } from "@/components/ui/skeleton";
import Carusel from "@/component/user/Carusel";
import ScrollCards from "@/component/user/OverlappingCards";
import HeroSection from "@/component/user/HeroSection";
import Contact from "@/component/user/Contact";
import Footer from "@/component/user/Footer";
import Video from "@/component/user/Video";
import Product from "@/component/user/Product";
import PreviewOffer from "@/component/user/SiteOffer/PreviewOffer";
import Head from "next/head";
import NotificationManager from "@/component/notification/NotificationManager";

const getPageKey = (pathname) => `visitCount:${pathname}`;
const getSessionKey = (pathname) => `hasVisited:${pathname}`;

const UserPreview = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { userPreview, loading } = useSelector(
    (state) => state.previewData || {}
  );

  const [visitCount, setVisitCount] = useState(null);
  const [backendVisitCount, setBackendVisitCount] = useState(null);

  const storedPreview = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userPreview") || "{}");
    } catch {
      return {};
    }
  }, []);

  const sendVisitCountToBackend = async (id, count) => {
    try {
      const response = await axios.post("/api/user/usercount", {
        userId: id,
        visitCount: count,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending visit count:", error);
      toast.error("Failed to send visit count to backend.");
    }
  };

  const trackPageVisit = useCallback(async () => {
    const pageKey = getPageKey(pathname);
    const sessionKey = getSessionKey(pathname);

    if (!sessionStorage.getItem(sessionKey)) {
      const prevCount = parseInt(localStorage.getItem(pageKey) || "0", 10);
      const newCount = prevCount + 1;

      localStorage.setItem(pageKey, newCount.toString());
      setVisitCount(newCount);
      sessionStorage.setItem(sessionKey, "true");

      const userId = storedPreview?.data?._id;

      if (userId) {
        const response = await sendVisitCountToBackend(userId, newCount);
        if (response?.visitCount !== undefined) {
          setBackendVisitCount(response.visitCount);
          localStorage.setItem("visitCount", response.visitCount.toString());
          toast.success("Event has been created");
        }
      } else {
        toast.error("User ID not found. Skipping visit count update.");
      }
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
          page_path: pathname,
          page_title: document.title,
        });
      }
    } else {
      const count = parseInt(localStorage.getItem(pageKey) || "0", 10);
      setVisitCount(count);
    }
  }, [pathname, storedPreview]);

  const fetchUserData = useCallback(async () => {
    try {
      const parts = decodeURIComponent(window.location.pathname)
        .split("/")
        .filter(Boolean);
      const subdomain = parts[0];

      if (!subdomain) {
        toast.error("Subdomain not found in URL");
        return;
      }

      localStorage.setItem("subdomain", subdomain);
      localStorage.removeItem("userPreview");
      dispatch(resetUserPreview());

      const action = await dispatch(getUserPreview(subdomain));

      if (getUserPreview.rejected.match(action)) {
        const message = action.payload || "Authorization failed.";
        router.replace("/error/not-authorized");
        toast.error(message);
        return;
      }

      if (action.payload) {
        localStorage.setItem("userPreview", JSON.stringify(action.payload));
      } else {
        toast.error("No data returned for the user preview.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.replace("/error/not-authorized");
      toast.error("Unexpected error occurred while fetching user data.");
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    trackPageVisit();

    const userPreviewData = localStorage.getItem("userPreview");
    const storedSubdomain = localStorage.getItem("subdomain");
    const currentSubdomain = pathname.split("/")[1];

    if (!userPreviewData || storedSubdomain !== currentSubdomain) {
      fetchUserData();
    } else {
      dispatch(loadFromStorage(JSON.parse(userPreviewData)));
    }
  }, [trackPageVisit, fetchUserData, dispatch, pathname]);

  const data = userPreview?.data;
  const image = data?.carauselImages || [];
  const review = data?.review || null;

  const renderSkeleton = loading || !data;
  const metadata = {
    title: data?.businessName?.trim() || "Bazar SH",
    description: data?.bio?.trim() || "User profile on Bazar SH",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : `https://bazarsh.com${pathname}`,
    keywords: [
      data?.businessName?.trim(),
      "Bazar SH",
      ...(data?.bio ? data.bio.split(/\s+/).slice(0, 10) : []),
    ]
      .filter(Boolean)
      .join(", "),
    images: Array.isArray(data?.carauselImages) ? data.carauselImages : [],
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
        {Array.isArray(metadata.images) && metadata.images.length > 0 && (
          <meta property="og:image" content={metadata.images[0]} />
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        {Array.isArray(metadata.images) && metadata.images.length > 0 && (
          <meta name="twitter:image" content={metadata.images[0]} />
        )}
        <link rel="canonical" href={metadata.url} />
      </Head>

      <div className="bg-white text-black dark:bg-gray-800 dark:text-white min-h-screen p-4 relative">
        <Toaster />
        <Navbar />
        <NotificationManager />

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <PreviewOffer userId={data?._id} />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          data && (
            <MainSection
              businessName={data.businessName}
              icon={data.businessIcon}
              mobileNumber={data.mobileNumber}
              bio={data.bio}
              email={data.email}
              handlerName={data.handlerName}
              categories={data.categories}
              gstNumber={data.gstNumber}
            />
          )
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Contact
            socialMediaLinks={data.socialMediaLinks || []}
            email={data.email}
            location={data.businessLocation || ""}
            mobileNumber={data.mobileNumber}
          />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Carusel image={image} />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Video Video={data.videoUrl} />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Product />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <HeroSection />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <ScrollCards reviewId={review} />
        )}

        {renderSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Footer businessName={data.businessName} />
        )}
      </div>
    </>
  );
};

export default UserPreview;
