"use client";

import { setDarkMode } from "@/redux/slice/theme/themeSlice";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode ?? false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && theme) {
      dispatch(setDarkMode(theme === "dark"));
    }
  }, [theme, isMounted, dispatch]);

  if (!isMounted) return null;

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setTheme(newTheme);
    dispatch(setDarkMode(newTheme === "dark"));
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 transition-all">
      <Sun
        className={`w-5 h-5 text-yellow-400 transition-opacity ${
          darkMode ? "opacity-40" : "opacity-100"
        }`}
      />
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${
          darkMode ? "bg-gray-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
            darkMode ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      <Moon
        className={`w-5 h-5 text-white transition-opacity ${
          darkMode ? "opacity-100" : "opacity-40"
        }`}
      />
    </div>
  );
};

export default ThemeToggle;
