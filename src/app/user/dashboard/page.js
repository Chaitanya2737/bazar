"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { userLogout, userLogin } from "@/redux/slice/user/userSlice";
import { useRouter } from "next/navigation";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import MainSection from "@/component/preview/MainSection";
import HeroMarketing from "@/component/user/UserPanel/HeroForUser";
import Referral from "@/component/user/UserPanel/Referral";

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();

  const user = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const isRoleValid = useMemo(() => session?.user?.role === "user", [session]);

  useEffect(() => {
    if (session?.user && !user?.id) {
      const { id, email, role, isAuthenticated } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated }));
    }
  }, [session, dispatch, user?.id]);

  useEffect(() => {
    if (user?.id && !userdata?.data) {
      dispatch(getUserDataApi(user?.id)).catch((err) =>
        console.error("User Data Fetch Error:", err)
      );
    }
  }, [dispatch, user?.id, userdata?.data]);

  const handleLogout = useCallback(() => {
    dispatch(userLogout());
    signOut({ redirect: true, callbackUrl: "/" });
  }, [dispatch]);

  const handleAddVideo = useCallback(() => {}, [router, user?.id]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center mt-10">You are not authenticated.</div>;
  }

  if (!isRoleValid) {
    return (
      <div className="text-center mt-10">
        You do not have the correct role to access this page.
      </div>
    );
  }

  const {
    businessName,
    mobileNumber,
    businessIcon,
    email,
    handlerName,
    socialMediaLinks,
    businessLocation,
    bio,
  } = userdata?.userData || {};

  return (
    <div className="relative text-black dark:bg-gray-800 dark:text-white min-h-screen overflow-x-hidden">
      {/* <div
        className="text-start mt-7 mx-3 rounded-lg shadow-md"
        style={{
          background: darkMode
            ? "linear-gradient(316deg, #523a78 0%, #caefd7 30%, #ee696b 120%)"
            : "radial-gradient(circle, #f6c4ed 0%, #caefd7 50%, #b5c6e0 100%)",
        }}
      >
        <MainSection
          businessName={businessName}
          icon={businessIcon}
          mobileNumber={mobileNumber}
          bio={bio}
          email={email}
          handlerName={handlerName}
          socialMediaLinks={socialMediaLinks}
          location={businessLocation || ""}
        />
      </div> */}

      

      <div>
        <HeroMarketing />
      </div>


      <div>
        <Referral />
      </div>
    </div>
  );
};

export default UserDashboardPage;
