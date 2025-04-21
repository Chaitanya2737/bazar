"use client";

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import ThemeToggle from "@/component/themeToggle/themeToggle";
import { setDarkMode } from "@/redux/slice/theme/themeSlice";
import Navbar from "@/component/navBar/page";

export default function Home() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  console.log(darkMode); // Access theme state from Redux
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    dispatch(setDarkMode(!darkMode));
  };

  if (!mounted) return null;

  return (
    <div
      className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4 ${
        darkMode ? "dark" : ""
      }`}
    >

      <Navbar />
    </div>
  );
}
