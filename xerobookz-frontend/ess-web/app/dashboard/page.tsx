"use client";

import { LayoutShell, PageHeader, Card, Badge, IconBox } from "@xerobookz/ui-shared";
import { useAuth } from "@/hooks/useAuth";

export default function ESSDashboard() {
  const { user } = useAuth();

  const alerts = [
    { type: "document", message: "Passport expiring in 30 days", urgent: true, icon: "files" as const },
    { type: "timesheet", message: "Timesheet pending submission", urgent: false, icon: "clock" as const },
    { type: "immigration", message: "I-983 report due", urgent: true, icon: "plane" as const },
  ];

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
        currentPath: "/dashboard",
        onNavigate: (href) => (window.location.href = href),
      }}
      topNav={{
        user: user || undefined,
      }}
    >
      <PageHeader
        title="My Dashboard"
        description="Your personal workspace and important updates"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert, idx) => (
          <Card
            key={idx}
            variant="floating"
            hover
            className="p-6 group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <IconBox
                icon={alert.icon}
                size="md"
                variant={alert.urgent ? "primary" : "accent"}
                gradient
                className="group-hover:scale-110 transition-transform duration-300"
              />
              {alert.urgent && (
                <Badge variant="danger" className="animate-pulse">
                  Urgent
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 mb-2 capitalize">
              {alert.type}
            </h3>
            <p className="text-grey-600">{alert.message}</p>
          </Card>
        ))}
      </div>
    </LayoutShell>
  );
}
