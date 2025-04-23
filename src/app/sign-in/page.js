"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userLogin } from "@/redux/slice/user/userSlice";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/user/dashboard");
    } else {
      alert("Login failed");
    }
  };

  // ✅ Handle already authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(userLogin(session)); // Dispatch user login to Redux store
      router.push("/user/dashboard");
    }
  }, [status, session, dispatch, router]); // Add dependencies to avoid potential issues

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
