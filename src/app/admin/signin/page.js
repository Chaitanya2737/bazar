"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/component/preview/Navbar";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = `
        .bg-network {
          position: relative;
          background-color: #f9fbff;
          overflow: hidden;
        }

        .bg-network::before,
        .bg-network::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle, rgba(59,130,246,0.15) 1.2px, transparent 1.2px),
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .bg-network::before {
          animation: floatGrid 40s ease-in-out infinite alternate;
        }

        .bg-network::after {
          filter: blur(8px);
          opacity: 0.4;
          background-size: 80px 80px;
          animation: floatGridSlow 60s ease-in-out infinite alternate;
        }

        @keyframes floatGrid {
          0% { transform: translate(0px, 0px); }
          100% { transform: translate(-40px, -40px); }
        }

        @keyframes floatGridSlow {
          0% { transform: translate(0px, 0px); }
          100% { transform: translate(60px, 40px); }
        }

        @keyframes glowMove {
          0% { transform: translate(-20px, -20px) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.05); }
          100% { transform: translate(-10px, 10px) scale(1); }
        }

        .animate-glow {
          animation: glowMove 14s ease-in-out infinite;
        }
      `;

      const sheet = document.createElement("style");
      sheet.innerHTML = style;
      document.head.appendChild(sheet);

      return () => {
        document.head.removeChild(sheet);
      };
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/dashboard");
    }
  }, [status, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoggingIn(true);
  setError("");

  const res = await signIn("credentials", {
    redirect: false,
    email: form.email,
    password: form.password,
  });

  if (res?.ok) {
    toast.success("Login Successful 🎉", {
      description: "Redirected to dashboard...",
    });

    router.push("/user/dashboard");
  } else {
    const errorMessage =
      res?.error || "Invalid credentials. Please try again.";

    setError(errorMessage);
    setIsLoggingIn(false);

    toast.error("Login Failed", {
      description: errorMessage,
    });
  }
};

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-network">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (

    <>

    <Navbar />
     <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-network">
      {/* 🔵 Soft Blue Glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-700/50 rounded-full blur-[140px] animate-glow z-0"></div>

      {/* Loader Overlay */}
      {isLoggingIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-white w-10 h-10 mb-3" />
            <p className="text-white text-lg font-medium">Signing in...</p>
          </div>
        </div>
      )}

      {/* 🔐 Glass Login Card */}
      <div
        className="relative z-10 w-full max-w-md 
        bg-white/80 dark:bg-gray-900/80 
        backdrop-blur-xl 
        border border-white/40 dark:border-gray-700
        p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Please sign in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-neutral-800/70 hover:bg-neutral-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
    </>
   
  );
}
