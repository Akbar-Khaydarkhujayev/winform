import { Mars, Venus, ChevronUp } from "lucide-react";
import type { DashboardData } from "../../types/dashboard";

interface Props {
  data: DashboardData;
  type: "male" | "female";
}

export default function GenderCard({ data, type }: Props) {
  const isMale = type === "male";
  const count = isMale ? data.totalMaleStudents : data.totalFemaleStudents;
  const events = isMale ? data.totalMaleEvents : data.totalFemaleEvents;
  const percentage =
    data.totalEvents > 0
      ? ((events / data.totalEvents) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="bg-card-bg rounded-2xl px-5 py-4 flex flex-col gap-2.5">
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between">
        <span
          className="text-text-secondary font-medium"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: 18 }}
        >
          {isMale ? "Erkaklar" : "Ayollar"}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isMale ? "bg-blue-500/15" : "bg-rose-500/15"
          }`}
        >
          {isMale ? (
            <Mars size={20} color="#3B82F6" />
          ) : (
            <Venus size={20} color="#EC4899" />
          )}
        </div>
      </div>

      {/* Bottom row: count + percentage */}
      <div className="flex items-end justify-between">
        <span
          className="text-white font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 28,
            lineHeight: 1,
          }}
        >
          {count.toLocaleString("ru-RU")}
        </span>
        <div className="flex items-center gap-1.5">
          <ChevronUp size={14} color="#00A63E" strokeWidth={3} />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 16,
              lineHeight: 1,
              color: "#00A63E",
            }}
          >
            +{percentage}% bu yilda
          </span>
        </div>
      </div>
    </div>
  );
}
