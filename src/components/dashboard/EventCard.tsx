import type { SignalREvent } from "../../types/dashboard";
import { EGender } from "../../types/enums";
import { imgUrl } from "../students/StudentDetailModal";

interface Props {
  event: SignalREvent;
}

const EAttendanceStatus = { OnTime: 1, Late: 2, Early: 3 } as const;

function getAttendanceBorder(status: number) {
  if (status === EAttendanceStatus.OnTime) return "border-green-500";
  if (status === EAttendanceStatus.Late) return "border-red-500";
  if (status === EAttendanceStatus.Early) return "border-yellow-500";
  return "border-input-border";
}

function getSimilarityColor(pct: number) {
  if (pct >= 80) return "text-green-500";
  if (pct >= 60) return "text-yellow-500";
  return "text-red-500";
}

function calcAge(dateStr: string): string {
  if (!dateStr || dateStr.startsWith("0001")) return "—";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age > 0 ? String(age) : "—";
  } catch {
    return "—";
  }
}

function genderLabel(gender: number): string {
  if (gender === EGender.Male) return "Erkak";
  if (gender === EGender.Female) return "Ayol";
  return "—";
}

export default function EventCard({ event }: Props) {
  const hasFace = !!event.faceImagePath;
  const hasDb = !!event.dbImagePath;

  return (
    <div
      className={`bg-card-bg rounded-2xl p-4 border-2 ${getAttendanceBorder(event.attendanceStatus)}`}
    >
      {/* Photos row with similarity between */}
      <div className="flex items-center gap-3 mb-3">
        {/* Left: face capture */}
        {hasFace ? (
          <img
            src={imgUrl(event.faceImagePath) || undefined}
            alt=""
            className="w-24 h-28 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-24 h-28 rounded-xl bg-input-bg flex items-center justify-center text-text-secondary text-xl font-bold shrink-0">
            {event.certificateNumber?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}

        {/* Similarity between photos */}
        <span
          className={`text-xl font-bold ${getSimilarityColor(event.similarity)}`}
        >
          {event.similarity}%
        </span>

        {/* Right: db / student photo */}
        {hasDb ? (
          <img
            src={imgUrl(event.dbImagePath) || undefined}
            alt=""
            className="w-24 h-28 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-24 h-28 rounded-xl bg-input-bg shrink-0" />
        )}
      </div>

      {/* Info rows */}
      <div className="space-y-1.5">
        <Row label="Ismi" value={event.firstName || "—"} />
        <Row label="Familiyasi" value={event.lastName || "—"} />
        <Row label="Yoshi" value={calcAge(event.birthDate)} />
        <Row label="Jinsi" value={genderLabel(event.gender)} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary text-sm">{label}:</span>
      <span className="text-text-primary text-sm font-semibold truncate ml-2">
        {value}
      </span>
    </div>
  );
}
