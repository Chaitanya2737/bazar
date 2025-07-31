"use client";
import { ChartLine, House, PencilRuler } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

const UserCompNav = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();

  const userAuth = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);

  const isRoleValid = useMemo(() => session?.user?.role === "user", [session]);

  const id = useMemo(() => {
    return userAuth?.id || userdata?.userData?._id;
  }, [userAuth, userdata]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={`transition-all duration-500 shadow-md ${
        mounted ? "animate-fadeInUp" : ""
      }`}
    >
      <ul className="flex items-center justify-around py-2 md:w-[70%] mx-auto border rounded-3xl text-black bg-white dark:bg-gray-800 dark:text-white">
        {/* Home */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link href={`/user/dashboard`} className="flex items-center">
            <House />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Home
          </span>
        </li>

        {/* Edit */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link
            href={id ? `/user/dashboard/edit/${id}` : "#"}
            className="flex items-center"
          >
            <PencilRuler />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Edit Profile
          </span>
        </li>

        {/* C */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link
            href={id ? `/user/dashboard/analytics` : "#"}
            className="flex items-center"
          >
           <ChartLine />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Analytics
          </span>
        </li>

        {/* D */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <span className="flex items-center">D</span>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Feature D
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default UserCompNav;
