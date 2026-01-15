"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLogout, userLogin } from "@/redux/slice/user/userSlice";
import { useParams, useRouter } from "next/navigation";
import SearchUser from "@/component/admin/UserList/SearchUser";
import Image from "next/image";
import { UserRoundPlus } from "lucide-react";

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
    <>
      <div className=" min-h-screen  bg-gray-100 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <SearchUser id={session.user.id} />

        {/* Floating Circular Button */}

        <button
          onClick={() => router.push("/admin/dashboard/visitedform")}
          className="
    fixed bottom-25 right-6 z-50
    flex h-14 w-14 items-center justify-center
    rounded-full text-white

bg-gray-600    shadow-[0_8px_12px_rgba(0,0,0,0.25)]
    transition-transform duration-300 ease-in-out
    hover:scale-110
    active:scale-95
  "
          aria-label="Create User"
        >
          <UserRoundPlus
            size={26}
            strokeWidth={2.2}
            className="filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]"
          />
        </button>
      </div>
    </>
  );
};

export default UserDashboardPage;
