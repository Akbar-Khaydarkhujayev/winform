import type { EExamingPeriod } from "../../types/enums";

interface Props {
  selected: EExamingPeriod | null;
  onChange: (period: EExamingPeriod | null) => void;
}

const shifts: { period: EExamingPeriod; name: string; time: string }[] = [
  { period: 1, name: "1-smena", time: "08:00-10:30" },
  { period: 2, name: "2-smena", time: "11:00-13:30" },
  { period: 3, name: "3-smena", time: "14:00-16:30" },
];

export default function ShiftsCard({ selected, onChange }: Props) {
  return (
    <div
      className="bg-card-bg h-full flex flex-col"
      style={{
        borderRadius: 16,
        paddingTop: 18,
        paddingBottom: 18,
        paddingLeft: 16,
        paddingRight: 16,
        gap: 20,
      }}
    >
      <h3
        className="text-text-primary font-semibold shrink-0"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        Smenalar va boshlanish vaqti
      </h3>
      <div className="flex flex-col" style={{ gap: 12 }}>
        {shifts.map((shift) => {
          const isActive = shift.period === selected;
          return (
            <div
              key={shift.period}
              onClick={() => onChange(isActive ? null : shift.period)}
              className={`flex items-center justify-between border-2 cursor-pointer transition-colors ${
                isActive
                  ? "border-green-500"
                  : "border-gray-500 hover:border-white/10"
              }`}
              style={{
                borderRadius: 12,
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <span
                className="text-text-primary font-medium"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {shift.name}
              </span>
              <span
                className={`font-semibold ${isActive ? "text-green-500" : "text-blue-600"}`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {shift.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
