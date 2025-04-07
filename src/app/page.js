"use client";

import FileUpload from "@/component/fiileUpload/FileUpload";
import ThemeToggle from "@/component/themeToggle/themeToggle";
import AddUserComponent from "@/component/user/AddUserComponent";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4">
      <ThemeToggle />
      <AddUserComponent />
    </div>
  );
}
