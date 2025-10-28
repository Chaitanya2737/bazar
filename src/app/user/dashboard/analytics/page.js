"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import { ChartBarDefault } from "@/component/user/UserPanel/analytic/Vistedcountchart";
import { userLogin } from "@/redux/slice/user/userSlice";
import axios from "axios";

const Analytics = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [data, setData] = useState({});
  const [interval, setInterval] = useState("7d"); // '7d' or '30d'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user session
  useEffect(() => {
    if (session?.user && !user?.id) {
      const { id, email, role, isAuthenticated } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated }));
    }
  }, [session, dispatch, user?.id]);

  // Fetch user data
  useEffect(() => {
    if (user?.id && !userdata?.data) {
      dispatch(getUserDataApi(user.id)).catch((err) =>
        console.error("User Data Fetch Error:", err)
      );
    }
  }, [dispatch, user?.id, userdata?.data]);

  const pathname = userdata.userData?.slug;

  // Fetch analytics from API
  useEffect(() => {
    if (!pathname) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.post("/api/user/analytics/user-analytics-data", {
          pathname,
          interval,
        });
        setData(res.data);
        console.log("Fetched Analytics Data:", res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname, interval]);

  return (
    <div
      className={`h-screen p-4 transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          User Analytics Overview
        </h2>

        {/* Interval Switch */}
        <div className="flex gap-2">
          <button
            onClick={() => setInterval("7d")}
            className={`px-4 py-1 rounded-lg border ${
              interval === "7d"
                ? "bg-blue-500 text-white"
                : "bg-transparent border-gray-400 text-gray-700"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setInterval("30d")}
            className={`px-4 py-1 rounded-lg border ${
              interval === "30d"
                ? "bg-blue-500 text-white"
                : "bg-transparent border-gray-400 text-gray-700"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {data?.views && (
            <h3 className="text-lg font-medium mb-2">
              Total Views ({interval === "7d" ? "Last 7 Days" : "Last 30 Days"}
              ): <span className="font-semibold">{data.views}</span>
            </h3>
          )}
          <ChartBarDefault data={data.daily} />
        </>
      )}
    </div>
  );
};

export default Analytics;
