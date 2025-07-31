"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react"; // Add this at the top with your other imports

import { userLogout } from "@/redux/slice/user/userSlice";
import ThemeToggle from "@/component/themeToggle/themeToggle";
import { Button } from "@/components/ui/button";

const UserNav = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = useSelector((state) => state?.userAuth?.user);

  const isAuthenticated = useSession();

  const handleNavigation = (path) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const handleLogout = useCallback(() => {
    dispatch(userLogout());
    signOut({ redirect: true, callbackUrl: "/" });
  }, [dispatch]);

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      {/* Brand Section */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        <Image
          src="/favicon.png"
          alt="Bazar.sh Logo"
          width={40}
          height={40}
          className="rounded-md"
        />
        <span
          className="text-2xl font-semibold text-gray-700 dark:text-white hidden md:flex"
          style={{
            fontFamily: '"Caveat Brush", cursive',
          }}
        >
          Bazar<span className="text-blue-600 ">Hub</span>
        </span>
      </div>

        <ThemeToggle />
      {/* Right Section */}
      <div className="flex items-center gap-4">

        {isAuthenticated && (
          <Button
            onClick={handleLogout}
            className="relative flex items-center  rounded-full text-white shadow-lg transition-all duration-300 ease-in-out group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-[-15deg] transition-transform duration-300" />
            <span className="tracking-wide">Logout</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserNav;
