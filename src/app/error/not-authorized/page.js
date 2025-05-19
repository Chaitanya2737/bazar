"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 text-center transition-colors duration-300 ease-in-out">
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 transition-colors duration-300 ease-in-out">
        Oops!
      </h1>
      <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-gray-200 transition-colors duration-300 ease-in-out">
        404 - PAGE NOT FOUND
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md transition-colors duration-300 ease-in-out">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex gap-3 items-center mt-6">

      <Button
        onClick={() => router.push("/")}
      >
        GO TO HOMEPAGE
      </Button>

      <Button
        onClick={() => router.push("/")}
      >
        or try to join our community
      </Button>
      </div>
    </div>
  );
};

export default NotFound;
