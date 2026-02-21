import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { camerasApi, examObjectApi, devicesApi } from "../../api/cameras";
import type { CreateCameraRequest } from "../../types/cameras";

interface Props {
  open: boolean;
  onClose: () => void;
}

const initialForm: CreateCameraRequest = {
  listenId: 0,
  examObjectId: 0,
  ip: "",
  name: "",
  description: "",
  latitude: 0,
  longitude: 0,
  port: 80,
  sn: "",
  username: "",
  password: "",
  remoteChannel: 0,
};

export default function CreateCameraModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateCameraRequest>({ ...initialForm });

  /* ── Reference data ── */
  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: devicesApi.getAll,
  });

  const { data: examObjects = [] } = useQuery({
    queryKey: ["examObjects"],
    queryFn: examObjectApi.getAll,
  });

  /* ── Create mutation ── */
  const { mutate, isPending } = useMutation({
    mutationFn: camerasApi.create,
    onSuccess: () => {
      toast.success("Kamera muvaffaqiyatli qo'shildi");
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      setForm({ ...initialForm });
      onClose();
    },
    onError: () => {
      toast.error("Kamera qo'shishda xatolik yuz berdi");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form);
  }

  function handleChange(
    field: keyof CreateCameraRequest,
    value: string | number,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-card-bg border border-input-border rounded-2xl w-full max-w-lg mx-4 max-h-[95vh] overflow-auto scrollbar-hide"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-input-border">
          <h2 className="text-text-primary text-lg font-semibold">
            Kamera qo'shish
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-text-secondary text-xs mb-1.5">
              Nomi
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="Hikvision"
            />
          </div>

          {/* IP + Port */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-text-secondary text-xs mb-1.5">
                IP manzil
              </label>
              <input
                required
                value={form.ip}
                onChange={(e) => handleChange("ip", e.target.value)}
                className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
                placeholder="192.168.1.26"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-1.5">
                Port
              </label>
              <input
                type="number"
                required
                value={form.port || ""}
                onChange={(e) => handleChange("port", +e.target.value)}
                className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
                placeholder="80"
              />
            </div>
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-text-secondary text-xs mb-1.5">
              Seriya raqami (SN)
            </label>
            <input
              required
              value={form.sn}
              onChange={(e) => handleChange("sn", e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="9J0D707GAJE73C"
            />
          </div>

          {/* Username + Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary text-xs mb-1.5">
                Login
              </label>
              <input
                required
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-1.5">
                Parol
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remote Channel */}
          <div>
            <label className="block text-text-secondary text-xs mb-1.5">
              Remote Channel
            </label>
            <input
              type="number"
              required
              value={form.remoteChannel || ""}
              onChange={(e) => handleChange("remoteChannel", +e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="1"
            />
          </div>

          {/* Device (listenId) */}
          <div>
            <label className="block text-text-secondary text-xs mb-1.5">
              Server (IVSS)
            </label>
            <select
              required
              value={form.listenId || ""}
              onChange={(e) => handleChange("listenId", +e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors appearance-none"
            >
              <option value="" disabled>
                Server tanlang
              </option>
              {devices.map((d) => (
                <option key={d.listenId} value={d.listenId}>
                  {d.title} ({d.ivss?.address ?? "—"})
                </option>
              ))}
            </select>
          </div>

          {/* Exam Object */}
          <div>
            <label className="block text-text-secondary text-xs mb-1.5">
              Imtihon obyekti
            </label>
            <select
              required
              value={form.examObjectId || ""}
              onChange={(e) => handleChange("examObjectId", +e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors appearance-none"
            >
              <option value="" disabled>
                Obyekt tanlang
              </option>
              {examObjects.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.regionName}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-text-secondary text-xs mb-1.5">
              Tavsif
            </label>
            <input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="Izoh..."
            />
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary text-xs mb-1.5">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude || ""}
                onChange={(e) => handleChange("latitude", +e.target.value)}
                className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-1.5">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude || ""}
                onChange={(e) => handleChange("longitude", +e.target.value)}
                className="w-full bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
