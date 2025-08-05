"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLogout, userLogin } from "@/redux/slice/user/userSlice";
import { useParams, useRouter } from "next/navigation";

const UserDashboardPage = () => {
  const admin = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRoleValid, setIsRoleValid] = useState(false);

  useEffect(() => {
    if (session?.user && !admin?.id) {
      const { id, email, role, isAuthenticated } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated }));
      console.log("User data synced to Redux");
    }
    // Validate role if needed
    if (session?.user?.role === "admin") {
      setIsRoleValid(true);
    } else {
      setIsRoleValid(false);
    }
  }, [session, dispatch, admin?.id]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            You are not authenticated
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Please{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              sign in
            </button>{" "}
            to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isRoleValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Unauthorized Access
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            You do not have permission to view this page.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 dark:bg-gray-800 sm:p-12">
        <div className="flex items-center justify-between">
          <h2 className="animate-fade-in text-4xl font-bold text-gray-800 dark:text-white sm:text-5xl">
            Welcome 👋
          </h2>
        </div>
        <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed sm:text-xl">
          Seamlessly manage users, add new ones, and keep your system updated
          with our user-friendly platform.{" "}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => router.push(`/adduser/${admin?.id}`)}
            className="transform rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
          >
            Register User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
