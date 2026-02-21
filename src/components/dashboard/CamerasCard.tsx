import type { DashboardData } from "../../types/dashboard";

interface Props {
  data: DashboardData;
}

export default function CamerasCard({ data }: Props) {
  const items = [
    {
      label: "Umumiy",
      value: data.totalCameras,
      dot: "bg-blue-600",
      border: "border-blue-600",
    },
    {
      label: "Onlayn",
      value: data.totalActiveCameras,
      dot: "bg-green-500",
      border: "border-green-500",
    },
    {
      label: "Offlayn",
      value: data.totalInactiveCameras,
      dot: "bg-slate-500",
      border: "border-slate-500",
    },
  ];

  return (
    <div
      className="bg-card-bg rounded-2xl p-6 flex flex-col h-full"
      style={{ gap: 12 }}
    >
      <h3
        className="text-text-primary font-semibold mb-2"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        Kameralar soni
      </h3>
      <div className="flex flex-col" style={{ gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between border-2 ${item.border}`}
            style={{
              borderRadius: 12,
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${item.dot}`} />
              <span
                className="text-text-primary font-medium"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </div>
            <span
              className="text-text-primary font-bold"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              {item.value.toLocaleString("ru-RU")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
