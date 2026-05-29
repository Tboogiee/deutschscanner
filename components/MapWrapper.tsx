"use client";

import dynamic from "next/dynamic";

type Trip = {
  slug: string;
  name: string;
  time: string;
  lat: number;
  lng: number;
};

const MockupMap = dynamic(() => import("@/components/MockupMap"), {
  ssr: false,
});

export default function MapWrapper({ points }: { points: Trip[] }) {
  return <MockupMap points={points} />;
}