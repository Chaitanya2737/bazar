'use client';

import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout, userLogin } from '@/redux/slice/user/userSlice';
import { useRouter } from 'next/navigation';

const UserDashboardPage = () => {
  const user = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: session, status } = useSession();
  const [isRoleValid, setIsRoleValid] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const { id, email, role, isAuthenticated } = session.user;

      if (!user?.id) {
        dispatch(userLogin({ id, email, role, isAuthenticated }));
      }

      if (role === 'admin') {
        setIsRoleValid(true);
      }
    }
  }, [session, dispatch, user?.id]);

  // useEffect(() => {
  //   if (session && !isRoleValid) {
  //     router.push('/');
  //   }
  // }, [session, isRoleValid, router]);

  const logout = () => {
    dispatch(userLogout());
    signOut({ redirect: true, callbackUrl: '/' });
  };

  if (status === 'loading') {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center mt-10">You are not authenticated.</div>;
  }

  if (!isRoleValid) {
    return <div className="text-center mt-10">You do not have the correct role to access this page.</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <h2 className="text-xl font-semibold">Welcome, {user.email}!</h2>
      <p className="text-gray-500">Role: {user.role || 'User'}</p>
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboardPage;
