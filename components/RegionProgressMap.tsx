"use client";

import type { Language } from "@/lib/i18n";

export type RegionProgress = {
  state: string;
  total: number;
  visited: number;
};

type RegionProgressMapProps = {
  progress: RegionProgress[];
  language: Language;
};

type RegionTile = {
  state: string;
  code: string;
  x: number;
  y: number;
  small?: boolean;
};

const regions: RegionTile[] = [
  { state: "Schleswig-Holstein", code: "SH", x: 260, y: 62 },
  { state: "Hamburg", code: "HH", x: 260, y: 144 },
  { state: "Mecklenburg-Vorpommern", code: "MV", x: 390, y: 144 },
  { state: "Bremen", code: "HB", x: 118, y: 224 },
  { state: "Lower Saxony", code: "NI", x: 220, y: 224 },
  { state: "Brandenburg", code: "BB", x: 390, y: 258 },
  { state: "Berlin", code: "BE", x: 420, y: 328, small: true },
  { state: "Saxony-Anhalt", code: "ST", x: 305, y: 320 },
  { state: "North Rhine-Westphalia", code: "NW", x: 110, y: 352 },
  { state: "Hesse", code: "HE", x: 210, y: 400 },
  { state: "Thuringia", code: "TH", x: 310, y: 414 },
  { state: "Saxony", code: "SN", x: 420, y: 418 },
  { state: "Rhineland-Palatinate", code: "RP", x: 145, y: 482 },
  { state: "Saarland", code: "SL", x: 68, y: 548, small: true },
  { state: "Baden-Württemberg", code: "BW", x: 225, y: 548 },
  { state: "Bavaria", code: "BY", x: 365, y: 550 },
];

const germanNames: Record<string, string> = {
  "Schleswig-Holstein": "Schleswig-Holstein",
  Hamburg: "Hamburg",
  "Mecklenburg-Vorpommern": "Mecklenburg-Vorpommern",
  Bremen: "Bremen",
  "Lower Saxony": "Niedersachsen",
  Brandenburg: "Brandenburg",
  Berlin: "Berlin",
  "Saxony-Anhalt": "Sachsen-Anhalt",
  "North Rhine-Westphalia": "Nordrhein-Westfalen",
  Hesse: "Hessen",
  Thuringia: "Thüringen",
  Saxony: "Sachsen",
  "Rhineland-Palatinate": "Rheinland-Pfalz",
  Saarland: "Saarland",
  "Baden-Württemberg": "Baden-Württemberg",
  Bavaria: "Bayern",
};

function hexPoints(x: number, y: number, radius: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = ((60 * index - 30) * Math.PI) / 180;
    return `${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`;
  }).join(" ");
}

export default function RegionProgressMap({
  progress,
  language,
}: RegionProgressMapProps) {
  const progressByState = new Map(progress.map((item) => [item.state, item]));

  return (
    <div className="region-map-shell">
      <svg
        className="region-map"
        viewBox="0 0 520 620"
        role="img"
        aria-label={language === "de" ? "Bereiste Bundesländer" : "German regions visited"}
      >
        <path
          className="region-map-axis"
          d="M260 62 L260 144 L220 224 L305 320 L310 414 L225 548 M390 144 L390 258 L420 418 L365 550 M118 224 L110 352 L145 482 L68 548"
        />
        {regions.map((region) => {
          const item = progressByState.get(region.state) ?? {
            state: region.state,
            total: 0,
            visited: 0,
          };
          const ratio = item.total ? item.visited / item.total : 0;
          const status = item.visited
            ? ratio >= 1
              ? "complete"
              : "started"
            : item.total
              ? "available"
              : "future";
          const name = language === "de" ? germanNames[region.state] : region.state;
          const detail = language === "de"
            ? `${item.visited} von ${item.total} Orten besucht`
            : `${item.visited} of ${item.total} places visited`;
          const radius = region.small ? 31 : 43;

          return (
            <g
              key={region.code}
              className={`region-hex ${status}`}
              aria-label={`${name}: ${detail}`}
            >
              <title>{name}: {detail}</title>
              <polygon points={hexPoints(region.x, region.y, radius)} />
              <text x={region.x} y={region.y - 2} textAnchor="middle">{region.code}</text>
              <text className="region-count" x={region.x} y={region.y + 16} textAnchor="middle">
                {item.total ? `${item.visited}/${item.total}` : "—"}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="region-map-legend">
        <span><i className="region-swatch complete" />{language === "de" ? "vollständig" : "complete"}</span>
        <span><i className="region-swatch started" />{language === "de" ? "begonnen" : "started"}</span>
        <span><i className="region-swatch available" />{language === "de" ? "noch offen" : "not yet"}</span>
      </div>
    </div>
  );
}
