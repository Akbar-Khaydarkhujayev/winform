import type { DashboardData } from "../../types/dashboard";

interface Props {
  data: DashboardData;
}

function DonutChart({
  value,
  total,
  color,
  size = 100,
}: {
  value: number;
  total: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? value / total : 0;
  const offset = circumference * (1 - percentage);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2E2E3A"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-text-primary font-bold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          {value.toLocaleString("ru-RU")}
        </span>
      </div>
    </div>
  );
}

export default function ObjectsCard({ data }: Props) {
  const total = data.totalExamObjects;

  return (
    <div
      className="bg-card-bg rounded-2xl p-6 flex flex-col h-full"
      style={{ gap: 10 }}
    >
      <div className="flex flex-col gap-4">
        <h3
          className="text-text-primary font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          Obyektlar soni
        </h3>
        <div className="flex items-center gap-5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-text-secondary text-xs">Umumiy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-text-secondary text-xs">Onlayn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-500" />
            <span className="text-text-secondary text-xs">Offlayn</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around">
        <DonutChart value={total} total={total} color="#3B82F6" />
        <DonutChart
          value={data.totalActiveExamObjects}
          total={total}
          color="#22C55E"
        />
        <DonutChart
          value={data.totalInactiveExamObjects}
          total={total}
          color="#6B7280"
        />
      </div>
    </div>
  );
}
