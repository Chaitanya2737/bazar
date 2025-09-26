"use client";
import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Fix default Leaflet markers ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Extract coordinates from Google Maps URLs ---
async function extractCoordinates(url) {
  try {
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

    const altMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (altMatch)
      return { lat: parseFloat(altMatch[1]), lng: parseFloat(altMatch[2]) };

    return null;
  } catch (error) {
    return null;
  }
}

// --- Custom DivIcon with circular image and left-aligned name ---
const createDivIcon = (business, index = 0, total = 1, scale = 1.0) => {
  const width = 100 * scale;
  const height = 125 * scale;

  // Offset for overlapping markers
  let offsetX = 0,
    offsetY = 0;
  if (total > 1) {
    const angle = (index / total) * 2 * Math.PI;
    const distance = 25; // ↑ increased distance to separate overlapping markers
    offsetX = Math.cos(angle) * distance;
    offsetY = Math.sin(angle) * distance;
  }

  return new L.DivIcon({
    className: "custom-marker",
    html: `
      <div style="width: ${width}px; height: ${height}px; transform: translate(${offsetX}px, ${offsetY}px);">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 100"
             style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">

          <defs>
            <path id="pinPath${business._id}" 
                  d="M50,85 C50,85 15,65 15,40 C15,18 30,5 50,5 C70,5 85,18 85,40 C85,65 50,85 50,85 Z" />
            <clipPath id="pinClip${business._id}">
              <use href="#pinPath${business._id}" />
            </clipPath>
          </defs>

          <g>
            <use href="#pinPath${
              business._id
            }" fill="transparent" stroke="#333" stroke-width="1.5" />
            <image href="${business.businessIcon || "/default.png"}"
                   x="0" y="0" width="100" height="95"
                   preserveAspectRatio="xMidYMid slice"
                   clip-path="url(#pinClip${business._id})" />
          </g>
          
          <g>
            <rect x="5" y="88" width="90" height="30" rx="15" ry="15" 
                  fill="rgba(255, 255, 255, 0.9)" stroke="#333" stroke-width="1.5" />
            <text x="10" y="108" text-anchor="start" alignment-baseline="middle"
                  font-size="${10 * scale}px" font-weight="bold" fill="#222"
                  textLength="80" lengthAdjust="spacingAndGlyphs">
              ${business.businessName || "Unnamed"}
            </text>
          </g>
        </svg>
      </div>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, (height * 85) / 125],
    popupAnchor: [0, (-height * 85) / 125],
  });
};

// --- Fit map to marker bounds with preferred max zoom ---
const FitBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Max zoom to separate markers/cards
      const currentZoom = map.getZoom();
      const preferredMaxZoom = 10; // adjust for best separation
      if (currentZoom < preferredMaxZoom) {
        map.setZoom(preferredMaxZoom);
      }
    }
  }, [positions, map]);

  return null;
};

// --- Main component ---
export default function MapWithMarkers({ clients = [], onSelectBusiness }) {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [resolvedClients, setResolvedClients] = useState([]);

  // Resolve coordinates from URLs
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

  // Group businesses by coordinates for overlap handling
  const groupedMarkers = useMemo(() => {
    const grouped = {};
    resolvedClients.forEach((b) => {
      if (b.lat && b.lng) {
        const key = `${b.lat},${b.lng}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(b);
      }
    });
    return grouped;
  }, [resolvedClients]);

  // Prepare positions for FitBounds
  const positions = useMemo(
    () => resolvedClients.filter((c) => c.lat && c.lng).map((c) => [c.lat, c.lng]),
    [resolvedClients]
  );

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={[16.8489, 74.5746]} // Sangli city coordinates

        zoom={6} // default Leaflet zoom (temporary until FitBounds applies)
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        dragging={true} 
        touchZoom={true}
        keyboard={true}
        boxZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
        />

        {Object.values(groupedMarkers).map((group) =>
          group.map((business, i) => (
            <Marker
              key={business._id}
              position={[business.lat, business.lng]}
              icon={createDivIcon(business, i, group.length)}
              eventHandlers={{
                click: () => {
                  setSelectedBusiness(business);
                  onSelectBusiness?.(business);
                },
              }}
            />
          ))
        )}

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
    </div>
  );
}
