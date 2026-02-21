import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { SignalREvent } from "../types/dashboard";

const API_BASE = "http://192.168.77.16:5050";

export function useSignalREvents(regionId: number, maxEvents = 4) {
  const [events, setEvents] = useState<SignalREvent[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const addEvent = useCallback(
    (event: SignalREvent) => {
      console.log("Received event:", event);
      setEvents((prev) => [event, ...prev].slice(0, maxEvents));
    },
    [maxEvents],
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/events`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on("eventReceived", (eventDto: SignalREvent) => {
      addEvent(eventDto);
    });

    connection
      .start()
      .then(() => connection.invoke("SubscribeRegion", regionId))
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection
        .invoke("UnsubscribeRegion", regionId)
        .catch(() => {})
        .finally(() => connection.stop());
    };
  }, [regionId, addEvent]);

  return events;
}
