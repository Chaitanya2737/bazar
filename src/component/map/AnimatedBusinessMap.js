import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const users = [
  {
    id: 1,
    name: "Tech Solutions Inc.",
    lat: 19.076,
    lng: 72.8777,
    state: "Maharashtra",
    city: "Mumbai",
    category: "Technology",
    employees: 250,
    revenue: "$50M",
  },
  {
    id: 2,
    name: "Pune Manufacturing",
    lat: 18.5204,
    lng: 73.8567,
    state: "Maharashtra",
    city: "Pune",
    category: "Manufacturing",
    employees: 180,
    revenue: "$35M",
  },
  {
    id: 3,
    name: "Nagpur Logistics",
    lat: 21.1458,
    lng: 79.0882,
    state: "Maharashtra",
    city: "Nagpur",
    category: "Logistics",
    employees: 120,
    revenue: "$20M",
  },
  {
    id: 4,
    name: "Nashik Agro",
    lat: 20.0059,
    lng: 73.791,
    state: "Maharashtra",
    city: "Nashik",
    category: "Agriculture",
    employees: 90,
    revenue: "$15M",
  },
  {
    id: 5,
    name: "Aurangabad Textiles",
    lat: 19.8762,
    lng: 75.3433,
    state: "Maharashtra",
    city: "Aurangabad",
    category: "Textile",
    employees: 150,
    revenue: "$25M",
  },
  {
    id: 6,
    name: "Kolhapur Foods",
    lat: 16.705,
    lng: 74.2433,
    state: "Maharashtra",
    city: "Kolhapur",
    category: "Food Processing",
    employees: 110,
    revenue: "$18M",
  },
];

const categoryColors = {
  Technology: "bg-blue-500 border-t-blue-500",
  Manufacturing: "bg-yellow-500 border-t-yellow-500",
  Logistics: "bg-green-500 border-t-green-500",
  Agriculture: "bg-lime-500 border-t-lime-500",
  Textile: "bg-purple-500 border-t-purple-500",
  "Food Processing": "bg-red-500 border-t-red-500",
};



async function extractCoordinates(shortUrl) {

  console.log(shortUrl , "from extractCoordinates function  ");
  try {
    const response = await axios.get(shortUrl, { maxRedirects: 0 });
  } catch (error) {
    if (error.response && error.response.headers.location) {
      const finalUrl = error.response.headers.location;
      const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        };
      }
    }
  }
  return null;
}

const createDivIcon = (user) => {
  const colorClass =
    categoryColors[user.category] || "bg-gray-500 border-t-gray-500";
  const [bgColor, borderColor] = colorClass.split(" ");

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="custom-marker-container">
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-xs font-semibold truncate w-3/5">${user.name}</h3>
          <span class="px-1.5 py-0.5 text-[10px] rounded-full text-white ${bgColor} whitespace-nowrap">
            ${user.category}
          </span>
        </div>
        <p class="text-[10px] text-gray-600 truncate">${user.city}, ${user.state}</p>
        <div class="flex justify-between mt-1.5 text-[10px]">
          <span class="text-gray-500 truncate">${user.employees} emp</span>
          <span class="text-green-600 font-medium truncate">${user.revenue}</span>
        </div>
      </div>
    `,
    iconSize: [140, 60],
    iconAnchor: [70, 60],
    popupAnchor: [0, -60],
  });
};

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });

      map.setView([16.8524, 74.5815], 10);
    }
  }, [positions, map]);
  return null;
};

export default function MapWithMarkers(clients , onSelectBusiness) {
  const [selectedUser, setSelectedUser] = useState(null);

  const positions = useMemo(
    () => users.map((user) => [user.lat, user.lng]),
    []
  );

  extractCoordinates(clients?.businessLocation)

  const markers = useMemo(
    () =>
      users.map((user) => (
        <Marker
          key={user.id}
          position={[user.lat, user.lng]}
          icon={createDivIcon(user)}
          eventHandlers={{
            click: () => setSelectedUser(user),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">
                {user.city}, {user.state}
              </p>
              <p className="text-sm">Category: {user.category}</p>
              <p className="text-sm">Employees: {user.employees}</p>
              <p className="text-sm">Revenue: {user.revenue}</p>
            </div>
          </Popup>
        </Marker>
      )),
    []
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

        {markers}
        <FitBounds positions={positions} />
      </MapContainer>

      {selectedUser && (
        <div
          className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-[1000]"
          role="dialog"
          aria-labelledby="user-details-title"
        >
          <h3 id="user-details-title" className="font-bold text-lg">
            {selectedUser.name}
          </h3>
          <p className="text-gray-600">
            {selectedUser.city}, {selectedUser.state}
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <strong>Category:</strong> {selectedUser.category}
            </p>
            <p>
              <strong>Employees:</strong> {selectedUser.employees}
            </p>
            <p>
              <strong>Revenue:</strong> {selectedUser.revenue}
            </p>
          </div>
          <button
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm"
            onClick={() => setSelectedUser(null)}
            aria-label="Close user details"
          >
            Close
          </button>
        </div>
      )}

      {/* Add CSS for the marker */}
      <style>{`
        .custom-marker-container {
          background: white;
          padding: 8px;
          border-radius: 8px;
          border-top: 4px solid;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          min-width: 140px;
          transform: translateY(-24px);
        }
      `}</style>
    </div>
  );
}
