"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLogout, userLogin } from "@/redux/slice/user/userSlice";
import { useRouter } from "next/navigation";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import ThemeToggle from "@/component/themeToggle/themeToggle";
import Image from "next/image";

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.userAuth);
  const userdata = useSelector((state) => state.userdata);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false); // State for controlling visibility
  const darkMode = useSelector((state) => state.theme.darkMode);

  const { businessName, mobileNumber, businessIcon } = userdata?.userData || {};
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRoleValid = useMemo(() => {
    return session?.user?.role === "user";
  }, [session?.user?.role]);

  useEffect(() => {
    if (session?.user && !user?.id) {
      const { id, email, role, isAuthenticated } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated }));
    }
  }, [session, dispatch, user?.id]);

  useEffect(() => {
    if (user?.id && !userdata?.data) {
      const fetchUserData = async () => {
        try {
          const data = await dispatch(getUserDataApi(user?.id));
          console.log("Fetched User Data:", data);
        } catch (error) {
          console.error("API Fetch Error:", error);
        }
      };
      fetchUserData();
    }
  }, [dispatch, user?.id, userdata?.data]);

  const logout = useCallback(() => {
    dispatch(userLogout());
    signOut({ redirect: true, callbackUrl: "/" });
  }, [dispatch]);

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

  return (
    <div className={`relative text-black dark:bg-gray-800 dark:text-white min-h-screen overflow-x-hidden`}>
    <div
      className="text-start mt-7 mx-3 bg-neutral-200 dark:bg-gray-700 rounded-lg shadow-md"
      style={{
        background: !darkMode
          ? "radial-gradient(circle, #f6c4ed 0%, #caefd7 50%, #b5c6e0 100%)"
          : "linear-gradient(316deg, #523a78 0%, #caefd7 30%, #ee696b 120%)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 items-center">
        {mounted && (
          <Image
            src={businessIcon || "/Sample_User_Icon.png"}
            alt="Business Icon"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover mx-auto"
            loading="lazy"
            decoding="async"
          />
        )}
        <h1 className="text-4xl text-center md:text-left font-semibold">
          {businessName || "Business Name"}
        </h1>
      </div>
      <div className="flex gap-1 items-center justify-center text-[#003049] text-lg mt-4">
        {mobileNumber?.map((number, index) => (
          <div key={index} className="flex items-center">
            <h1>
              {number}
              {index < mobileNumber.length - 1 && " |"}
            </h1>
          </div>
        ))}
      </div>
    </div>
  
    <section>
      <div>
        <h2 className="text-2xl font-semibold mt-4">User Details</h2>
      </div>
    </section>
  
    <div className="flex flex-col items-center mt-10 gap-4">
      {user?.email ? (
        <>
          <h2 className="text-xl font-semibold">Hello,<br /> {user.email}!</h2>
          <p className="text-gray-500">Role: {user.role || "User"}</p>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  
    <ThemeToggle />
  </div>
  
  );
};

export default UserDashboardPage;
