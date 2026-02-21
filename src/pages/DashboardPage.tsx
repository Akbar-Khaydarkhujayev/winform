import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { dashboardApi } from "../api/dashboard";
import { useSignalREvents } from "../hooks/useSignalR";
import { ERegion, EExamingPeriod } from "../types/enums";
import StatsLineChart from "../components/dashboard/StatsLineChart";
import CamerasCard from "../components/dashboard/CamerasCard";
import ObjectsCard from "../components/dashboard/ObjectsCard";
import GenderCard from "../components/dashboard/GenderCard";
import ShiftsCard from "../components/dashboard/ShiftsCard";
import UzbekistanMap from "../components/dashboard/UzbekistanMap";
import EventCard from "../components/dashboard/EventCard";

export default function DashboardPage() {
  const [regionId, setRegionId] = useState<ERegion>(ERegion.Tashkent);
  const [period, setPeriod] = useState<EExamingPeriod | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", regionId, today, period],
    queryFn: () =>
      dashboardApi.getData({ region: regionId, date: today, period }),
  });

  const events = useSignalREvents(regionId);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
      {/* ── Left Column ── */}
      <div className="col-span-3 flex flex-col gap-4 min-h-0">
        <div className="flex-3 min-h-0">
          <StatsLineChart data={data} />
        </div>
        <div className="flex-2 min-h-0">
          <CamerasCard data={data} />
        </div>
        <div className="flex-2 min-h-0">
          <ObjectsCard data={data} />
        </div>
      </div>

      {/* ── Center Column ── */}
      <div className="col-span-6 flex flex-col gap-4 min-h-0">
        {/* Gender cards + Shifts */}
        <div className="flex gap-4 w-full shrink-0">
          <div className="flex flex-col gap-2 w-full">
            <GenderCard data={data} type="male" />
            <GenderCard data={data} type="female" />
          </div>
          <div className="w-full">
            <ShiftsCard selected={period} onChange={setPeriod} />
          </div>
        </div>

        {/* Map — fills remaining space */}
        <div className="flex-1 min-h-0">
          <UzbekistanMap
            selectedRegion={regionId}
            onRegionClick={setRegionId}
          />
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="col-span-3 flex flex-col gap-4 min-h-0">
        {events.length > 0 ? (
          events.map((event, idx) => (
            <EventCard key={event.certificateNumber ?? idx} event={event} />
          ))
        ) : (
          <div className="bg-card-bg rounded-2xl p-6 text-center flex-1 flex flex-col items-center justify-center">
            <p className="text-text-secondary text-sm">
              Hodisalar kutilmoqda...
            </p>
            <p className="text-text-secondary/50 text-xs mt-1">
              SignalR orqali ma'lumotlar keladi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
