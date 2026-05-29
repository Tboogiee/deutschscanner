import { NextResponse } from "next/server";

const mockDepartures: Record<string, any[]> = {
  Potsdam: [
    {
      line: "RE1",
      departure: "14:42",
      platform: "7",
      direction: "Brandenburg Hbf",
    },
    {
      line: "S7",
      departure: "15:01",
      platform: "3",
      direction: "Potsdam Hbf",
    },
    {
      line: "RE1",
      departure: "15:12",
      platform: "8",
      direction: "Magdeburg",
    },
  ],

  Leipzig: [
    {
      line: "RE13",
      departure: "14:55",
      platform: "11",
      direction: "Leipzig Hbf",
    },
    {
      line: "RE10",
      departure: "15:40",
      platform: "9",
      direction: "Leipzig",
    },
  ],

  Lübbenau: [
    {
      line: "RE2",
      departure: "14:30",
      platform: "5",
      direction: "Cottbus",
    },
    {
      line: "RE2",
      departure: "15:30",
      platform: "5",
      direction: "Lübbenau",
    },
  ],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const destination = searchParams.get("destination");

  if (!destination) {
    return NextResponse.json([]);
  }

  return NextResponse.json(
    mockDepartures[destination] || []
  );
}