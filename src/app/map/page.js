"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import Map component, no SSR
const MapWithMarkers = dynamic(
  () => import("@/component/map/AnimatedBusinessMap"),
  { ssr: false }
);

export default function Home() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [clients, setClient] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/user/preview/mappreview");
      const data = await response.data;
      console.log(data);
      setClient(data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Maharashtra Businesses Map</title>
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-[30%_70%]">
        <div className=" bg-gray-200 p-4 overflow-y-auto">
          {selectedBusiness ? (
            <div>
              <h2 className="text-xl font-bold">{selectedBusiness.name}</h2>
              <p className="text-sm">{selectedBusiness.description}</p>
            </div>
          ) : (
            <p className="text-gray-500">Click a marker to see details</p>
          )}
        </div>
        <div className="h-screen bg-blue-200">
          <MapWithMarkers
            onSelectBusiness={setSelectedBusiness}
            clients={clients}
          />
        </div>
      </div>
    </div>
  );
}
