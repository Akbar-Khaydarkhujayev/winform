import type { SignalREvent } from "../../types/dashboard";
import { EGender } from "../../types/enums";

const API_BASE = "http://192.168.77.16:5050";

interface Props {
  event: SignalREvent;
}

const attendanceLabels: Record<number, string> = {
  0: "Noma'lum",
  1: "Keldi",
  2: "Kelmadi",
  3: "Kechikdi",
};

const attendanceColors: Record<number, { border: string; text: string }> = {
  0: { border: "border-gray-500", text: "text-gray-500" },
  1: { border: "border-green-500", text: "text-green-500" },
  2: { border: "border-red-500", text: "text-red-500" },
  3: { border: "border-yellow-500", text: "text-yellow-500" },
};

function getSimilarityColor(pct: number) {
  if (pct >= 80) return "text-green-500";
  if (pct >= 60) return "text-yellow-500";
  return "text-red-500";
}

function formatEventTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function EventCard({ event }: Props) {
  const status =
    attendanceColors[event.attendanceStatus] ?? attendanceColors[0];
  const genderLabel =
    event.gender === EGender.Male
      ? "Erkak"
      : event.gender === EGender.Female
        ? "Ayol"
        : "—";
  const hasFace = !!event.faceImagePath;
  const hasFull = !!event.fullImagePath;

  return (
    <div
      className={`bg-card-bg rounded-2xl p-4 border-2 ${status.border} transition-all`}
    >
      <div className="flex gap-3">
        {/* Left: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-lg font-bold ${getSimilarityColor(event.similarity)}`}
            >
              {event.similarity}%
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${status.text} bg-input-bg`}
            >
              {attendanceLabels[event.attendanceStatus] ?? "Noma'lum"}
            </span>
          </div>

          <div className="space-y-1.5">
            <Row label="Sertifikat" value={event.certificateNumber} />
            {event.firstName && <Row label="Ismi" value={event.firstName} />}
            {event.lastName && (
              <Row label="Familiyasi" value={event.lastName} />
            )}
            <Row label="Jinsi" value={genderLabel} />
            <Row label="Vaqt" value={formatEventTime(event.eventDate)} />
          </div>
        </div>

        {/* Right: Photos */}
        <div className="flex flex-col gap-2 items-end shrink-0">
          {hasFace ? (
            <img
              src={`${API_BASE}${event.faceImagePath}`}
              alt="face"
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-input-bg flex items-center justify-center text-text-secondary text-lg font-bold">
              {event.certificateNumber?.slice(-2)}
            </div>
          )}
          {hasFull ? (
            <img
              src={`${API_BASE}${event.fullImagePath}`}
              alt="full"
              className="w-16 h-16 rounded-lg object-cover opacity-80"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-input-bg opacity-60" />
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary text-xs">{label}:</span>
      <span className="text-text-primary text-xs font-medium truncate ml-2">
        {value}
      </span>
    </div>
  );
}
