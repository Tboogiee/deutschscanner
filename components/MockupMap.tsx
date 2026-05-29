"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = {
  slug: string;
  name: string;
  time: string;
  lat: number;
  lng: number;
};

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MockupMap({
  points,
  onSelect,
}: {
  points: Point[];
  onSelect: (slug: string) => void;
}) {
  return (
    <MapContainer
      center={[52.7, 12.9]}
      zoom={7}
      scrollWheelZoom
      className="h-[780px] w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((point) => (
        <Marker
          key={point.slug}
          position={[point.lat, point.lng]}
          icon={icon}
          eventHandlers={{ click: () => onSelect(point.slug) }}
        >
          <Popup>
            <strong>{point.name}</strong>
            <p>{point.time} from Berlin</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}