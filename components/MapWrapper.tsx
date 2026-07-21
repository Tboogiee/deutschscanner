"use client";

import dynamic from "next/dynamic";
import type { Destination, RouteOption } from "@/data/destinations";

type MapWrapperProps = {
  points: Destination[];
  selectedSlug?: string;
  selectedRoute?: RouteOption;
  visitedSlugs?: string[];
  onSelect?: (slug: string) => void;
};

const MockupMap = dynamic(() => import("@/components/MockupMap"), {
  ssr: false,
});

export default function MapWrapper({
  points,
  selectedSlug,
  selectedRoute,
  visitedSlugs,
  onSelect,
}: MapWrapperProps) {
  return (
    <MockupMap
      points={points}
      selectedSlug={selectedSlug}
      selectedRoute={selectedRoute}
      visitedSlugs={visitedSlugs}
      onSelect={onSelect}
    />
  );
}
