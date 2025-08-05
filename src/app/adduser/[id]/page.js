"use client"
import AddUserComponent from '@/component/user/AddUserComponent'
import { setDarkMode } from '@/redux/slice/theme/themeSlice';
import { useParams } from 'next/navigation';
import React, { useEffect, useState  } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AddUser = () => {

  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  console.log(darkMode); // Access theme state from Redux
  const [mounted, setMounted] = useState(false);

  const {id} = useParams()
  console.log(id);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className={`bg-light text-foregroundLight dark:bg-gray-800 dark:text-foregroundDark min-h-screen p-4`}>
    <AddUserComponent />
    </div>
  )
}

export default AddUser