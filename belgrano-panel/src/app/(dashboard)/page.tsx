import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/status-dot";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Screens",
      value: "70",
      detail: "Across 10 zones",
      color: "blue" as const,
    },
    {
      label: "Online Screens",
      value: "67",
      detail: "95.7% uptime",
      color: "emerald" as const,
    },
    {
      label: "Active Campaigns",
      value: "5",
      detail: "3 advertisers",
      color: "purple" as const,
    },
    {
      label: "Monthly Revenue",
      value: "$4.2M",
      detail: "CLP this month",
      color: "amber" as const,
    },
  ];

  const activityItems = [
    {
      action: "Campaign started",
      detail: "ISAPRE Consalud - Lobby displays",
      time: "2 hours ago",
      status: "online" as const,
    },
    {
      action: "Content approved",
      detail: "pharma-spot-march.mp4",
      time: "4 hours ago",
      status: "online" as const,
    },
    {
      action: "Screen offline",
      detail: "CLC-Urgencias-3 disconnected",
      time: "6 hours ago",
      status: "offline" as const,
    },
    {
      action: "Schedule updated",
      detail: "Morning rotation - Pediatria",
      time: "1 day ago",
      status: "pending" as const,
    },
    {
      action: "New advertiser",
      detail: "Laboratorio Chile added",
      time: "2 days ago",
      status: "online" as const,
    },
  ];

  const zones = [
    { zone: "Lobby Principal", screens: 7, online: 7 },
    { zone: "Urgencias", screens: 7, online: 7 },
    { zone: "Pediatria", screens: 7, online: 6 },
    { zone: "Cardiologia", screens: 7, online: 7 },
    { zone: "Traumatologia", screens: 7, online: 7 },
    { zone: "Maternidad", screens: 7, online: 7 },
    { zone: "Oncologia", screens: 7, online: 6 },
    { zone: "Cafeteria", screens: 7, online: 7 },
    { zone: "Pasillos Piso 1", screens: 7, online: 7 },
    { zone: "Pasillos Piso 2", screens: 7, online: 6 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your digital signage network
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            detail={stat.detail}
            color={stat.color}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader title="Recent Activity" />
          <div className="space-y-4">
            {activityItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="mt-1.5 flex-shrink-0">
                  <StatusDot status={item.status} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {item.action}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {item.detail}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Zone summary */}
        <Card>
          <CardHeader title="Screens by Zone" />
          <div className="space-y-3">
            {zones.map((z) => (
              <div
                key={z.zone}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-700">{z.zone}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    {z.online}/{z.screens}
                  </span>
                  <div className="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${(z.online / z.screens) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
