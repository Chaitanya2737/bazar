"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import { ChartBarDefault } from "@/component/user/UserPanel/analytic/Vistedcountchart";
import { userLogin } from "@/redux/slice/user/userSlice";
import axios from "axios";
import { set } from "mongoose";
const Analytics = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user && !user?.id) {
      const { id, email, role, isAuthenticated } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated }));
    }
  }, [session, dispatch, user?.id]);
  useEffect(() => {
    if (user?.id && !userdata?.data) {
      dispatch(getUserDataApi(user.id)).catch((err) =>
        console.error("User Data Fetch Error:", err)
      );
    }
  }, [dispatch, user?.id, userdata?.data]);

  const pathname = userdata.userData?.slug;

  useEffect(() => {
    if (!pathname) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.post(
          "/api/user/analytics/user-analytics-data",
          { pathname }
        );
        setData(res.data); // store analytics data
        console.log("Fetched Analytics Data:", res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);
  return (
    <div
      className={`h-screen p-4 transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4">User Analytics Overview</h2>
      <ChartBarDefault data={data} />
    </div>
  );
};

export default Analytics;
