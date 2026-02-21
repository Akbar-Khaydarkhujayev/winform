import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Search, Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Pagination from "../components/Pagination";
import CreateStudentModal from "../components/students/CreateStudentModal";
import StudentDetailModal from "../components/students/StudentDetailModal";
import { studentsApi } from "../api/students";
import { examObjectApi } from "../api/cameras";
import {
  ERegion,
  EGender,
  EExamingPeriod,
  regionLabels,
  periodLabels,
} from "../types/enums";
import { API_BASE } from "../components/Navbar";

import type { Student } from "../types/students";

/* ── Region options ── */
const regionOptions = Object.entries(ERegion).map(([, value]) => ({
  value: value as number,
  label: regionLabels[value as ERegion],
}));

/* ── Gender options ── */
const genderOptions = [
  { value: EGender.Male, label: "Erkak" },
  { value: EGender.Female, label: "Ayol" },
];

/* ── Period options ── */
const periodOptions = Object.entries(EExamingPeriod).map(([, value]) => ({
  value: value as number,
  label: periodLabels[value as EExamingPeriod],
}));

/* ── Dropdown hook ── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  return { open, setOpen, ref } as const;
}

/* ── Dropdown component ── */
function Dropdown({
  open,
  setOpen,
  dropdownRef,
  label,
  selectedLabel,
  children,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  label: string;
  selectedLabel: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 bg-input-bg border border-input-border rounded-lg px-4 py-2.5 min-w-37.5 text-sm hover:border-accent/40 transition-colors"
      >
        <span
          className={
            selectedLabel ? "text-text-primary" : "text-text-secondary"
          }
        >
          {selectedLabel ?? label}
        </span>
        <ChevronDown size={16} className="text-text-secondary" />
      </button>
      {open && children}
    </div>
  );
}

