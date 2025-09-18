"use client";
import React, { useState } from "react";
import ThemeToggle from "../themeToggle/themeToggle";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Settings, User, UserCog, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = (path) => {
    router.push(path);
    setDrawerOpen(false); // close drawer on navigation
  };

  const selector = useSelector((state) => state?.userAuth?.user);
  const isAuthenticated = selector?.isAuthenticated;

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white text-black dark:bg-gray-800 dark:text-white">
      <div
        className="text-xl font-bold cursor-pointer "
        onClick={() => handleNavigation("/")}
      >
        <Image
          src="/favicon.png"
          alt="Bazar.sh Logo"
          width={75}
          height={120}
          className="p-0 m-0"
        />

        <span
          className="text-xl cursor-pointer text-zinc-400"
          style={{
            fontFamily: '"Caveat Brush", cursive',
            fontOpticalSizing: "auto",
            fontWeight: 700,
            fontStyle: "normal",
            fontVariationSettings: '"slnt" 0',
          }}
        >
          Bazar
          <span className="text-blue-500">Hub</span>
        </span>
      </div>

      <ThemeToggle />

      {/* Mobile Drawer Trigger */}
      <div className="  bg-white text-black dark:bg-gray-800 dark:text-white md:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="secondary">
              <Menu size={20} />
            </Button>
          </DrawerTrigger>
          <DrawerContent
            className="bg-white text-black dark:bg-gray-900 dark:text-white w-screen h-screen p-6 shadow-lg"
            side="left"
          >
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-2">
                Menu
              </DrawerTitle>
            </DrawerHeader>

            <ul className="flex flex-col gap-6 mt-6 text-lg">
              {!isAuthenticated ? (
                <>
                  <li>
                    <button
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => handleNavigation("/sign-in")}
                    >
                      <User className="inline text-gray-700 dark:text-gray-300" />
                      User Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => handleNavigation("/admin/signin")}
                    >
                      <UserCog className="inline text-gray-700 dark:text-gray-300" />
                      Admin Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => handleNavigation("/system")}
                    >
                      <Settings className="inline text-gray-700 dark:text-gray-300" />
                      System
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => handleNavigation("/sign-in")}
                  >
                    Go to dashboard
                  </button>
                </li>
              )}
            </ul>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop dropdown menu */}
      <div className=" bg-white text-black dark:bg-gray-800 dark:text-white hidden md:flex items-center gap-4 ">
        {!isAuthenticated ? (
          <DropdownMenu className="bg-white text-black dark:bg-gray-800 dark:text-white">
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Login As</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black dark:bg-gray-800 dark:text-white w-56 mt-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ">
              <DropdownMenuLabel className="bg-white text-black dark:bg-gray-800 dark:text-white py-2 px-4 font-semibold">
                Login As
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="bg-white text-black dark:bg-gray-800 dark:text-white">
                <DropdownMenuItem
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onSelect={() => handleNavigation("/sign-in")}
                >
                  <User size={16} />
                  <span>User</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onSelect={() => handleNavigation("/admin/signin")}
                >
                  <UserCog size={16} />
                  <span>Administrator</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onSelect={() => handleNavigation("/system")}
                >
                  <Settings size={16} />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => handleNavigation("/sign-in")}>
            Go to dashboard
          </Button>
        )}
      </div>
    </div>
  );
};
export const SupportNavForLaptop = () => {
  return (
    <nav className="w-[80%] max-w-[700px] mx-auto fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-inner z-50 rounded-xl px-2">
      <ul className="flex flex-wrap justify-around gap-y-2 px-3 py-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
        <Link href="/about-us">
          <li className="hover:text-blue-500 cursor-pointer">About Us</li>
        </Link>
        <Link href="/offers">
          <li className="hover:text-blue-500 cursor-pointer">Offers</li>
        </Link>

        <Link href="/map">
          <li className="hover:text-blue-500 cursor-pointer">Client</li>
        </Link>
        <li className="hover:text-blue-500 cursor-pointer">Support</li>
      </ul>
    </nav>
  );
};

export default Navbar;
