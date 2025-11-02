"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

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
      router.push("/user/dashboard");
    } else {
      setError(res?.error || "Invalid credentials. Please try again.");
      setIsLoggingIn(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen relative">
      {/* Loader Overlay */}
      {isLoggingIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-3 text-lg font-medium">Signing in...</p>
          </div>
        </div>
      )}

      {/* Left - Form */}
      <div className="flex items-center justify-center px-6 text-black bg-white dark:bg-gray-800 dark:text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-black dark:text-white mb-6">
            Please sign in to your account
          </p>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 max-w-sm mx-auto mt-10"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-2 border rounded"
              aria-label="Email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="p-2 border rounded"
              aria-label="Password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-60"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden md:block">
        <div className="w-full h-screen relative">
          <Image
            src="/pexels-anuragsinngh-2264075.jpg"
            alt="Login background"
            width={1200}
            height={500}
            loading="lazy"
            className="w-full h-full object-cover rounded-4xl p-3"
          />
        </div>
      </div>
    </div>
  );
}
