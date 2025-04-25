"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserCompNav = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  // State to track if the component is mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Trigger the animation when the component mounts
  }, []);

  return (
    <nav
      className={`shadow-md p-2 text-black bg-white dark:bg-gray-800 dark:text-white ${
        mounted ? "animate-fadeInUp" : ""
      }`}
    >
      <ul className="flex items-center justify-around py-2 md:w-[70%] mx-auto border rounded-3xl">
        <li className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600  py-2 rounded-md">A</li>
        <li className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600  py-2 rounded-md">B</li>
        <li className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600  py-2 rounded-md">C</li>
        <li className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600  py-2 rounded-md">D</li>
      </ul>
    </nav>
  );
};

export default UserCompNav;
