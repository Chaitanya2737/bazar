"use client";
import { ChartBarDefault } from '@/component/user/UserPanel/analytic/Vistedcountchart';
import { useSession } from 'next-auth/react';
import React from 'react'
import { shallowEqual, useSelector } from 'react-redux';

const Analytics = () => {

     const { data: session, status } = useSession();

  const user = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);
  const darkMode = useSelector((state) => state.theme.darkMode);


  console.log(user, userdata, darkMode);

  return (
    <div className='h-screen'>
        <ChartBarDefault />
    </div>
  )
}

export default Analytics