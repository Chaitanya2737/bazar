"use client";
import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🔥 FAST sync coordinate extraction (NO ASYNC)
function extractCoordinates(url) {
  if (!url) return null;

  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: +match[1], lng: +match[2] };

  const altMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (altMatch) return { lat: +altMatch[1], lng: +altMatch[2] };

  return null;
}

// 🔥 ICON MEMO CACHE (very important)
const iconCache = new Map();

const createDivIcon = (business, index = 0, total = 1, scale = 1) => {
  const key = `${business._id}-${index}-${total}-${scale}`;
  if (iconCache.has(key)) return iconCache.get(key);

  const size = 50 * scale;

  // Spread overlapping markers
  let offsetX = 0;
  let offsetY = 0;

  if (total > 1) {
    const angle = (index / total) * 2 * Math.PI;
    const distance = 20;
    offsetX = Math.cos(angle) * distance;
    offsetY = Math.sin(angle) * distance;
  }

  const icon = new L.DivIcon({
    className: "custom-marker",
    html: `
      <div style="
        transform: translate(${offsetX}px, ${offsetY}px);
        display:flex;
        flex-direction:column;
        align-items:center;
        font-family: sans-serif;
      ">

        <!-- Logo Circle -->
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          overflow:hidden;
          border:3px solid white;
          box-shadow:0 4px 10px rgba(0,0,0,0.25);
          position:relative;
        ">
          <img 
            src="${business.businessIcon || "/default.png"}"
            style="width:100%;height:100%;object-fit:cover;"
          />

          ${
            business.isOpen
              ? `<div style="
                  position:absolute;
                  bottom:2px;
                  right:2px;
                  width:10px;
                  height:10px;
                  background:#22c55e;
                  border-radius:50%;
                  border:2px solid white;
                "></div>`
              : ""
          }
        </div>

        <!-- Name Badge -->
        <div style="
          margin-top:4px;
          background:white;
          padding:3px 8px;
          border-radius:20px;
          font-size:${11 * scale}px;
          font-weight:600;
          white-space:nowrap;
          box-shadow:0 2px 6px rgba(0,0,0,0.15);
        ">
          ${business.businessName || "Unnamed"}
        </div>

        ${
          business.rating
            ? `<div style="
                margin-top:2px;
                font-size:10px;
                color:#f59e0b;
                font-weight:600;
              ">
                ★ ${business.rating}
              </div>`
            : ""
        }

      </div>
    `,
    iconSize: [size, size + 40],
    iconAnchor: [size / 2, size / 2],
  });

  iconCache.set(key, icon);
  return icon;
};



// 🔥 RENDER ONLY VISIBLE MARKERS
function VisibleMarkers({ clients, onSelectBusiness }) {
  const map = useMap();
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const update = () => {
      const bounds = map.getBounds();
      const filtered = clients.filter(
        (c) => c.lat && c.lng && bounds.contains([c.lat, c.lng])
      );
      setVisible(filtered);
    };

    update();
    map.on("moveend", update);

    return () => map.off("moveend", update);
  }, [clients, map]);

  return visible.map((business) => (
    <Marker
      key={business._id}
      position={[business.lat, business.lng]}
      icon={createDivIcon(business)}
      eventHandlers={{
        click: () => onSelectBusiness?.(business),
      }}
    />
  ));
}

export default function MapWithMarkers({ clients = [], onSelectBusiness }) {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // ✅ NO ASYNC, NO STATE
  const resolvedClients = useMemo(() => {
    return clients.map((c) => {
      const coords = extractCoordinates(c.businessLocation);
      return coords ? { ...c, ...coords } : c;
    });
  }, [clients]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[16.8489, 74.5746]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <VisibleMarkers
          clients={resolvedClients}
          onSelectBusiness={(b) => {
            setSelectedBusiness(b);
            onSelectBusiness?.(b);
          }}
        />
      </MapContainer>

      {selectedBusiness && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow z-50">
          <h3 className="font-bold">{selectedBusiness.businessName}</h3>
          <p>{selectedBusiness.handlerName}</p>
          <button
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => setSelectedBusiness(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
