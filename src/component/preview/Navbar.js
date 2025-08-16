"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BadgePercent, Home, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function Navbar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

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
                {/* Animated background layer */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Glow Pulse */}
                  <motion.div
                    animate={{
                      scale: [1.5, 1.08, 0.5],
                      boxShadow: [
                        "0 0 4px #f59e0b",
                        "0 0 12px #f59e0b",
                        "0 0 4px #f59e0b",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                    }}
                    className="absolute h-8 w-8 rounded-full"
                  />

                  {/* Shiny Sweep */}
                  {/* <motion.div
            className="absolute h-8 w-8 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear"
            }}
          /> */}
                </div>

                {/* Icon above animation */}
                <BadgePercent className="relative z-10" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Offer</p>
          </TooltipContent>
        </Tooltip>

        {/* Contact */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/contact">
              <Button
                variant={pathname === "/contact" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 [&>svg]:!h-6 [&>svg]:!w-6 rounded-full"
              >
                <Mail />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Contact</p>
          </TooltipContent>
        </Tooltip>
      </motion.nav>
    </TooltipProvider>
  );
}
