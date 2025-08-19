"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { userLogout, userLogin } from "@/redux/slice/user/userSlice";
import { useRouter } from "next/navigation";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import HeroMarketing from "@/component/user/UserPanel/HeroForUser";
import SiteOffer from "@/component/user/SiteOffer/SiteOffer";

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

  // const {
  //   businessName,
  //   mobileNumber,
  //   businessIcon,
  //   email,
  //   handlerName,
  //   socialMediaLinks,
  //   businessLocation,
  //   bio,
  // } = userdata?.userData || {};

  return (
    <div className="relative text-black dark:bg-gray-800 dark:text-white min-h-screen overflow-x-hidden">

      <div>
        <HeroMarketing />
      </div>
      <div className="px-4 md:px-8 mt-6">
        <div
          className="rounded-2xl shadow-lg p-6 my-3 md:p-8 transition-all duration-300"
          style={{
            background: darkMode
              ? "linear-gradient(160deg, #2d2d3a 0%, #1e1e28 100%)"
              : "linear-gradient(160deg, #ffffff 0%, #f1f5f9 100%)",
          }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">
            🎁 ग्राहकांसाठी खास ऑफर्स जोडा
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            आपल्या व्यवसायासाठी मर्यादित कालावधीच्या ऑफर्स तयार करा!
          </p>

          {/* Site Offer Component */}
          <SiteOffer />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
