"use client";

import PageVisitTracker from "@/component/googleAnalyatic/Analytic";
import { loadFromStorage, resetUserPreview } from "@/redux/slice/user/preview";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import ReactGA from "react-ga4";
import { getUserPreview } from "@/redux/slice/user/serviceApi";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/component/themeToggle/themeToggle";
import Navbar from "@/component/preview/Navbar";
import MainSection from "@/component/preview/MainSection";

const GA_MEASUREMENT_ID = "G-ZXSFD634MS";

let gaInitialized = false;

const getPageKey = (pathname) => `visitCount:${pathname}`;
const getSessionKey = (pathname) => `hasVisited:${pathname}`;

const UserPreview = () => {
  const dispatch = useDispatch();
  const { userPreview, loading, errorMessage } = useSelector(
    (state) => state.previewData || {}
  );
  const pathname = usePathname();
  const [visitCount, setVisitCount] = useState(null);

  const initializeGA = useCallback(() => {
    if (!gaInitialized) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      gaInitialized = true;
    }
  }, []);

  const trackPageVisit = useCallback(() => {
    const pageKey = getPageKey(pathname);
    const sessionKey = getSessionKey(pathname);

    ReactGA.send({ hitType: "pageview", page: pathname });

    const hasVisitedThisSession = sessionStorage.getItem(sessionKey);

    if (!hasVisitedThisSession) {
      const previousCount = parseInt(localStorage.getItem(pageKey) || "0", 10);
      const newCount = previousCount + 1;

      localStorage.setItem(pageKey, newCount.toString());
      setVisitCount(newCount);
      sessionStorage.setItem(sessionKey, "true");

      ReactGA.event({
        category: "User Engagement",
        action: "first_visit",
        label: `First Visit ${pathname}`,
        value: 1,
      });

      ReactGA.event({
        category: "User Engagement",
        action: "page_visit",
        label: `Visit ${newCount} at ${pathname}`,
        value: newCount,
      });

      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } else {
      const count = parseInt(localStorage.getItem(pageKey) || "0", 10);
      setVisitCount(count);
    }
  }, [pathname]);

  const fetchUserData = useCallback(async () => {
    try {
      const rawPath = window.location.pathname;

      // Decode the pathname to handle special characters or encoded characters like %20 for spaces
      const decodedPath = decodeURIComponent(rawPath);

      // Split the decoded pathname by slashes and filter out empty parts
      const parts = decodedPath.split("/").filter(Boolean);

      // Extract the first part (subdomain) from the URL path
      const subdomain = parts.length > 0 ? parts[0] : null;

      if (!subdomain) {
        toast.error("Subdomain not found in URL");
        return;
      }

      // Log or use the subdomain
      console.log("Subdomain:", subdomain);
      localStorage.setItem("subdomain", subdomain);

      // Clean up old preview
      localStorage.removeItem("userPreview");
      dispatch(resetUserPreview());

      const action = await dispatch(getUserPreview(subdomain));

      if (action.payload) {
        // Only store the data if it's valid
        localStorage.setItem("userPreview", JSON.stringify(action.payload));
        toast.success("User data fetched successfully!");
      } else {
        toast.error("No data returned for the user preview.");
      }
    } catch (error) {
      toast.error("Error fetching user data");
      // Ensure no data is saved to localStorage in case of error
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    initializeGA();
    trackPageVisit();

    // Get userPreview data from localStorage
    const userPreviewData = localStorage.getItem("userPreview");

    // Get subdomain from localStorage
    const storedSubdomain = localStorage.getItem("subdomain");

    // If userPreview data doesn't exist or subdomain doesn't match, fetch new data
    if (!userPreviewData || storedSubdomain !== pathname.split("/")[1]) {
      fetchUserData();
    } else {
      dispatch(loadFromStorage(JSON.parse(userPreviewData)));
    }

    return () => {
      setVisitCount(null);
    };
  }, [initializeGA, trackPageVisit, fetchUserData, dispatch, pathname]);

  if (visitCount === null) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }
  console.log(userPreview.data);

  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white min-h-screen p-4 relative">
      {userPreview?.data ? (
        <div>
          <h2>User Preview</h2>
          <p>{userPreview.data.businessName}</p>
          <p>{userPreview.data.email}</p>
        </div>
      ) : (
        <div>No user data available</div>
      )}

      <Navbar />
      <MainSection
        businessName={userPreview.data.businessName}
        icon={userPreview.data.businessIcon}
        mobileNumber={userPreview.data.mobileNumber}
        bio={userPreview.data.bio}
        email={userPreview.data.email}
        handlerName={userPreview.data.handlerName}
        socialMediaLinks={userPreview.data.socialMediaLinks}
        location={userPreview.data?.businessLocation || ""}
      />
      <ThemeToggle />
    </div>
  );
};

export default UserPreview;
