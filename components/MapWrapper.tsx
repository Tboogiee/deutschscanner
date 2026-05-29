"use client";

import dynamic from "next/dynamic";

type Trip = {
  slug: string;
  name: string;
  time: string;
  lat: number;
  lng: number;
};

type MapWrapperProps = {
  points: Trip[];
  onSelect?: (slug: string) => void;
};

const MockupMap = dynamic(() => import("@/components/MockupMap"), {
  ssr: false,
});

export default function MapWrapper({ points, onSelect }: MapWrapperProps) {
  return <MockupMap points={points} onSelect={onSelect} />;
}