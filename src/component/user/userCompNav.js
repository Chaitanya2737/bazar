"use client";
import React from "react";
import { useSelector } from "react-redux";

const UserCompNav = () => {
  // Optional if not used
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <nav className="shadow-md rounded-lg p-2 text-black bg-white dark:bg-gray-800 dark:text-white">
      <ul className="flex items-center justify-around py-2 w-full md:w-[70%] mx-auto border rounded-3xl">
        <li>A</li>
        <li>B</li>
        <li>C</li>
        <li>D</li>
      </ul>
    </nav>
  );
};

export default UserCompNav;
