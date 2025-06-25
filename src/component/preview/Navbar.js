"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import ThemeToggle from "../themeToggle/themeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY >= window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger once on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <TooltipProvider>
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 shadow-lg px-4 py-2 rounded-full flex justify-between items-center gap-4 w-[90%] max-w-sm z-50">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button
                  variant={pathname === "/" ? "default" : "ghost"}
                  size="icon"
                  aria-label="Home"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/contact">
                <Button
                  variant={pathname === "/contact" ? "default" : "ghost"}
                  size="icon"
                  aria-label="Contact"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Contact</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </TooltipProvider>
  );
}
