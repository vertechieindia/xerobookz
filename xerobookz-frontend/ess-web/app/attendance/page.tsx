"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutShell, PageHeader, Card, Button, Badge } from "@xerobookz/ui-shared";
import { useAuth } from "@/hooks/useAuth";
import { attendanceApi, employeeApi } from "@xerobookz/api-clients";
import type { AttendanceEvent } from "@xerobookz/api-clients";

type StatusHint = "off" | "working" | "on_break";

/** Events after the last PUNCH_OUT (open session), same rule as the backend state machine. */
function currentSessionEvents(events: AttendanceEvent[]): AttendanceEvent[] {
  const ordered = [...events].sort(
    (a, b) => new Date(a.timestamp_utc).getTime() - new Date(b.timestamp_utc).getTime()
  );
  let lastPo = -1;
  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i].event_type === "PUNCH_OUT") lastPo = i;
  }
  return ordered.slice(lastPo + 1);
}

function deriveStatus(events: AttendanceEvent[]): StatusHint {
  const ordered = currentSessionEvents(events).sort(
    (a, b) => new Date(a.timestamp_utc).getTime() - new Date(b.timestamp_utc).getTime()
  );
  let s: StatusHint = "off";
  for (const e of ordered) {
    switch (e.event_type) {
      case "PUNCH_IN":
        s = "working";
        break;
      case "PUNCH_OUT":
        s = "off";
        break;
      case "BREAK_IN":
        s = "on_break";
        break;
      case "BREAK_OUT":
        s = "working";
        break;
      default:
        break;
    }
  }
  return s;
}

export default function EssAttendancePage() {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [events, setEvents] = useState<AttendanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>("");

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const refresh = useCallback(async (empId: string) => {
    const [st, ev] = await Promise.all([
      attendanceApi.getSettings(),
      attendanceApi.getMyEvents(empId),
    ]);
    if (st.success && st.data) setEnabled(st.data.enable_realtime_attendance);
    if (ev.success && ev.data) setEvents(ev.data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const me = await employeeApi.getMyEmployee();
        if (!me.success || !me.data) {
          if (!cancelled) setMsg("No employee profile is linked to your account yet.");
          return;
        }
        const id = me.data.id;
        if (!cancelled) setEmployeeId(id);
        await refresh(id);
      } catch {
        if (!cancelled) setMsg("Could not load attendance data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const status = deriveStatus(events);
  const sessionEv = currentSessionEvents(events);
  const last = sessionEv.length
    ? [...sessionEv].sort(
        (a, b) => new Date(b.timestamp_utc).getTime() - new Date(a.timestamp_utc).getTime()
      ).slice(-1)[0]
    : null;

  const gatherGeo = async (): Promise<{
    geo_latitude?: number;
    geo_longitude?: number;
    geo_address?: string;
  }> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("Geolocation not available — continuing without coordinates.");
      return {};
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoStatus(
            `Location captured (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
          );
          resolve({
            geo_latitude: pos.coords.latitude,
            geo_longitude: pos.coords.longitude,
          });
        },
        () => {
          setGeoStatus("Location denied or unavailable — punch will still be recorded.");
          resolve({});
        },
        { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
      );
    });
  };

  const punch = async (event_type: "PUNCH_IN" | "PUNCH_OUT" | "BREAK_IN" | "BREAK_OUT") => {
    if (!employeeId) return;
    setMsg(null);
    const geo = await gatherGeo();
    const res = await attendanceApi.punch({
      event_type,
      employee_id: employeeId,
      timezone: tz,
      source: "web",
      ...geo,
    });
    if (res.success) {
      setMsg(res.message || "Recorded");
      await refresh(employeeId);
    } else {
      setMsg(res.error?.details || res.message || "Request failed");
    }
  };

  const statusLabel =
    status === "off"
      ? "Off clock"
      : status === "working"
        ? "Working"
        : "On break";

  const sidebarItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Documents", href: "/documents" },
    { label: "Timesheets", href: "/timesheets" },
    { label: "Attendance", href: "/attendance" },
  ];

  return (
    <LayoutShell
      sidebar={{
        items: sidebarItems,
        currentPath: "/attendance",
        onNavigate: (href) => (window.location.href = href),
      }}
      topNav={{ user: user || undefined }}
    >
      <PageHeader
        title="Attendance"
        description="Punch in and out in real time. Location is requested only when you tap a button."
      />

      {loading && <p className="text-grey-600">Loading…</p>}
      {!loading && enabled === false && (
        <Card variant="floating" className="p-6 mb-6">
          <p className="text-secondary-800">
            Your organization has not enabled real-time attendance. You can continue to use
            standard timesheets.
          </p>
        </Card>
      )}

      {!loading && enabled && employeeId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card variant="floating" className="p-6">
              <p className="text-sm text-grey-600 mb-1">Status</p>
              <Badge variant={status === "off" ? "default" : "success"}>{statusLabel}</Badge>
            </Card>
            <Card variant="floating" className="p-6">
              <p className="text-sm text-grey-600 mb-1">Last event</p>
              <p className="font-medium text-secondary-800">
                {last
                  ? `${last.event_type} · ${new Date(last.timestamp_utc).toLocaleString()}`
                  : "None yet"}
              </p>
            </Card>
            <Card variant="floating" className="p-6">
              <p className="text-sm text-grey-600 mb-1">Timezone</p>
              <p className="font-mono text-sm">{tz}</p>
            </Card>
          </div>

          <Card variant="floating" className="p-6 mb-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => punch("PUNCH_IN")}>
                Punch In
              </Button>
              <Button variant="secondary" onClick={() => punch("BREAK_IN")}>
                Break In
              </Button>
              <Button variant="secondary" onClick={() => punch("BREAK_OUT")}>
                Break Out
              </Button>
              <Button variant="outline" onClick={() => punch("PUNCH_OUT")}>
                Punch Out
              </Button>
            </div>
            {geoStatus && <p className="text-sm text-grey-600 mt-4">{geoStatus}</p>}
            {msg && <p className="text-sm text-info-700 mt-2">{msg}</p>}
          </Card>
        </>
      )}

      {msg && !enabled && <p className="text-sm text-warning-700">{msg}</p>}
    </LayoutShell>
  );
}
