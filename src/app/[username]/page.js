"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "sonner";

import { loadFromStorage, resetUserPreview } from "@/redux/slice/user/preview";
import { getUserPreview } from "@/redux/slice/user/serviceApi";

import Navbar from "@/component/preview/Navbar";
import MainSection from "@/component/preview/MainSection";
import Userpreviewcount from "@/component/preview/Userpreviewcount";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Carusel from "@/component/user/Carusel";
import ScrollCards from "@/component/user/OverlappingCards";
import HeroSection from "@/component/user/HeroSection";
import Contact from "@/component/user/Contact";
import Footer from "@/component/user/Footer";
import Video from "@/component/user/Video";
import Product from "@/component/user/Product";
import PreviewOffer from "@/component/user/SiteOffer/PreviewOffer";

const getPageKey = (pathname) => `visitCount:${pathname}`;
const getSessionKey = (pathname) => `hasVisited:${pathname}`;

const UserPreview = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { userPreview, loading, errorMessage } = useSelector(
    (state) => state.previewData || {}
  );

  const [visitCount, setVisitCount] = useState(null);
  const [backendVisitCount, setBackendVisitCount] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

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

        // Redirect first to avoid visual delay
        router.replace("/error/not-authorized");

        // Then optionally toast (if still needed)
        toast.error(message);
        return;
      }

      if (action.payload) {
        localStorage.setItem("userPreview", JSON.stringify(action.payload));
        toast.success("User data fetched successfully!");
      } else {
        toast.error("No data returned for the user preview.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Redirect immediately on unexpected error
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
  if (!image) {
    toast.error("No images found for the carousel.");
    return null;
  }

  const renderUserDataSkeleton = loading || !data;
  const renderMainSectionSkeleton = loading || !data;

  return (
    <>
      <div className="bg-white text-black dark:bg-gray-800 dark:text-white min-h-screen p-4 relative">
        <Toaster />
        <Navbar />
        {/* Skeleton for Main Section */}

        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <PreviewOffer userId = {data?._id} />
        )}


        {renderMainSectionSkeleton ? (
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

        <Userpreviewcount count={backendVisitCount} />

        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Contact
            socialMediaLinks={data.socialMediaLinks || []}
            email={data.email}
            location={data.businessLocation || ""}
            mobileNumber={data.mobileNumber}
          />
        )}

             {/* <Userpreviewcount count={backendVisitCount} /> */}
        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Carusel image={image} />
        )}

     

        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Video Video={data.videoUrl} />
        )}

        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Product />
        )}

           {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <HeroSection />
        )}

   

        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <ScrollCards />
        )}

        {renderMainSectionSkeleton ? (
          <Skeleton className="w-full h-64 bg-gray-800 rounded mb-4" />
        ) : (
          <Footer businessName={data.businessName} />
        )}
      </div>
    </>
  );
};

export default UserPreview;
