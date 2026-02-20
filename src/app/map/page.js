"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import MapErrorBoundary from "./MapErrorBoundary";

// ✅ Dynamic import (Safe for Leaflet)
const MapWithMarkers = dynamic(
  () => import("@/component/map/AnimatedBusinessMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-gray-600">
        Loading map…
      </div>
    ),
  },
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

  // ✅ SAFE FETCH WITH SIGNAL
  const fetchData = useCallback(
    async (signal) => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "/api/user/preview/mappreview",
          { page },
          { signal },
        );

        const newUsers = response.data?.users || [];

        if (newUsers.length === 0) {
          setHasMore(false);
        } else {
          setClient((prev) => {
            const ids = new Set(prev.map((u) => u._id));
            const merged = [
              ...prev,
              ...newUsers.filter((u) => !ids.has(u._id)),
            ];

            // ✅ LIMIT MEMORY (max 500)
            if (merged.length > 500) {
              return merged.slice(-500);
            }

            return merged;
          });

          setPage((prev) => prev + 1);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Failed to load businesses. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [page, isLoading, hasMore],
  );

  // ✅ Initial Load
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  // ✅ FIXED Load More
  const handleLoadMore = () => {
    const controller = new AbortController();
    fetchData(controller.signal);
  };

  // ✅ Debounce
  const debouncedSetSearchText = useMemo(() => {
    return debounce((value) => {
      setSearchText(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => debouncedSetSearchText.cancel();
  }, [debouncedSetSearchText]);

  // ✅ Filtering
  const filteredClients = useMemo(() => {
    return client.filter((c) => {
      const matchesText =
        !searchText ||
        [c.businessName, c.handlerName, c.bio]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(searchText.toLowerCase()),
          );

      const matchesCategory =
        !selectedCategory || c.categories?._id === selectedCategory;

      return matchesText && matchesCategory;
    });
  }, [client, searchText, selectedCategory]);

  const categoryOptions = useMemo(() => {
    return [
      ...new Map(
        client
          .filter((c) => c.categories)
          .map((c) => [c.categories._id, c.categories]),
      ).values(),
    ];
  }, [client]);

  const resetFilters = () => {
    setSearchText("");
    setSelectedCategory("");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 🌍 FULLSCREEN MAP */}
      <div className="absolute inset-0">
        <MapErrorBoundary>
          <MapWithMarkers
            clients={filteredClients}
            onSelectBusiness={setSelectedBusiness}
          />
        </MapErrorBoundary>
      </div>

      {/* 💎 FLOATING GLASS PANEL */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full  z-[1000]">
        <div
          className="
        backdrop-blur-xl 
        bg-white/70 
        shadow-2xl 
        rounded-2xl 
        border border-white/40
        p-6
      "
        >
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            🔍 Find Businesses
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder="Search business, owner, description..."
            onChange={(e) => debouncedSetSearchText(e.target.value)}
            className="
            w-full 
            p-3 
            rounded-xl 
            border 
            border-gray-300 
            focus:ring-2 
            focus:ring-black 
            outline-none 
            transition
            mb-4
          "
          />

          {/* Category */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-between rounded-xl h-11 bg-black text-white">
                {selectedCategory
                  ? categoryOptions.find((c) => c._id === selectedCategory)
                      ?.name
                  : "All Categories"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="z-[9999] bg-white" sideOffset={8}>
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

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            {(searchText || selectedCategory) && (
              <button
                onClick={resetFilters}
                className="
                flex-1 
                py-2 
                bg-gray-200 
                rounded-xl 
                hover:bg-gray-300 
                transition
              "
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
