import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Search,
  Plus,
  CheckCircle2,
  Loader2,
  ClipboardList,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Pagination from "../components/Pagination";
import CreateCameraModal from "../components/cameras/CreateCameraModal";
import CreateDeviceModal from "../components/cameras/CreateDeviceModal";
import { camerasApi, examObjectApi, devicesApi } from "../api/cameras";
import { ERegion, regionLabels } from "../types/enums";
import type { Device } from "../types/cameras";

/* ── Sub-tabs ── */
const subTabs = ["Kameralar", "IVSS"] as const;

/* ── Region options for dropdown ── */
const regionOptions = Object.entries(ERegion).map(([, value]) => ({
  value: value as number,
  label: regionLabels[value as ERegion],
}));

/* ── Reusable dropdown hook ── */
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

/* ── Dropdown component to avoid ref-during-render lint ── */
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

export default function LocationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] =
    useState<(typeof subTabs)[number]>("Kameralar");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [ivssSearchQuery, setIvssSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateDeviceModal, setShowCreateDeviceModal] = useState(false);

  /* ── Filter state ── */
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);

  /* ── Dropdowns ── */
  const regionDd = useDropdown();
  const objectDd = useDropdown();

  /* ── Fetch exam objects ── */
  const { data: examObjects = [] } = useQuery({
    queryKey: ["examObjects"],
    queryFn: examObjectApi.getAll,
  });

  /* ── Fetch devices ── */
  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: devicesApi.getAll,
  });

  /* ── Build a device lookup map ── */
  const deviceMap = new Map<number, Device>();
  devices.forEach((d) => deviceMap.set(d.id, d));

  /* ── Filter exam objects by selected region ── */
  const filteredObjects = selectedRegion
    ? examObjects.filter((o) => o.regionId === selectedRegion)
    : examObjects;

  /* ── Fetch cameras ── */
  const { data: camerasData, isLoading } = useQuery({
    queryKey: [
      "cameras",
      currentPage,
      pageSize,
      selectedRegion,
      selectedObject,
      searchQuery,
    ],
    queryFn: () =>
      camerasApi.getAll({
        page: currentPage,
        pageSize,
        ...(selectedRegion ? { Region: selectedRegion } : {}),
        ...(selectedObject ? { ExamObjectId: selectedObject } : {}),
        ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
      }),
  });

  const cameras = camerasData?.items ?? [];
  const totalCount = camerasData?.totalCount ?? 0;
  const totalPages = camerasData?.totalPages ?? 1;

  /* ── Delete mutation ── */
  const deleteMutation = useMutation({
    mutationFn: ({
      listenId,
      channelId,
    }: {
      listenId: number;
      channelId: number;
    }) => camerasApi.delete(listenId, channelId),
    onSuccess: () => {
      toast.success("Kamera o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
    },
    onError: () => {
      toast.error("Kamerani o'chirishda xatolik");
    },
  });

  function handleDelete(cam: { deviceId: number; channelId: number }) {
    if (!confirm("Rostdan ham bu kamerani o'chirmoqchimisiz?")) return;
    deleteMutation.mutate({ listenId: cam.deviceId, channelId: cam.channelId });
  }

  /* ── Delete device mutation ── */
  const deleteDeviceMutation = useMutation({
    mutationFn: (listenId: number) => devicesApi.delete(listenId),
    onSuccess: () => {
      toast.success("IVSS o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: () => {
      toast.error("IVSS o'chirishda xatolik");
    },
  });

  function handleDeleteDevice(listenId: number) {
    if (!confirm("Rostdan ham bu IVSS ni o'chirmoqchimisiz?")) return;
    deleteDeviceMutation.mutate(listenId);
  }

  /* ── Filtered devices for IVSS tab ── */
  const filteredDevices = ivssSearchQuery.trim()
    ? devices.filter(
        (d) =>
          d.title.toLowerCase().includes(ivssSearchQuery.toLowerCase()) ||
          d.ivss?.address
            ?.toLowerCase()
            .includes(ivssSearchQuery.toLowerCase()),
      )
    : devices;

  /* ── Reset page on filter change ── */
  function handleRegionChange(val: number | null) {
    setSelectedRegion(val);
    setSelectedObject(null);
    setCurrentPage(1);
    regionDd.setOpen(false);
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
      {/* ── Sub-tabs + Filters row ── */}
      <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
        {/* Sub-tabs */}
        <div className="flex items-center gap-1 mr-4">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Kameralar" && (
          <>
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
                  ? (examObjects.find((o) => o.id === selectedObject)?.name ??
                    null)
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
          </>
        )}

        {activeTab === "IVSS" && (
          <div className="relative">
            <input
              type="text"
              placeholder="Qidirish"
              value={ivssSearchQuery}
              onChange={(e) => setIvssSearchQuery(e.target.value)}
              className="bg-input-bg border border-input-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/40 transition-colors w-50"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add button */}
        <button
          onClick={() =>
            activeTab === "Kameralar"
              ? setShowCreateModal(true)
              : setShowCreateDeviceModal(true)
          }
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
        >
          <span>Qo'shish</span>
          <Plus size={16} />
        </button>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 bg-card-bg rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto scrollbar-hide">
          {activeTab === "Kameralar" &&
            (isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={32} className="animate-spin text-accent" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-card-bg z-10">
                  <tr className="border-b border-input-border">
                    <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                      Nomi
                    </th>
                    <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                      IP manzili
                    </th>
                    <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                      Seriya raqami
                    </th>
                    <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                      Server nomi
                    </th>
                    <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                      Kamera holati
                    </th>
                    <th className="text-center text-text-secondary font-medium text-sm px-6 py-4">
                      Serverga qo'shilgan
                    </th>
                    <th className="text-center text-text-secondary font-medium text-sm px-6 py-4">
                      Channel ID
                    </th>
                    <th className="text-right text-text-secondary font-medium text-sm px-6 py-4">
                      Tahrirlash
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cameras.map((cam) => {
                    const device = deviceMap.get(cam.deviceId);
                    return (
                      <tr
                        key={cam.id}
                        className="border-b border-input-border/50 hover:bg-white/2 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-6 py-3.5 text-text-primary text-sm">
                          {cam.name}
                        </td>

                        {/* IP */}
                        <td className="px-6 py-3.5 text-text-primary text-sm">
                          {cam.ip}
                        </td>

                        {/* Serial */}
                        <td className="px-6 py-3.5 text-text-primary text-sm">
                          {cam.serialNumber}
                        </td>

                        {/* Server name (device ip) */}
                        <td className="px-6 py-3.5 text-text-primary text-sm">
                          {device?.ivss?.address ?? cam.deviceIp ?? "—"}
                        </td>

                        {/* Camera status: deviceIsOnline */}
                        <td className="px-6 py-3.5">
                          {cam.deviceIsOnline ? (
                            <span className="inline-block bg-emerald-500 text-white text-xs font-medium rounded-md px-3 py-1">
                              Aloqa bor
                            </span>
                          ) : (
                            <span className="inline-block bg-red-500 text-white text-xs font-medium rounded-md px-3 py-1">
                              Aloqa yo'q
                            </span>
                          )}
                        </td>

                        {/* Server connected: existsInIntegrator */}
                        <td className="px-6 py-3.5 text-center">
                          {cam.existsInIntegrator ? (
                            <CheckCircle2
                              size={20}
                              className="text-emerald-500 mx-auto"
                            />
                          ) : (
                            <Loader2
                              size={20}
                              className="text-text-secondary mx-auto animate-spin"
                            />
                          )}
                        </td>

                        {/* Channel ID */}
                        <td className="px-6 py-3.5 text-text-primary text-sm text-center">
                          {cam.channelId}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-accent hover:bg-white/5 transition-colors">
                              <ClipboardList size={16} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-accent hover:bg-white/5 transition-colors">
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(cam)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-red-400 hover:bg-white/5 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {cameras.length === 0 && !isLoading && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-text-secondary py-12 text-sm"
                      >
                        Ma'lumot topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ))}

          {/* ── IVSS Table ── */}
          {activeTab === "IVSS" && (
            <table className="w-full">
              <thead className="sticky top-0 bg-card-bg z-10">
                <tr className="border-b border-input-border">
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Sarlavha
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    IVSS manzili
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Port
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Foydalanuvchi
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Listen ID
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Alarm URL
                  </th>
                  <th className="text-left text-text-secondary font-medium text-sm px-6 py-4">
                    Turi
                  </th>
                  <th className="text-right text-text-secondary font-medium text-sm px-6 py-4">
                    Tahrirlash
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((dev) => (
                  <tr
                    key={dev.id}
                    className="border-b border-input-border/50 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-text-primary text-sm">
                      {dev.title}
                    </td>
                    <td className="px-6 py-3.5 text-text-primary text-sm">
                      {dev.ivss?.address ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-text-primary text-sm">
                      {dev.ivss?.port ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-text-primary text-sm">
                      {dev.ivss?.username ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-text-primary text-sm">
                      {dev.listenId}
                    </td>
                    <td className="px-6 py-3.5 text-text-primary text-sm truncate max-w-48">
                      {dev.alarmUrl || "—"}
                    </td>
                    <td className="px-6 py-3.5 text-text-primary text-sm">
                      {dev.type}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-accent hover:bg-white/5 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDevice(dev.listenId)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
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
            Umumiy:{" "}
            {activeTab === "Kameralar"
              ? totalCount.toLocaleString("ru-RU")
              : filteredDevices.length.toLocaleString("ru-RU")}
          </span>
          {activeTab === "Kameralar" && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ── Create Modals ── */}
      <CreateCameraModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <CreateDeviceModal
        open={showCreateDeviceModal}
        onClose={() => setShowCreateDeviceModal(false)}
      />
    </div>
  );
}
