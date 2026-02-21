import { useQuery } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { eventsApi } from "../../api/events";
import { EGender } from "../../types/enums";
import type { Student } from "../../types/students";
import type { EventItem } from "../../types/events";

const API_BASE = "http://192.168.77.16:5050";

export function imgUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const token = localStorage.getItem("token");
  // If already absolute
  if (path.startsWith("http")) return path;
  return `${API_BASE}/api${path.startsWith("/") ? path : `/${path}`}?token=${token}`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentDetailModal({ student, onClose }: Props) {
  /* Fetch the latest event for this student by searching events */
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events", "student", student.id],
    queryFn: () =>
      eventsApi.getAll({
        page: 1,
        pageSize: 1,
      }),
    /* We use the first event that matches this student.
       If the API supports filtering by studentId in the future,
       we would use that. For now we fetch and find. */
  });

  /* Try to find an event for this student */
  const event: EventItem | undefined = eventsData?.items?.find(
    (e) => e.studentId === student.id,
  );

  const studentPhoto = imgUrl(student.photoPath);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-card-bg border border-input-border rounded-2xl w-full max-w-290 mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-input-border">
          <h2 className="text-text-primary text-lg font-semibold">
            Abiturient ma'lumoti
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={32} className="animate-spin text-accent" />
            </div>
          ) : (
            <div className="flex gap-8">
              {/* Left: images */}
              <div className="shrink-0 w-120 space-y-4">
                {/* Photo row: student photo + face image with similarity */}
                <div className="flex items-start gap-4">
                  {/* Student photo */}
                  <div className="w-48 h-56 rounded-xl overflow-hidden bg-input-bg">
                    {studentPhoto ? (
                      <img
                        src={studentPhoto}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary text-2xl">
                        {student.firstName?.charAt(0) ?? "?"}
                      </div>
                    )}
                  </div>

                  {/* Similarity badge */}
                  {event && (
                    <div className="flex flex-col items-center justify-center self-center">
                      <span className="bg-emerald-500 text-white text-base font-bold rounded-lg px-4 py-2">
                        {Math.round(event.similarity)}%
                      </span>
                    </div>
                  )}

                  {/* Face image from event */}
                  {event?.faceImageUrl && (
                    <div className="w-48 h-56 rounded-xl overflow-hidden bg-input-bg">
                      <img
                        src={imgUrl(event.faceImageUrl)!}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Full / panorama image */}
                {event?.fullImageUrl && (
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-input-bg">
                    <img
                      src={imgUrl(event.fullImageUrl)!}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {!event && !isLoading && (
                  <div className="text-text-secondary text-sm py-8 text-center">
                    Hodisa topilmadi
                  </div>
                )}
              </div>

              {/* Right: info table */}
              <div className="flex-1 space-y-5 pt-2">
                <InfoRow label="Ismi:" value={student.firstName} />
                <InfoRow label="Familiyasi:" value={student.lastName} />
                <InfoRow label="Yoshi:" value={formatDate(student.birthDate)} />
                <InfoRow
                  label="Jinsi:"
                  value={student.gender === EGender.Male ? "Erkak" : "Ayol"}
                  valueClass={
                    student.gender === EGender.Male
                      ? "text-accent"
                      : "text-emerald-400"
                  }
                />
                <InfoRow
                  label="Smenasi:"
                  value={`${student.examingPeriod}-smena`}
                  valueClass="text-emerald-400"
                />
                {event && (
                  <>
                    <InfoRow
                      label="Topshirish vaqti:"
                      value={formatTime(event.eventDate)}
                      valueClass="text-red-400"
                    />
                    <InfoRow
                      label="Kamera nomi:"
                      value={event.cameraName || "—"}
                    />
                  </>
                )}
                <InfoRow
                  label="Sertifikat:"
                  value={student.certificateNumber || "—"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="text-text-secondary text-base shrink-0">{label}</span>
      <span
        className={`text-base font-semibold text-right ${valueClass ?? "text-text-primary"}`}
      >
        {value}
      </span>
    </div>
  );
}
