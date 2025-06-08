'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect , useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/user/dashboard');
    }
  }, [status, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setIsLoggingIn(false);

    if (res?.ok) {
      // Redirect immediately upon successful login
      router.push('/user/dashboard');
    } else {
      setError(res?.error || 'Invalid credentials. Please try again.');
    }
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
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
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Logging in...' : 'Sign In'}
      </button>
    </form>
  );
}
