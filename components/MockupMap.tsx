"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import type { Destination } from "@/data/destinations";

type MockupMapProps = {
  points: Destination[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
};

const berlin: [number, number] = [52.5251, 13.3694];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MockupMap({
  points,
  selectedSlug,
  onSelect,
}: MockupMapProps) {
  return (
    <div className="h-[640px] w-full">
      <MapContainer
        center={[52.5, 13.2]}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={berlin} icon={markerIcon}>
          <Popup>Berlin Hbf</Popup>
        </Marker>

        {points.map((point) => (
          <Marker
            key={point.slug}
            position={[point.lat, point.lng]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onSelect?.(point.slug),
            }}
          >
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {point.time} from Berlin
            </Popup>
          </Marker>
        ))}

        {points.map((point, index) => (
          <Polyline
            key={`${point.slug}-line`}
            positions={[
              berlin,
              [point.lat, point.lng],
            ]}
            pathOptions={{
              color:
                point.slug === selectedSlug
                  ? "#FF8A1F"
                  : index % 2 === 0
                    ? "#0B3B82"
                    : "#7C93B8",
              weight: point.slug === selectedSlug ? 6 : 3,
              opacity: point.slug === selectedSlug ? 0.95 : 0.45,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}