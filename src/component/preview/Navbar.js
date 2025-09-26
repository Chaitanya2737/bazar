"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BadgePercent, Home, Mail, Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "@/redux/slice/theme/themeSlice";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode ?? false);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setTheme(newTheme);
    dispatch(setDarkMode(newTheme === "dark"));
  };
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY <= window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <TooltipProvider>
      <motion.nav
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 shadow-lg px-4 py-2 rounded-full flex justify-center items-center gap-12 w-[90%] max-w-sm z-50"
      >
        {/* Home */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 [&>svg]:!h-6 [&>svg]:!w-6 rounded-full"
              >
                <Home />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/offers">
              <Button
                variant={pathname === "/offers" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 [&>svg]:!h-6 [&>svg]:!w-6 rounded-full relative overflow-hidden"
              >
                <Image
                  src="/offerImage.png"
                  alt="Offer"
                  width={55}
                  height={55}
                  className="absolute inset-0 m-auto animate-wiggle"
                />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Offer</p>
          </TooltipContent>
        </Tooltip>

       <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/map" className="relative inline-block w-10 h-10">
            <Image
              src="/world_image.png"
              alt="Offer"
              width={40}
              height={40}
              className="absolute inset-0 m-auto animate-spin-slow"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Client</p>
        </TooltipContent>
      </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 [&>svg]:!h-6 [&>svg]:!w-6 rounded-full"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Toggle Theme</p>
          </TooltipContent>
        </Tooltip>
      </motion.nav>
    </TooltipProvider>
  );
}
