"use client";
import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";


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



const iconCache = new Map();

const createDivIcon = (business, scale = 1) => {
  const key = `${business._id}-${scale}`;
  if (iconCache.has(key)) return iconCache.get(key);

  const nameSize = 12 * scale;
  const handlerSize = 9 * scale;
  const dotSize = 10 * scale;

  const icon = new L.DivIcon({
    className: "name-marker",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        font-family:sans-serif;
      ">
        
        <!-- Name + Handler Pill -->
        <div style="
          background:#F9F9F9;
          padding:6px 14px;
          border-radius:16px;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
          text-align:center;
          white-space:nowrap;
        ">
          <div style="
            font-size:${nameSize}px;
            font-weight:700;
            color:#111;
          ">
            ${business.businessName}
          </div>

          ${
            business.handlerName
              ? `
              <div style="
                font-size:${handlerSize}px;
                font-weight:500;
                color:#666;
                margin-top:2px;
              ">
                ${business.handlerName}
              </div>
              `
              : ""
          }
        </div>

        <!-- Connector Line -->
        <div style="
          width:2px;
          height:8px;
          background:#555;
        "></div>

        <!-- Bottom Center Dot -->
        <div style="
          width:${dotSize}px;
          height:${dotSize}px;
          background:${business.isOpen ? "#22c55e" : "#ef4444"};
          border-radius:50%;
          box-shadow:0 0 6px rgba(0,0,0,1);
        "></div>

      </div>
    `,
    iconSize: [180, 65],
    iconAnchor: [90, 65],
  });

  iconCache.set(key, icon);
  return icon;
};

// 🔥 RENDER ONLY VISIBLE MARKERS
function VisibleMarkers({ clients, onSelectBusiness }) {
  const map = useMap();
  const [visible, setVisible] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const update = () => {
      const bounds = map.getBounds();
      const filtered = clients.filter(
        (c) => c.lat && c.lng && bounds.contains([c.lat, c.lng]),
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
        click: () => {
  const slug = business.businessName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  router.push(`/${slug}`);
},

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
        center={[16.8524, 74.5815]} // Sangli
        zoom={13} // Good city-level zoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

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
