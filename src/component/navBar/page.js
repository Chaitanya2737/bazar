"use client";

import React from "react";
import ThemeToggle from "../themeToggle/themeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Settings, User, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        MyLogo
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Login As</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-sm text-gray-700">
          <DropdownMenuLabel className="py-2 px-4 font-semibold">Login As</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onSelect={() => handleNavigation("/sign-in")}
            >
              <User size={16} />
              <span>User</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onSelect={() => handleNavigation("/admin/signup")}
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
    </div>
  );
};

export default Navbar;
