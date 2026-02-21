import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { studentsApi } from "../../api/students";
import type { CreateStudentRequest } from "../../types/students";
import { EGender, EExamingPeriod } from "../../types/enums";

interface Props {
  open: boolean;
  onClose: () => void;
}

const initialForm: CreateStudentRequest = {
  firstName: "",
  lastName: "",
  certificateNumber: "",
  birthDate: "",
  gender: EGender.Male,
  groupCode: "",
  examDate: "",
  examingPeriod: EExamingPeriod.First,
  listenId: "",
};

export default function CreateStudentModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateStudentRequest>({ ...initialForm });

  const { mutate, isPending } = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      toast.success("Abiturient muvaffaqiyatli qo'shildi");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setForm({ ...initialForm });
      onClose();
    },
    onError: () => {
      toast.error("Abiturient qo'shishda xatolik yuz berdi");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Ism va familiya kiritilmagan");
      return;
    }
    if (!form.certificateNumber.trim()) {
      toast.error("Sertifikat raqami kiritilmagan");
      return;
    }
    mutate(form);
  }

  function set<K extends keyof CreateStudentRequest>(
    key: K,
    val: CreateStudentRequest[K],
  ) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  if (!open) return null;

  const inputCls =
    "w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors";
  const labelCls = "block text-text-secondary text-xs mb-1.5 font-medium";
  const selectCls =
    "w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors appearance-none";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-card-bg border border-input-border rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-input-border">
          <h2 className="text-text-primary text-base font-semibold">
            Yangi abiturient qo'shish
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-auto scrollbar-hide">
          {/* First & Last name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Ism *</label>
              <input
                className={inputCls}
                placeholder="Ism"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Familiya *</label>
              <input
                className={inputCls}
                placeholder="Familiya"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Certificate number */}
          <div>
            <label className={labelCls}>Sertifikat raqami *</label>
            <input
              className={inputCls}
              placeholder="AB1234567"
              value={form.certificateNumber}
              onChange={(e) => set("certificateNumber", e.target.value)}
            />
          </div>

          {/* Birth date & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tug'ilgan sanasi</label>
              <input
                className={inputCls}
                type="date"
                value={form.birthDate ? form.birthDate.split("T")[0] : ""}
                onChange={(e) =>
                  set(
                    "birthDate",
                    e.target.value ? `${e.target.value}T00:00:00.000Z` : "",
                  )
                }
              />
            </div>
            <div>
              <label className={labelCls}>Jinsi</label>
              <select
                className={selectCls}
                value={form.gender}
                onChange={(e) => set("gender", Number(e.target.value))}
              >
                <option value={EGender.Male}>Erkak</option>
                <option value={EGender.Female}>Ayol</option>
              </select>
            </div>
          </div>

          {/* Group code */}
          <div>
            <label className={labelCls}>Guruh kodi</label>
            <input
              className={inputCls}
              placeholder="Guruh kodi"
              value={form.groupCode}
              onChange={(e) => set("groupCode", e.target.value)}
            />
          </div>

          {/* Exam date & Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Imtihon sanasi</label>
              <input
                className={inputCls}
                type="date"
                value={form.examDate ? form.examDate.split("T")[0] : ""}
                onChange={(e) =>
                  set(
                    "examDate",
                    e.target.value ? `${e.target.value}T00:00:00.000Z` : "",
                  )
                }
              />
            </div>
            <div>
              <label className={labelCls}>Smena</label>
              <select
                className={selectCls}
                value={form.examingPeriod}
                onChange={(e) => set("examingPeriod", Number(e.target.value))}
              >
                <option value={EExamingPeriod.First}>1-smena</option>
                <option value={EExamingPeriod.Second}>2-smena</option>
                <option value={EExamingPeriod.Third}>3-smena</option>
              </select>
            </div>
          </div>

          {/* Listen ID */}
          <div>
            <label className={labelCls}>Listen ID</label>
            <input
              className={inputCls}
              placeholder="Listen ID"
              value={form.listenId}
              onChange={(e) => set("listenId", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-input-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
}
