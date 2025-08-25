"use client"
import AddUserComponent from '@/component/user/AddUserComponent'
import { setDarkMode } from '@/redux/slice/theme/themeSlice';
import { userLogin } from '@/redux/slice/user/userSlice';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState  } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AddUser = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const admin = useSelector((state) => state.userAuth);

  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const [isRoleValid, setIsRoleValid] = useState(false);  

  const { id } = useParams();
  console.log("URL param id:", id);
  console.log("DarkMode:", darkMode);

  // ✅ hook stays at top, doesn't break hook order
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user && !admin?.id) {
      const { id, email, role } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated: true }));
    }

    setIsRoleValid(session?.user?.role === "admin");
  }, [session, dispatch, admin?.id]);

  if (!mounted) {
    return <div className="p-4">Loading...</div>;
  }

  if (status === "loading") {
    return <div className="p-4">Checking session...</div>;
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            You are not authenticated
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Please{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              sign in
            </button>{" "}
            to access the dashboard.
          </p>
        </div>
      </div>
    );
  }
  if (!isRoleValid) {
    return <div className="text-red-500 p-4">Access denied. Admins only.</div>;
  }

  return (
    <div className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4`}>
      <AddUserComponent />
    </div>
  )
}

export default AddUser;
