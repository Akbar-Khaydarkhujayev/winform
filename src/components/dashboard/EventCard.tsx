import type { SignalREvent } from "../../types/dashboard";
import { EGender } from "../../types/enums";
import { imgUrl } from "../students/StudentDetailModal";

interface Props {
  event: SignalREvent;
}

function getSimilarityColor(pct: number) {
  if (pct >= 80) return "text-green-500";
  if (pct >= 60) return "text-yellow-500";
  return "text-red-500";
}

function formatBirthDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const age = now.getFullYear() - d.getFullYear();
    return String(age);
  } catch {
    return "—";
  }
}

export default function EventCard({ event }: Props) {
  const genderLabel =
    event.gender === EGender.Male
      ? "Erkak"
      : event.gender === EGender.Female
        ? "Ayol"
        : "—";
  const hasFace = !!event.faceImagePath;
  const hasStudent = !!event.fullImagePath;

  return (
    <div className="bg-card-bg rounded-2xl p-4 border border-input-border">
      {/* Photos row with similarity between */}
      <div className="flex items-center gap-3 mb-3">
        {/* Student / full image */}
        {hasStudent ? (
          <img
            src={imgUrl(event.fullImagePath) || undefined}
            alt=""
            className="w-24 h-28 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-24 h-28 rounded-xl bg-input-bg flex items-center justify-center text-text-secondary text-xl font-bold shrink-0">
            {event.firstName?.charAt(0) ?? "?"}
          </div>
        )}

        {/* Similarity between photos */}
        <span
          className={`text-xl font-bold ${getSimilarityColor(event.similarity)}`}
        >
          {event.similarity}%
        </span>

        {/* Face image */}
        {hasFace ? (
          <img
            src={imgUrl(event.faceImagePath) || undefined}
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
        <Row label="Yoshi" value={formatBirthDate(event.birthDate)} />
        <Row label="Jinsi" value={genderLabel} />
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
