"use client"; // Mark this component as client-side rendered

import { signOut } from 'next-auth/react'
import React from 'react'

const Page = () => {
  const logout = () => {
    signOut({
      redirect: true, // This will redirect the user after logging out
      callbackUrl: '/', // Redirect URL after logout
    });
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Page
