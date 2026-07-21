"use client";

import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Destination, RouteOption } from "@/data/destinations";

type MockupMapProps = {
  points: Destination[];
  selectedSlug?: string;
  selectedRoute?: RouteOption;
  onSelect?: (slug: string) => void;
};

const berlin: [number, number] = [52.5251, 13.3694];

function MapFocus({ selectedRoute }: { selectedRoute?: RouteOption }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedRoute || selectedRoute.geometry.length < 2) return;
    map.fitBounds(selectedRoute.geometry, { padding: [48, 48], maxZoom: 9 });
  }, [map, selectedRoute]);

  return null;
}

export default function MockupMap({
  points,
  selectedSlug,
  selectedRoute,
  onSelect,
}: MockupMapProps) {
  return (
    <div className="h-[720px] w-full">
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

        <MapFocus selectedRoute={selectedRoute} />

        <CircleMarker
          center={berlin}
          radius={9}
          pathOptions={{ color: "#ffffff", fillColor: "#082f49", fillOpacity: 1, weight: 3 }}
        >
          <Popup>Berlin Hbf</Popup>
        </CircleMarker>

        {points.map((point) => (
          <CircleMarker
            key={point.slug}
            center={[point.lat, point.lng]}
            radius={point.slug === selectedSlug ? 9 : 6}
            pathOptions={{
              color: point.slug === selectedSlug ? "#ffffff" : "#082f49",
              fillColor: point.slug === selectedSlug ? "#f26a2e" : "#ffffff",
              fillOpacity: 1,
              weight: point.slug === selectedSlug ? 4 : 2,
            }}
            eventHandlers={{
              click: () => onSelect?.(point.slug),
            }}
          >
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {point.time} from Berlin
            </Popup>
          </CircleMarker>
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
