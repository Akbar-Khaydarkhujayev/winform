import uzbekistanMap from "@svg-maps/uzbekistan";
import { svgIdToRegion, ERegion, regionLabels } from "../../types/enums";

interface Props {
  selectedRegion: ERegion;
  onRegionClick: (regionId: ERegion) => void;
}

// "tashkent" id appears twice in the map data (city + region).
// First match = Tashkent city (small), second = Tashkent region (large).
const tashkentIds = (
  uzbekistanMap.locations as { id: string; name: string; path: string }[]
)
  .map((loc: { id: string }, idx: number) => (loc.id === "tashkent" ? idx : -1))
  .filter((i: number) => i >= 0);

function getRegionEnum(
  locationId: string,
  locationIndex: number,
): ERegion | null {
  if (locationId === "tashkent") {
    if (tashkentIds.length >= 2) {
      return locationIndex === tashkentIds[0]
        ? ERegion.Tashkent
        : ERegion.TashkentRegion;
    }
    return ERegion.Tashkent;
  }
  if (locationId === "aral-sea") return null;
  return svgIdToRegion[locationId] ?? null;
}

function getFill(regionEnum: ERegion | null, selectedRegion: ERegion): string {
  if (regionEnum === null) return "#0F1B2E"; // Aral Sea
  if (regionEnum === selectedRegion) return "#4F6EF7";
  if (regionEnum === ERegion.Tashkent) return "#2563EB"; // capital city
  if (regionEnum === ERegion.TashkentRegion) return "#3B82F6"; // capital region
  return "#1E3A5F";
}

/* Approximate centroid positions for region labels (viewBox 0 0 793 517) */
const regionCentroids: {
  region: ERegion;
  x: number;
  y: number;
  fontSize?: number;
}[] = [
  { region: ERegion.Karakalpakstan, x: 135, y: 150, fontSize: 10 },
  { region: ERegion.Khorezm, x: 242, y: 288, fontSize: 10 },
  { region: ERegion.Bukhara, x: 358, y: 338, fontSize: 10 },
  { region: ERegion.Navoi, x: 375, y: 205, fontSize: 10 },
  { region: ERegion.Samarkand, x: 488, y: 358, fontSize: 10 },
  { region: ERegion.Kashkadarya, x: 478, y: 425, fontSize: 10 },
  { region: ERegion.Surkhandarya, x: 538, y: 478, fontSize: 10 },
  { region: ERegion.Jizzakh, x: 558, y: 338, fontSize: 10 },
  { region: ERegion.Sirdarya, x: 584, y: 318, fontSize: 10 },
  { region: ERegion.TashkentRegion, x: 635, y: 265, fontSize: 10 },
  { region: ERegion.Namangan, x: 712, y: 285, fontSize: 10 },
  { region: ERegion.Fergana, x: 708, y: 324, fontSize: 10 },
  { region: ERegion.Andijan, x: 762, y: 304, fontSize: 10 },
];

export default function UzbekistanMap({
  selectedRegion,
  onRegionClick,
}: Props) {
  return (
    <div className="bg-card-bg rounded-2xl p-5 h-full flex flex-col">
      <h3 className="text-text-primary font-semibold shrink-0 mb-3 text-lg">
        O'zbekiston respublikasi xaritasi
      </h3>

      {/* Inner dark map container */}
      <div className="flex-1 min-h-0 bg-[#12121E] rounded-xl flex items-center justify-center p-4">
        <svg
          viewBox={uzbekistanMap.viewBox}
          className="w-full max-h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {(
            uzbekistanMap.locations as {
              id: string;
              name: string;
              path: string;
            }[]
          ).map((location, idx) => {
            const regionEnum = getRegionEnum(location.id, idx);
            const isClickable = regionEnum !== null;

            return (
              <path
                key={`${location.id}-${idx}`}
                d={location.path}
                fill={getFill(regionEnum, selectedRegion)}
                stroke="#12121E"
                strokeWidth="1.5"
                className={
                  isClickable
                    ? "cursor-pointer hover:brightness-125 transition-all duration-200"
                    : ""
                }
                onClick={() => {
                  if (isClickable && regionEnum !== null) {
                    onRegionClick(regionEnum);
                  }
                }}
              >
                <title>{location.name}</title>
              </path>
            );
          })}

          {/* Region name labels */}
          {regionCentroids.map(({ region, x, y, fontSize }) => {
            const label = regionLabels[region];
            if (!label) return null;
            return (
              <text
                key={`label-${region}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.55)"
                fontSize={fontSize ?? 7}
                fontWeight={500}
                style={{ pointerEvents: "none" }}
              >
                {label.toUpperCase()}
              </text>
            );
          })}

          {/* Aral Sea label */}
          <text
            x={150}
            y={50}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.35)"
            fontSize={10}
            fontFamily="Poppins"
            fontWeight={500}
            style={{ pointerEvents: "none" }}
          >
            OROL DENGIZI
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 justify-center shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: "#1E3A5F" }}
          />
          <span className="text-text-secondary text-xs">Viloyatlar</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: "#3B82F6" }}
          />
          <span className="text-text-secondary text-xs">Poytaxt viloyat</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: "#2563EB" }}
          />
          <span className="text-text-secondary text-xs">Poytaxt shahar</span>
        </div>
      </div>
    </div>
  );
}
