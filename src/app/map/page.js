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
  }
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
  const fetchData = useCallback(async (signal) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/user/preview/mappreview",
        { page },
        { signal }
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
  }, [page, isLoading, hasMore]);

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
            field.toLowerCase().includes(searchText.toLowerCase())
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
          .map((c) => [c.categories._id, c.categories])
      ).values(),
    ];
  }, [client]);

  const resetFilters = () => {
    setSearchText("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] h-screen">
        {/* Sidebar */}
        <div className="bg-white p-4 shadow-lg overflow-y-auto">
          <h1 className="text-xl font-bold mb-4">Business Finder</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => debouncedSetSearchText(e.target.value)}
            className="w-full p-2 rounded border mb-3"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-between mb-3">
                {selectedCategory
                  ? categoryOptions.find(
                      (c) => c._id === selectedCategory
                    )?.name
                  : "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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

          {(searchText || selectedCategory) && (
            <button
              onClick={resetFilters}
              className="w-full py-2 bg-blue-600 text-white rounded mb-3"
            >
              Clear Filters
            </button>
          )}

          {hasMore && !isLoading && (
            <button
              onClick={handleLoadMore}
              className="w-full py-2 bg-black text-white rounded"
            >
              Load More
            </button>
          )}
        </div>

        {/* Map */}
        <div className="h-full">
          <MapErrorBoundary>
            <MapWithMarkers
              clients={filteredClients}
              onSelectBusiness={setSelectedBusiness}
            />
          </MapErrorBoundary>
        </div>
      </div>
    </div>
  );
}
