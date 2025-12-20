"use client";
import React, { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";
import { debounce } from "lodash";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const MapWithMarkers = dynamic(
  () => import("@/component/map/AnimatedBusinessMap"),
  { ssr: false }
);

export default function Home() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [client, setClient] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/user/preview/mappreview", { page });

      const newUsers = response.data.users || [];

      if (newUsers.length === 0) {
        setHasMore(false); // no more data
      } else {
        setClient((prev) => {
          const ids = new Set(prev.map((u) => u._id));
          return [...prev, ...newUsers.filter((u) => !ids.has(u._id))];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      setError("Failed to load businesses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const debouncedSetSearchText = useMemo(
    () => debounce((value) => setSearchText(value), 300),
    []
  );

  useEffect(() => {
    return () => debouncedSetSearchText.cancel();
  }, [debouncedSetSearchText]);

  const filteredClients = useMemo(() => {
    return client.filter((c) => {
      const matchesText =
        !searchText ||
        [c.businessName, c.handlerName, c.bio]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(searchText.toLowerCase())
          );

      const matchesCategory =
        !selectedCategory || c.categories?._id === selectedCategory;

      return matchesText && matchesCategory;
    });
  }, [client, searchText, selectedCategory]);

  const categoryOptions = [
    ...new Map(
      client
        .filter((c) => c.categories)
        .map((c) => [c.categories._id, c.categories])
    ).values(),
  ];

  const resetFilters = () => {
    setSearchText("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Maharashtra Businesses Map</title>
        <meta
          name="description"
          content="Explore businesses in Maharashtra on an interactive map"
        />
      </Head>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] h-screen">
        {/* Sidebar */}
        <div className="bg-white p-4 lg:p-6 shadow-lg overflow-y-auto max-h-[60vh] lg:max-h-full lg:static fixed bottom-0 w-full rounded-t-2xl z-20">
          <h1 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800 text-center lg:text-left">
            Business Finder
          </h1>

          {isLoading && (
            <div className="flex items-center justify-center mb-4 text-blue-600">
              Loading...
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="🔍 Search by name, bio, or service..."
              onChange={(e) => debouncedSetSearchText(e.target.value)}
              className="w-full p-2 lg:p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full justify-between rounded-lg border border-gray-300 p-2 text-sm lg:text-base">
                  {selectedCategory
                    ? categoryOptions.find((c) => c._id === selectedCategory)
                        ?.name
                    : "📂 All Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => setSelectedCategory("")}>
                  All Categories
                </DropdownMenuItem>
                {categoryOptions.map((cat) => (
                  <DropdownMenuItem
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {(searchText || selectedCategory) && (
            <button
              onClick={resetFilters}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base mb-3"
            >
              Clear Filters
            </button>
          )}

          {/* Load Next Page */}
          {hasMore && !isLoading && (
            <button
              onClick={fetchData}
              className="w-full py-2 mt-3 bg-black text-white rounded-lg text-sm lg:text-base"
            >
              Load next 50 businesses
            </button>
          )}
        </div>

        {/* Map */}
        <div className="h-full z-10">
          <MapWithMarkers
            onSelectBusiness={setSelectedBusiness}
            clients={filteredClients}
          />
        </div>
      </div>
    </div>
  );
}
