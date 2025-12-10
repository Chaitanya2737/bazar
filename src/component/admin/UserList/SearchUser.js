import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

// Skeleton component for a user card
const UserCardSkeleton = () => (
  <div className="flex items-center border border-gray-200 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm mx-2">
    <Skeleton className="w-24 h-24 rounded-xl" />
    <div className="border-l border-gray-300 mx-4"></div>
    <div className="flex flex-col space-y-2 w-full">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

const SearchUser = ({ id }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination (server)
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const router = useRouter();

  const fetchUser = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/admin/finduser", {
        id,
        page,
        limit,
      });

      setUsers(response.data.users || []);
      setTotalUsers(response.data.totalUsers || 0);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Search filter (local)
  const filteredUsers = users.filter(
    (user) =>
      user.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalUsers / limit);

  const handleNewUser = () => {
    setRouteLoading(true);
    router.push(`/adduser/${id}`);
    
  };

  return (
    <div className="p-4 w-full">
      {routeLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="animate-spin h-12 w-12 border-4 border-white/50 border-t-white rounded-full"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2 md:mb-0">
          Users List
        </h1>

        {!loading && !error && (
          <span className="text-gray-500 text-sm">
            {totalUsers} user{totalUsers !== 1 && "s"} found
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="flex items-center mb-6 space-x-2 ">
        <Input
          type="text"
          placeholder="Search by name or email..."
          className="p-2 rounded w-full  bg-gray-100 dark:bg-gray-900 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading || routeLoading}
        />

        <Button disabled={loading || routeLoading} onClick={handleNewUser} className={ "dark:bg-gray-100 bg-gray-900 dark:text-black text-white" }>
          {routeLoading ? "Loading..." : "New User"}
        </Button>
      </div>

      {/* Skeleton Loader */}
      {loading && !routeLoading && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !routeLoading && (
        <div className="text-red-600 text-center font-medium py-4">
          {error}
          <div>
            <Button
              className="mt-2"
              onClick={() => fetchUser(currentPage)}
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Actual User List */}
      {!loading && !error && !routeLoading && (
        <>
          <UserList users={filteredUsers} />

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => fetchUser(currentPage - 1)}
            >
              Prev
            </Button>

            <span className="px-3 py-1 bg-gray-100 rounded">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => fetchUser(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchUser;
