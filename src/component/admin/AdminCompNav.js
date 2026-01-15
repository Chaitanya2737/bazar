"use client";
import { ChartLine, House, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

const AdminCompNav = () => {
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const userAuth = useSelector((state) => state.userAuth, shallowEqual);

  const id = useMemo(() => userAuth?.id || session?.id, [userAuth, session]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // <-- render nothing on server to prevent mismatch

  return (
    <nav className="transition-all duration-500 shadow-md pb-6 animate-fadeInUp">
      <ul className="flex items-center justify-around py-2 md:w-[70%] mx-auto border rounded-3xl text-black bg-white dark:bg-gray-800 dark:text-white">
        {/* Home */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link href={`/admin/dashboard`} className="flex items-center">
            <House />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Home
          </span>
        </li>

        {/* Existing User */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link href={`/admin/dashboard/user`} className="flex items-center">
            <User />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Existing User
          </span>
        </li>

        {/* Analytics */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link
            href={id ? `/admin/dashboard/analytics/${id}` : "#"}
            className="flex items-center"
          >
            <ChartLine />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            AI
          </span>
        </li>

        {/* Settings */}
        <li className="relative group cursor-pointer py-2 rounded-md">
          <Link
            href={id ? `/admin/dashboard/setting/${id}` : "#"}
            className="flex items-center"
          >
            <Settings />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            Setting
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default AdminCompNav;
