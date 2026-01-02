// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import dynamic from "next/dynamic";
// import axios from "axios";
// import { debounce } from "lodash";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import MapErrorBoundary from "./MapErrorBoundary";
// MapErrorBoundary
// // ✅ Dynamic import (NO SSR for Leaflet)
// const MapWithMarkers = dynamic(
//   () => import("@/component/map/AnimatedBusinessMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex items-center justify-center h-full text-gray-600">
//         Loading map…
//       </div>
//     ),
//   }
// );

// // // ✅ App Router metadata (REPLACES next/head)
// // export const metadata = {
// //   title: "Maharashtra Businesses Map",
// //   description: "Explore businesses in Maharashtra on an interactive map",
// // };

// export default function Home() {
//   const [selectedBusiness, setSelectedBusiness] = useState(null);
//   const [client, setClient] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   // ✅ SAFE, abortable fetch
//   const fetchData = async (signal) => {
//     if (isLoading || !hasMore) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         "/api/user/preview/mappreview",
//         { page },
//         { signal }
//       );

//       const newUsers = response.data?.users || [];

//       if (newUsers.length === 0) {
//         setHasMore(false);
//       } else {
//         setClient((prev) => {
//           const ids = new Set(prev.map((u) => u._id));
//           return [...prev, ...newUsers.filter((u) => !ids.has(u._id))];
//         });
//         setPage((prev) => prev + 1);
//       }
//     } catch (err) {
//       if (err.name !== "CanceledError") {
//         setError("Failed to load businesses. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ Initial load with AbortController
//   useEffect(() => {
//     const controller = new AbortController();
//     fetchData(controller.signal);
//     return () => controller.abort();
//   }, []);

//   // ✅ SAFE debounce (no memory leak)
//   const debouncedSetSearchText = useMemo(() => {
//     return debounce((value) => {
//       setSearchText(value);
//     }, 300);
//   }, []);

//   useEffect(() => {
//     return () => {
//       debouncedSetSearchText.cancel();
//     };
//   }, [debouncedSetSearchText]);

//   // ✅ Filtering
//   const filteredClients = useMemo(() => {
//     return client.filter((c) => {
//       const matchesText =
//         !searchText ||
//         [c.businessName, c.handlerName, c.bio]
//           .filter(Boolean)
//           .some((field) =>
//             field.toLowerCase().includes(searchText.toLowerCase())
//           );

//       const matchesCategory =
//         !selectedCategory || c.categories?._id === selectedCategory;

//       return matchesText && matchesCategory;
//     });
//   }, [client, searchText, selectedCategory]);

//   // ✅ Stabilize reference for Leaflet
//   const stableClients = useMemo(
//     () => filteredClients,
//     [filteredClients.length, searchText, selectedCategory]
//   );

//   // ✅ Unique category list
//   const categoryOptions = useMemo(
//     () =>
//       [
//         ...new Map(
//           client
//             .filter((c) => c.categories)
//             .map((c) => [c.categories._id, c.categories])
//         ).values(),
//       ],
//     [client]
//   );

//   const resetFilters = () => {
//     setSearchText("");
//     setSelectedCategory("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] h-screen">
//         {/* Sidebar */}
//         <div className="bg-white p-4 lg:p-6 shadow-lg overflow-y-auto max-h-[60vh] lg:max-h-full lg:static fixed bottom-0 w-full rounded-t-2xl z-20">
//           <h1 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800 text-center lg:text-left">
//             Business Finder
//           </h1>

//           {isLoading && (
//             <div className="flex items-center justify-center mb-4 text-blue-600">
//               Loading...
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Search */}
//           <div className="mb-3">
//             <input
//               type="text"
//               placeholder="🔍 Search by name, bio, or service..."
//               onChange={(e) => debouncedSetSearchText(e.target.value)}
//               className="w-full p-2 lg:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Category */}
//           <div className="mb-3">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button className="w-full justify-between">
//                   {selectedCategory
//                     ? categoryOptions.find((c) => c._id === selectedCategory)
//                         ?.name
//                     : "📂 All Categories"}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={() => setSelectedCategory("")}>
//                   All Categories
//                 </DropdownMenuItem>
//                 {categoryOptions.map((cat) => (
//                   <DropdownMenuItem
//                     key={cat._id}
//                     onClick={() => setSelectedCategory(cat._id)}
//                   >
//                     {cat.name}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {(searchText || selectedCategory) && (
//             <button
//               onClick={resetFilters}
//               className="w-full py-2 bg-blue-600 text-white rounded-lg mb-3"
//             >
//               Clear Filters
//             </button>
//           )}

//           {hasMore && !isLoading && (
//             <button
//               onClick={() => fetchData()}
//               className="w-full py-2 bg-black text-white rounded-lg"
//             >
//               Load next 50 businesses
//             </button>
//           )}
//         </div>

//         {/* Map */}
//         <div className="h-full z-10">
//           <MapErrorBoundary>
//             <MapWithMarkers
//               clients={stableClients}
//               onSelectBusiness={setSelectedBusiness}
//             />
//           </MapErrorBoundary>
//         </div>
//       </div>
//     </div>
//   );
// }


import UnderConstruction from '@/component/user/UnderContruction'
import React from 'react'

const page = () => {
  return (
    <div>
      <UnderConstruction />
    </div>
  )
}

export default page