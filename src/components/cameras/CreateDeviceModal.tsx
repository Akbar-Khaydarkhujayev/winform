import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { devicesApi } from "../../api/cameras";
import type { CreateDeviceRequest } from "../../types/cameras";

interface Props {
  open: boolean;
  onClose: () => void;
}

const initialForm: CreateDeviceRequest = {
  title: "",
  listen: 0,
  alarmUrl: "",
  type: 0,
  ivss: {
    address: "",
    port: 37777,
    username: "",
    password: "",
  },
};

export default function CreateDeviceModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateDeviceRequest>({ ...initialForm });

  /* ── Create mutation ── */
  const { mutate, isPending } = useMutation({
    mutationFn: devicesApi.create,
    onSuccess: () => {
      toast.success("IVSS muvaffaqiyatli qo'shildi");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      setForm({ ...initialForm });
      onClose();
    },
    onError: () => {
      toast.error("IVSS qo'shishda xatolik yuz berdi");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Sarlavha kiritilmagan");
      return;
    }
    if (!form.ivss.address.trim()) {
      toast.error("IVSS manzil kiritilmagan");
      return;
    }
    mutate(form);
  }

  function set<K extends keyof CreateDeviceRequest>(
    key: K,
    val: CreateDeviceRequest[K],
  ) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function setIvss(key: string, val: string | number) {
    setForm((p) => ({ ...p, ivss: { ...p.ivss, [key]: val } }));
  }

  if (!open) return null;

  const inputCls =
    "w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors";
  const labelCls = "block text-text-secondary text-xs mb-1.5 font-medium";

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
            Yangi IVSS qo'shish
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
          {/* Title */}
          <div>
            <label className={labelCls}>Sarlavha *</label>
            <input
              className={inputCls}
              placeholder="IVSS nomi"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* Listen ID & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Listen ID</label>
              <input
                className={inputCls}
                type="number"
                placeholder="0"
                value={form.listen || ""}
                onChange={(e) => set("listen", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelCls}>Turi (type)</label>
              <input
                className={inputCls}
                type="number"
                placeholder="0"
                value={form.type || ""}
                onChange={(e) => set("type", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Alarm URL */}
          <div>
            <label className={labelCls}>Alarm URL</label>
            <input
              className={inputCls}
              placeholder="http://..."
              value={form.alarmUrl}
              onChange={(e) => set("alarmUrl", e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-input-border pt-4">
            <h3 className="text-text-primary text-sm font-medium mb-3">
              IVSS ma'lumotlari
            </h3>
          </div>

          {/* IVSS Address */}
          <div>
            <label className={labelCls}>Manzil (address) *</label>
            <input
              className={inputCls}
              placeholder="192.168.1.100"
              value={form.ivss.address}
              onChange={(e) => setIvss("address", e.target.value)}
            />
          </div>

          {/* IVSS Port & Username */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Port</label>
              <input
                className={inputCls}
                type="number"
                placeholder="37777"
                value={form.ivss.port || ""}
                onChange={(e) => setIvss("port", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelCls}>Foydalanuvchi</label>
              <input
                className={inputCls}
                placeholder="admin"
                value={form.ivss.username}
                onChange={(e) => setIvss("username", e.target.value)}
              />
            </div>
          </div>

          {/* IVSS Password */}
          <div>
            <label className={labelCls}>Parol</label>
            <input
              className={inputCls}
              type="password"
              placeholder="••••••••"
              value={form.ivss.password}
              onChange={(e) => setIvss("password", e.target.value)}
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
