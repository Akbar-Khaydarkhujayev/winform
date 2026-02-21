import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DashboardData } from "../../types/dashboard";

const months = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "Iyn",
  "Iyl",
  "Avg",
  "Sen",
  "Okt",
  "Nov",
  "Dek",
];

// Generate smooth monthly distribution from totals
function distributeMonthly(total: number): number[] {
  const weights = [
    0.06, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.09, 0.08, 0.08, 0.08,
  ];
  return weights.map((w) => Math.round(total * w));
}

interface Props {
  data: DashboardData;
}

export default function StatsLineChart({ data }: Props) {
  const onTime = distributeMonthly(data.totalOnTimeEvents);
  const late = distributeMonthly(data.totalLateEvents);
  const absent = distributeMonthly(
    Math.max(
      0,
      data.totalStudents - data.totalOnTimeEvents - data.totalLateEvents,
    ),
  );

  const chartData = months.map((m, i) => ({
    month: m,
    onTime: onTime[i],
    late: late[i],
    absent: absent[i],
  }));

  const absentTotal = Math.max(
    0,
    data.totalStudents - data.totalOnTimeEvents - data.totalLateEvents,
  );

  return (
    <div className="bg-card-bg rounded-2xl p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-text-primary font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          Umumiy
        </span>
        <span
          className="text-text-primary font-bold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          {data.totalStudents.toLocaleString("ru-RU")}
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              stroke="#2E2E3A"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6F6F79", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "#1D1D29",
                border: "1px solid #2E2E3A",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
              }}
              formatter={(value) => (value as number).toLocaleString("ru-RU")}
            />
            <Line
              type="monotone"
              dataKey="onTime"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              name="Vaqtida kelganlar"
            />
            <Line
              type="monotone"
              dataKey="late"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={false}
              name="Kech qolganlar"
            />
            <Line
              type="monotone"
              dataKey="absent"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={false}
              name="Kelmaganlar"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-text-secondary text-xs">
              Vaqtida kelganlar
            </span>
          </div>
          <span
            className="text-text-primary font-semibold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            {data.totalOnTimeEvents.toLocaleString("ru-RU")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-yellow-500" />
            <span className="text-text-secondary text-xs">Kech qolganlar</span>
          </div>
          <span
            className="text-text-primary font-semibold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            {data.totalLateEvents.toLocaleString("ru-RU")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-text-secondary text-xs">Kelmaganlar</span>
          </div>
          <span
            className="text-text-primary font-semibold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            {absentTotal.toLocaleString("ru-RU")}
          </span>
        </div>
      </div>
    </div>
  );
}
