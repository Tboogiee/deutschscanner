import { NextResponse } from "next/server";

type Departure = {
  from: string;
  line: string;
  departure: string;
  platform: string;
  direction: string;
};

const mockDepartures: Record<string, Departure[]> = {
  potsdam: [
    { from: "Berlin Hbf", line: "RE1", departure: "14:42", platform: "7", direction: "Brandenburg Hbf" },
    { from: "Berlin Hbf", line: "S7", departure: "15:01", platform: "3", direction: "Potsdam Hbf" },
    { from: "Berlin Hbf", line: "RE1", departure: "15:12", platform: "8", direction: "Magdeburg Hbf" }
  ],
  lubbenau: [
    { from: "Berlin Hbf", line: "RE2", departure: "14:30", platform: "5", direction: "Cottbus Hbf" },
    { from: "Berlin Hbf", line: "RE2", departure: "15:30", platform: "5", direction: "Cottbus Hbf" }
  ],
  "brandenburg-havel": [
    { from: "Berlin Hbf", line: "RE1", departure: "14:42", platform: "7", direction: "Brandenburg Hbf" },
    { from: "Berlin Hbf", line: "RE1", departure: "15:12", platform: "8", direction: "Magdeburg Hbf" }
  ],
  chorin: [
    { from: "Berlin Hbf", line: "RE3", departure: "14:35", platform: "6", direction: "Stralsund Hbf" },
    { from: "Berlin Hbf", line: "RB24", departure: "15:07", platform: "4", direction: "Eberswalde Hbf" }
  ],
  rostock: [
    { from: "Berlin Hbf", line: "RE5", departure: "13:47", platform: "6", direction: "Rostock Hbf" },
    { from: "Berlin Hbf", line: "RE5", departure: "15:47", platform: "6", direction: "Rostock Hbf" }
  ],
  leipzig: [
    { from: "Berlin Hbf", line: "RE3 + RE13", departure: "13:55", platform: "11", direction: "Lutherstadt Wittenberg / Leipzig" },
    { from: "Berlin Hbf", line: "RE4 + RE10", departure: "15:04", platform: "9", direction: "Falkenberg / Leipzig" }
  ]
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination");

  if (!destination) {
    return NextResponse.json([]);
  }

  return NextResponse.json(mockDepartures[destination] || []);
}
