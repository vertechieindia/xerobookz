"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutShell,
  PageHeader,
  Card,
  Button,
  Table,
  Badge,
} from "@xerobookz/ui-shared";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { attendanceApi, employeeApi } from "@xerobookz/api-clients";
import type { AttendanceEvent } from "@xerobookz/api-clients";
import type { Employee } from "@xerobookz/api-clients";

function startOfWeekIso(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export default function AttendanceDashboardPage() {
  const { user, logout } = useAuth();
  const { currentTenant } = useTenant();
  const [events, setEvents] = useState<AttendanceEvent[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [from, setFrom] = useState(startOfWeekIso);
  const [to, setTo] = useState(() => new Date().toISOString());
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [st, ev, em] = await Promise.all([
          attendanceApi.getSettings(),
          attendanceApi.getCompanyEvents({ from_date: from, to_date: to }),
          employeeApi.getEmployees(),
        ]);
        if (st.success && st.data) setEnabled(st.data.enable_realtime_attendance);
        if (ev.success && ev.data) setEvents(ev.data);
        else if (!ev.success) setError(ev.error?.details || "Could not load events");
        if (em.success && em.data) setEmployees(em.data);
      } catch (e) {
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    })();
  }, [from, to]);

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of employees) {
      m.set(
        e.id,
        [e.first_name, e.last_name].filter(Boolean).join(" ") || e.email || e.id
      );
    }
    return m;
  }, [employees]);

  const sidebarItems = [
    { label: "Recruiting Dashboard", href: "/recruiting/dashboard" },
    { label: "Jobs", href: "/recruiting/jobs" },
    { label: "Applications", href: "/recruiting/applications" },
    { label: "Performance Dashboard", href: "/performance/dashboard" },
    { label: "Performance Reviews", href: "/performance/reviews" },
    { label: "HRIS Employees", href: "/hris/employees" },
    { label: "Surveys", href: "/surveys/dashboard" },
    { label: "LMS Portal", href: "/lms/portal" },
    { label: "Expenses", href: "/expenses/management" },
    { label: "Attendance", href: "/attendance/dashboard" },
  ];

  const punchIns = events.filter((e) => e.event_type === "PUNCH_IN").length;
  const punchOuts = events.filter((e) => e.event_type === "PUNCH_OUT").length;

  return (
    <LayoutShell
      sidebar={{
        items: sidebarItems,
        currentPath: "/attendance/dashboard",
        onNavigate: (href) => (window.location.href = href),
      }}
      topNav={{
        user: user || undefined,
        tenant: currentTenant || undefined,
        onLogout: logout,
      }}
    >
      <PageHeader
        title="Attendance"
        description="Real-time punch events with IP and geo capture (when enabled for your organization)"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card variant="floating" className="p-4">
          <p className="text-sm text-grey-600">Realtime attendance</p>
          <p className="text-lg font-semibold text-secondary-800">
            {enabled === null ? "…" : enabled ? "Enabled" : "Disabled"}
          </p>
        </Card>
        <Card variant="floating" className="p-4">
          <p className="text-sm text-grey-600">Punch-ins (range)</p>
          <p className="text-2xl font-bold text-secondary-700">{punchIns}</p>
        </Card>
        <Card variant="floating" className="p-4">
          <p className="text-sm text-grey-600">Punch-outs (range)</p>
          <p className="text-2xl font-bold text-secondary-700">{punchOuts}</p>
        </Card>
      </div>

      <Card variant="floating" className="p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-grey-600 mb-1">From (UTC)</label>
            <input
              type="datetime-local"
              className="border border-grey-200 rounded px-2 py-1 text-sm"
              value={from.slice(0, 16)}
              onChange={(e) => setFrom(new Date(e.target.value).toISOString())}
            />
          </div>
          <div>
            <label className="block text-xs text-grey-600 mb-1">To (UTC)</label>
            <input
              type="datetime-local"
              className="border border-grey-200 rounded px-2 py-1 text-sm"
              value={to.slice(0, 16)}
              onChange={(e) => setTo(new Date(e.target.value).toISOString())}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setFrom(startOfWeekIso());
              setTo(new Date().toISOString());
            }}
          >
            This week
          </Button>
        </div>
        {error && <p className="text-sm text-danger-600 mt-3">{error}</p>}
      </Card>

      <Card variant="floating" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-grey-100">
          <h3 className="font-semibold text-secondary-800">Event log</h3>
          <p className="text-sm text-grey-600">
            Filtered by date range. IP and coordinates are stored for compliance review.
          </p>
        </div>
        {loading ? (
          <p className="p-6 text-grey-600">Loading…</p>
        ) : (
          <Table
            columns={[
              { key: "employee", label: "Employee" },
              { key: "type", label: "Event" },
              { key: "when", label: "Time (UTC)" },
              { key: "ip", label: "IP" },
              { key: "geo", label: "Location" },
            ]}
            data={events.map((e) => ({
              employee: nameById.get(e.employee_id) || e.employee_id,
              type: (
                <Badge variant="primary" className="uppercase text-[10px]">
                  {e.event_type.replace("_", " ")}
                </Badge>
              ),
              when: new Date(e.timestamp_utc).toLocaleString(),
              ip: e.ip_address || "—",
              geo:
                e.geo_latitude != null && e.geo_longitude != null
                  ? `${e.geo_latitude.toFixed(4)}, ${e.geo_longitude.toFixed(4)}`
                  : "—",
            }))}
          />
        )}
      </Card>
    </LayoutShell>
  );
}