/* ── Date formatter ── */
function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  /* ── Filter state ── */
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);

  /* ── Dropdowns ── */
  const regionDd = useDropdown();
  const genderDd = useDropdown();
  const periodDd = useDropdown();
  const objectDd = useDropdown();

  /* ── Fetch exam objects ── */
  const { data: examObjects = [] } = useQuery({
    queryKey: ["examObjects"],
    queryFn: examObjectApi.getAll,
  });

  /* ── Filter exam objects by region ── */
  const filteredObjects = selectedRegion
    ? examObjects.filter((o) => o.regionId === selectedRegion)
    : examObjects;

  /* ── Fetch students ── */
  const { data: studentsData, isLoading } = useQuery({
    queryKey: [
      "students",
      currentPage,
      pageSize,
      selectedRegion,
      selectedGender,
      selectedPeriod,
      selectedObject,
      searchQuery,
    ],
    queryFn: () =>
      studentsApi.getAll({
        page: currentPage,
        pageSize,
        ...(selectedRegion ? { Region: selectedRegion } : {}),
        ...(selectedGender ? { Gender: selectedGender } : {}),
        ...(selectedPeriod ? { ExamingPeriod: selectedPeriod } : {}),
        ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
      }),
  });

  const students = studentsData?.items ?? [];
  const totalCount = studentsData?.totalCount ?? 0;
  const totalPages = studentsData?.totalPages ?? 1;

  /* ── Delete mutation ── */
  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentsApi.delete(id),
    onSuccess: () => {
      toast.success("Abiturient o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {
      toast.error("Abiturientni o'chirishda xatolik");
    },
  });

  function handleDelete(id: number) {
    if (!confirm("Rostdan ham bu abiturientni o'chirmoqchimisiz?")) return;
    deleteMutation.mutate(id);
  }

  /* ── Filter handlers ── */
  function handleRegionChange(val: number | null) {
    setSelectedRegion(val);
    setSelectedObject(null);
    setCurrentPage(1);
    regionDd.setOpen(false);
  }

  function handleGenderChange(val: number | null) {
    setSelectedGender(val);
    setCurrentPage(1);
    genderDd.setOpen(false);
  }

  function handlePeriodChange(val: number | null) {
    setSelectedPeriod(val);
    setCurrentPage(1);
    periodDd.setOpen(false);
  }

  function handleObjectChange(val: number | null) {
    setSelectedObject(val);
    setCurrentPage(1);
    objectDd.setOpen(false);
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* ── Filters ── */}
      <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
        {/* Viloyat dropdown */}
        <Dropdown
          open={regionDd.open}
          setOpen={regionDd.setOpen}
          dropdownRef={regionDd.ref}
          label="Viloyat"
          selectedLabel={
            selectedRegion ? regionLabels[selectedRegion as ERegion] : null
          }
        >
          <div className="absolute top-full left-0 mt-1 w-56 bg-card-bg border border-input-border rounded-lg shadow-xl z-50 max-h-64 overflow-auto scrollbar-hide">
            <button
              onClick={() => handleRegionChange(null)}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors"
            >
              Barchasi
            </button>
            {regionOptions.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRegionChange(r.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  r.value === selectedRegion
                    ? "text-accent bg-accent/10"
                    : "text-text-primary hover:bg-white/5"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Obyekt dropdown */}
        <Dropdown
          open={objectDd.open}
          setOpen={objectDd.setOpen}
          dropdownRef={objectDd.ref}
          label="Obyekt"
          selectedLabel={
            selectedObject
              ? (examObjects.find((o) => o.id === selectedObject)?.name ?? null)
              : null
          }
        >
          <div className="absolute top-full left-0 mt-1 w-64 bg-card-bg border border-input-border rounded-lg shadow-xl z-50 max-h-64 overflow-auto scrollbar-hide">
            <button
              onClick={() => handleObjectChange(null)}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors"
            >
              Barchasi
            </button>
            {filteredObjects.map((o) => (
              <button
                key={o.id}
                onClick={() => handleObjectChange(o.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  o.id === selectedObject
                    ? "text-accent bg-accent/10"
                    : "text-text-primary hover:bg-white/5"
                }`}
              >
                {o.name}
              </button>
            ))}
            {filteredObjects.length === 0 && (
              <div className="px-4 py-3 text-sm text-text-secondary">
                Obyekt topilmadi
              </div>
            )}
          </div>
        </Dropdown>

        {/* Jinsi dropdown */}
        <Dropdown
          open={genderDd.open}
          setOpen={genderDd.setOpen}
          dropdownRef={genderDd.ref}
          label="Jinsi"
          selectedLabel={
            selectedGender
              ? (genderOptions.find((g) => g.value === selectedGender)?.label ??
                null)
              : null
          }
        >
          <div className="absolute top-full left-0 mt-1 w-40 bg-card-bg border border-input-border rounded-lg shadow-xl z-50 max-h-64 overflow-auto scrollbar-hide">
            <button
              onClick={() => handleGenderChange(null)}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors"
            >
              Barchasi
            </button>
            {genderOptions.map((g) => (
              <button
                key={g.value}
                onClick={() => handleGenderChange(g.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  g.value === selectedGender
                    ? "text-accent bg-accent/10"
                    : "text-text-primary hover:bg-white/5"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Smena dropdown */}
        <Dropdown
          open={periodDd.open}
          setOpen={periodDd.setOpen}
          dropdownRef={periodDd.ref}
          label="Smena"
          selectedLabel={
            selectedPeriod
              ? (periodOptions.find((p) => p.value === selectedPeriod)?.label ??
                null)
              : null
          }
        >
          <div className="absolute top-full left-0 mt-1 w-56 bg-card-bg border border-input-border rounded-lg shadow-xl z-50 max-h-64 overflow-auto scrollbar-hide">
            <button
              onClick={() => handlePeriodChange(null)}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 transition-colors"
            >
              Barchasi
            </button>
            {periodOptions.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  p.value === selectedPeriod
                    ? "text-accent bg-accent/10"
                    : "text-text-primary hover:bg-white/5"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Qidirish"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-input-bg border border-input-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors w-50"
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="hidden bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
        >
          <span>Qo'shish</span>
          <Plus size={16} />
        </button>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 bg-card-bg rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={32} className="animate-spin text-accent" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-card-bg z-10">
                <tr className="border-b border-input-border">
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    F.I.SH
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Tug'ilgan sanasi
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Jinsi
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Imtihon sanasi
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Smenasi
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Sertifikat
                  </th>
                  <th className="text-right text-text-secondary font-medium text-sm px-6 py-4">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="border-b border-input-border/50 hover:bg-white/2 transition-colors cursor-pointer"
                  >
                    {/* Name + avatar */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {s.photoPath ? (
                          <img
                            src={`${API_BASE}/api/${s.photoPath}?token=${localStorage.getItem("token")}`}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-input-bg flex items-center justify-center text-text-secondary text-xs shrink-0">
                            {s.firstName?.charAt(0) ?? "?"}
                          </div>
                        )}
                        <span className="text-text-primary text-sm">
                          {s.lastName} {s.firstName}
                        </span>
                      </div>
                    </td>

                    {/* Birth date */}
                    <td className="px-6 py-3 text-text-primary text-sm font-medium">
                      {formatDate(s.birthDate)}
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-3">
                      <span
                        className={`text-sm font-medium ${
                          s.gender === EGender.Male
                            ? "text-accent"
                            : "text-emerald-400"
                        }`}
                      >
                        {s.gender === EGender.Male ? "Erkak" : "Ayol"}
                      </span>
                    </td>

                    {/* Exam date */}
                    <td className="px-6 py-3 text-text-primary text-sm font-medium">
                      {formatDate(s.examDate)}
                    </td>

                    {/* Period / shift */}
                    <td className="px-6 py-3">
                      <span className="text-emerald-400 text-xs border border-emerald-400/50 rounded-md px-3 py-1">
                        {s.examingPeriod}-smena
                      </span>
                    </td>

                    {/* Certificate */}
                    <td className="px-6 py-3 text-text-primary text-sm">
                      {s.certificateNumber || "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(s.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {students.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-text-secondary py-12 text-sm"
                    >
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-input-border px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-text-primary text-sm font-semibold">
            Umumiy: {totalCount.toLocaleString("ru-RU")}
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Create Modal ── */}
      <CreateStudentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* ── Student Detail Modal ── */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
