"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import type { Destination, RouteOption } from "@/data/destinations";

type MockupMapProps = {
  points: Destination[];
  selectedSlug?: string;
  selectedRoute?: RouteOption;
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

const selectedMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [32, 52],
  iconAnchor: [16, 52],
  popupAnchor: [1, -42],
  shadowSize: [52, 52],
});

export default function MockupMap({
  points,
  selectedSlug,
  selectedRoute,
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
            icon={point.slug === selectedSlug ? selectedMarkerIcon : markerIcon}
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

        {selectedRoute && (
          <>
            <Polyline
              positions={selectedRoute.geometry}
              pathOptions={{
                color: "#FF8A1F",
                weight: 6,
                opacity: 0.95,
              }}
            />

            {selectedRoute.stops.map((stop, index) => (
              <CircleMarker
                key={`${stop.name}-${index}`}
                center={stop.coordinates}
                radius={index === 0 || index === selectedRoute.stops.length - 1 ? 7 : 5}
                pathOptions={{
                  color: "#0B3B82",
                  fillColor: "#ffffff",
                  fillOpacity: 1,
                  weight: 3,
                }}
              >
                <Popup>
                  <strong>{index + 1}. {stop.name}</strong>
                  <br />
                  {selectedRoute.line}
                </Popup>
              </CircleMarker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}