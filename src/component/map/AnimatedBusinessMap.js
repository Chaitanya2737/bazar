"use client";
import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// --- Fix for default markers (Leaflet icons) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Extract coordinates from Google Maps short URL ---
async function extractCoordinates(url) {
  try {
    // If URL is a short link, fetch final redirect URL (server-side recommended to avoid CORS)
    let finalUrl = url;
    if (url.includes("goo.gl")) {
      const response = await fetch(url, { redirect: "follow" });
      finalUrl = response.url;
    }

    // Try to extract coordinates from '@lat,lng' pattern
    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return { lat: match[1], lng: match[2] };
    }

    // If not found, try extracting from '!3dLAT!4dLNG' pattern (Google Maps place URLs)
    const altMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (altMatch) {
      return { lat: altMatch[1], lng: altMatch[2] };
    }

    return { error: "Coordinates not found in the URL" };
  } catch (error) {
    return { error: error.message };
  }
}

// Example usage
(async () => {
  const url = "https://www.google.com/maps/place/Dr+Abhay+Radio+FM+sangli+Devgiri+Ayurved,+Bapat+bal+school,+Foujdar+Galli,+Dr+udgaavkar+hospital's+back+side,+Near+S+T+stand,+Main+Road,+Sangli,+Maharashtra+416416/data=!4m2!3m1!1s0x3bc119606bc13dd9:0xd1b1fdc4518f9dc7?utm_source=mstt_1";
  const coords = await extractCoordinates(url);
  console.log(coords);
})();


// --- Marker icon (custom styled popup card look) ---
const createDivIcon = (business) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="custom-marker-container">
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-xs font-semibold truncate w-3/5">${business.businessName}</h3>
        </div>
        <p class="text-[10px] text-gray-600 truncate">${business.handlerName || ""}</p>
        <p class="text-[10px] text-gray-500">${business.mobileNumber?.join(" / ") || ""}</p>
      </div>
    `,
    iconSize: [140, 60],
    iconAnchor: [70, 60],
    popupAnchor: [0, -60],
  });
};

// --- Auto fit map to markers ---
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      ;
    }
  }, [positions, map]);
  return null;
};

// --- Main MapWithMarkers component ---
export default function MapWithMarkers({ clients = [], onSelectBusiness }) {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [resolvedClients, setResolvedClients] = useState([]);

  // Resolve Google Maps short URLs into lat/lng
  useEffect(() => {
    async function resolveAll() {
      const resolved = await Promise.all(
        clients.map(async (c) => {
          if (c.businessLocation) {
            const coords = await extractCoordinates(c.businessLocation);
            if (coords) return { ...c, ...coords };
          }
          return c;
        })
      );
      setResolvedClients(resolved);
    }
    resolveAll();
  }, [clients]);

  // Prepare positions for fit bounds
  const positions = useMemo(
    () =>
      resolvedClients
        .filter((c) => c.lat && c.lng)
        .map((c) => [c.lat, c.lng]),
    [resolvedClients]
  );

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={[19.076, 75]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
        />

        {resolvedClients
          .filter((c) => c.lat && c.lng)
          .map((business) => (
            <Marker
              key={business._id}
              position={[business.lat, business.lng]}
              icon={createDivIcon(business)}
              eventHandlers={{
                click: () => {
                  setSelectedBusiness(business);
                  onSelectBusiness?.(business);
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{business.businessName}</h3>
                  <p className="text-sm text-gray-600">
                    {business.handlerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {business.mobileNumber?.join(" / ")}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        <FitBounds positions={positions} />
      </MapContainer>

      {selectedBusiness && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-[1000]">
          <h3 className="font-bold text-lg">{selectedBusiness.businessName}</h3>
          <p className="text-gray-600">{selectedBusiness.handlerName}</p>
          <p className="text-gray-500">
            {selectedBusiness.mobileNumber?.join(" / ")}
          </p>
          <p className="mt-2 text-sm">{selectedBusiness.bio}</p>
          <button
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => setSelectedBusiness(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Marker card CSS */}
      <style>{`
        .custom-marker-container {
          background: white;
          padding: 6px;
          border-radius: 8px;
          border-top: 4px solid #3b82f6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          min-width: 140px;
          transform: translateY(-24px);
        }
      `}</style>
    </div>
  );
}