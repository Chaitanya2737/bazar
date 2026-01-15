"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Phone } from "lucide-react";

const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius (KM)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LIMIT = 20;

const Page = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setPage(1);
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (!location.lat || !location.lng) return;

    const fetchNearbyUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.post("/api/admin/filteruserbyitslocation", {
          lat: location.lat,
          lng: location.lng,
          page,
          limit: LIMIT,
        });
        setClients(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch nearby users", error);
        // toast.error("Failed to load clients."); // Uncomment if using toasts
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUsers();
  }, [location.lat, location.lng, page]);

  const sortedClients = useMemo(() => {
    if (!location.lat || !location.lng) return clients;
    return [...clients]
      .map((client) => ({
        ...client,
        distance: client.location?.coordinates
          ? getDistanceInKm(
              location.lat,
              location.lng,
              client.location.coordinates[1],
              client.location.coordinates[0]
            )
          : Infinity,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [clients, location.lat, location.lng]);

  const handleNavigateToMap = (lat, lng) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePageChange = (newPage) => {
    if (loading || newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const SkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="p-4 overflow-x-auto min-h-screen dark:text-white dark:bg-gray-700">
      {locationError && (
        <div className="text-red-500 text-center mb-4">
          {locationError}.{" "}
          <button
            onClick={() => window.location.reload()}
            className="underline"
          >
            Retry
          </button>
        </div>
      )}

      <Table>
        <TableCaption>
          Nearby clients within 150 km {loading && "(loading...)"}
        </TableCaption>

        <TableHeader
          className="
            sticky top-0 z-10
            bg-[oklch(0.29_0_0_/0.85)]
            backdrop-blur-md
            [&>tr:first-child>th:first-child]:rounded-tl-xl
            [&>tr:first-child>th:last-child]:rounded-tr-xl
          "
        >
          <TableRow>
            <TableHead scope="col" className="text-white text-md">Business name</TableHead>
            <TableHead scope="col" className="text-white">Interest</TableHead>
            <TableHead scope="col" className="text-white">Admin</TableHead>
            <TableHead scope="col" className="text-white">Distance</TableHead>
            <TableHead scope="col" className="text-white">Call</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : sortedClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No nearby clients found
              </TableCell>
            </TableRow>
          ) : (
            sortedClients.map((client, index) => (
              <TableRow
                key={client._id ?? index}
                className={`
                  ${index % 2 === 0 ? "bg-muted/40 dark:bg-muted/20" : ""}
                  hover:bg-accent/50 transition-colors h-20 md:h-14
                `}
              >
                <TableCell
                  onClick={() =>
                    handleNavigateToMap(
                      client.location.coordinates[1],
                      client.location.coordinates[0]
                    )
                  }
                  className="font-medium cursor-pointer"
                >
                  {client.name}
                </TableCell>
                <TableCell>{client.ranking}%</TableCell>
                <TableCell>{client.adminName}</TableCell>
                <TableCell
                  className={`text-sm ${
                    client.distance < 50
                      ? "text-orange-600 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {client.distance !== Infinity
                    ? `${client.distance.toFixed(1)} km away`
                    : "Nearby"}
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${client.phone}`}
                    className="
                      inline-flex items-center justify-center
                      h-9 w-9 rounded-full
                      bg-orange-500/10 text-orange-600/50
                      hover:bg-orange-500 hover:text-white
                      transition-all
                    "
                    aria-label={`Call ${client.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1 || loading}
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || loading}
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;