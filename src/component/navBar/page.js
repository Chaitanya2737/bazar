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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User, UserCog, Menu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const Navbar = () => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Prevent UI flicker while session loads
  if (status === "loading") return null;

  const handleNavigation = (path) => {
    if (!path) return;
    router.push(path);
    setDrawerOpen(false);
  };

  const handleRouting = () => {
    if (!session?.user?.role) {
      router.push("/");
      return;
    }

    if (session.user.role === "user") {
      router.push("/user/dashboard");
    } else if (session.user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }

    setDrawerOpen(false);
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white text-black dark:bg-gray-800 dark:text-white">
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer flex items-center gap-2"
        onClick={() => handleNavigation("/")}
      >
        <Image src="/favicon.png" alt="Bazar.sh Logo" width={75} height={120} />
      </div>

      <ThemeToggle />

      {/* ---------------- Mobile Drawer ---------------- */}
      <div className="md:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          {/* Trigger */}
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-md">
              <Menu size={22} />
            </Button>
          </DrawerTrigger>

          {/* Drawer Content */}
          <DrawerContent className="h-[100dvh] bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
            {/* Header */}

            {/* Menu */}
            <div className="space-y-5 my-4">
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl font-semibold">
                 { !isAuthenticated ? "Login As" : "manage dashboard"}
                </DialogTitle>
              </DialogHeader>

              {!isAuthenticated ? (
                <div className="grid gap-3">
                  {/* User */}
                  <button
                    onClick={() => handleNavigation("/sign-in")}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <User
                        size={22}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-semibold ">User</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Login as customer
                      </span>
                    </div>
                  </button>

                  {/* Admin */}
                  <button
                    onClick={() => handleNavigation("/admin/signin")}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <UserCog
                        size={22}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-semibold">Admin</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Login as admin & Manage content
                      </span>
                    </div>
                  </button>

                  {/* System */}
                  <button
                    onClick={() => handleNavigation("/system")}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <Settings
                        size={22}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-semibold">System</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Access system tools
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRouting}
                  className="flex items-center gap-3
  bg-white/70 dark:bg-gray-700/60
  backdrop-blur-md
  border border-gray-300 dark:border-gray-600
  hover:bg-gray-100 dark:hover:bg-gray-600
  text-gray-800 dark:text-white
  px-5 py-3 rounded-xl
  transition-all duration-200 w-full"
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <LayoutDashboard
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="font-semibold">Dashboard</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Manage dashboard & content
                    </span>
                  </div>
                </button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ---------------- Desktop Dropdown ---------------- */}
      <div className="hidden md:flex items-center gap-4">
        {!isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-white/60 dark:bg-gray-800/60
                     backdrop-blur-xl
                     border border-gray-200 dark:border-gray-700
                     hover:bg-white/80 dark:hover:bg-gray-700
                     text-gray-900 dark:text-white
                     px-6 py-2 rounded-xl
                     shadow-md hover:shadow-lg
                     transition-all duration-300 hover:scale-[1.03]"
              >
                Login As
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-72 mt-3
                   bg-white/80 dark:bg-gray-900/80
                   backdrop-blur-xl
                   border border-gray-200 dark:border-gray-700
                   rounded-2xl shadow-xl p-4"
            >
              <DropdownMenuLabel className="text-sm text-gray-500 dark:text-gray-400">
                Choose Account Type
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup className="space-y-3">
                {/* User */}
                <DropdownMenuItem
                  onClick={() => handleNavigation("/sign-in")}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <User
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold dark:text-white">User</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Login as customer
                    </span>
                  </div>
                </DropdownMenuItem>

                {/* Admin */}
                <DropdownMenuItem
                  onClick={() => handleNavigation("/admin/signin")}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <UserCog
                      size={18}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold dark:text-white">
                      Administrator
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Manage dashboard & content
                    </span>
                  </div>
                </DropdownMenuItem>

                {/* System */}
                <DropdownMenuItem
                  onClick={() => handleNavigation("/system")}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
                >
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <Settings
                      size={18}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold dark:text-white">
                      System
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Access system tools
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="bg-white/70 dark:bg-gray-700/60
               backdrop-blur-md
               border border-gray-300 dark:border-gray-600
               hover:bg-gray-100 dark:hover:bg-gray-600
               text-gray-800 dark:text-white
               px-5 py-2 rounded-xl
               transition-all duration-200"
            onClick={handleRouting}
          >
            Go to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
};

export const SupportNavForLaptop = () => (
  <nav
    className="
      w-[92%] max-w-[750px]
      mx-auto
      fixed bottom-6 left-1/2 -translate-x-1/2
      bg-white/80 dark:bg-gray-900/80
      backdrop-blur-lg
      border border-gray-200 dark:border-gray-700
      shadow-xl
      rounded-2xl
      z-50
    "
  >
    <ul className="flex justify-center gap-2 md:gap-10 items-center px-6 py-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
      <li>
        <Link
          href="/map"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          Client
        </Link>
      </li>

      <span className="mx-3 text-gray-400">|</span>

      <li>
        <Link
          href="/offers"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          Offers
        </Link>
      </li>

      <span className="mx-3 text-gray-400">|</span>

      <li>
        <Link
          href="/about-us"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          About
        </Link>
      </li>

      <span className="mx-3 text-gray-400">|</span>

      <li>
        <Link
          href="/support"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          Support
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
