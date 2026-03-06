"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Navbar from "@/component/preview/Navbar";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

  // ✅ Inject Premium Network + Glow Styles
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

        /* Main layer */
        .bg-network::before {
          animation: floatGrid 40s ease-in-out infinite alternate;
        }

        /* Depth blur layer */
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

        /* 🔵 Glow Animation */
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
      router.push("/user/dashboard");
    }
  }, [status, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setIsLoggingIn(false);

    if (res?.ok) {
      router.push("/user/dashboard");
    } else {
      setError(res?.error || "Invalid credentials. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Checking session...
      </div>
    );
  }

  return (

    <>


    <Navbar />  
     <div className="relative p-3 min-h-screen flex items-center justify-center overflow-hidden bg-network">
      {/* 🔵 Soft Blue Glow */}
      <div className="absolute w-[450px] h-[450px] bg-blue-500/70  rounded-full blur-[140px] animate-glow z-0"></div>

      {/* 🔄 Loader Overlay */}
      {isLoggingIn && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="animate-spin text-white w-10 h-10 mb-3" />
          <p className="text-white text-lg font-medium">
            Signing you in...
          </p>
        </div>
      )}

      {/* 🔐 Glass Login Card */}
      <div className="relative z-10 w-full max-w-md 
        bg-white/80 dark:bg-white/80
        backdrop-blur-xl 
        border border-white/40 dark:border-gray-700
        p-8 rounded-2xl shadow-2xl">

        <h2 className="text-3xl font-bold mb-2 text-gray-900 ">
          Welcome Back 👋
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-500 mb-6">
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white  rounded-lg focus:outline-none focus:ring-3 focus:ring-orange-500/40"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-orange-600/80 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
    </>
   
  );
}