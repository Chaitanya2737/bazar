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
      router.push("/user/dashboard");
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

    setIsLoggingIn(false);

    if (res?.ok) {
      router.push("/user/dashboard");
    } else {
      setError(res?.error || "Invalid credentials. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left - Form */}
      <div className="flex items-center justify-center px-6 text-black bg-white dark:bg-gray-800 dark:text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-black  dark:text-white mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-black  dark:text-white mb-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Password"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600  text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoggingIn ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden  md:block ">
        <div className="w-full h-screen relative ">
          <Image
            src="/pexels-anuragsinngh-2264075.jpg"
            alt="Login background"
            width={1200}
            height={500}
            loading="lazy"
            className="w-full h-full object-cover rounded-4xl p-3 "
          />
        </div>
      </div>
    </div>
  );
}
