export default function DashboardPage() {
  const stats = [
    {
      label: "Total Screens",
      value: "70",
      detail: "Across 10 zones",
      color: "bg-blue-50 text-blue-700",
      iconColor: "text-blue-500",
    },
    {
      label: "Online Screens",
      value: "67",
      detail: "95.7% uptime",
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-500",
    },
    {
      label: "Active Campaigns",
      value: "5",
      detail: "3 advertisers",
      color: "bg-purple-50 text-purple-700",
      iconColor: "text-purple-500",
    },
    {
      label: "Monthly Revenue",
      value: "$4.2M",
      detail: "CLP this month",
      color: "bg-amber-50 text-amber-700",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your digital signage network
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${stat.color}`}
              >
                {stat.detail}
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-4 space-y-4">
            {[
              {
                action: "Campaign started",
                detail: "ISAPRE Consalud - Lobby displays",
                time: "2 hours ago",
              },
              {
                action: "Content approved",
                detail: "pharma-spot-march.mp4",
                time: "4 hours ago",
              },
              {
                action: "Screen offline",
                detail: "CLC-Urgencias-3 disconnected",
                time: "6 hours ago",
              },
              {
                action: "Schedule updated",
                detail: "Morning rotation - Pediatria",
                time: "1 day ago",
              },
              {
                action: "New advertiser",
                detail: "Laboratorio Chile added",
                time: "2 days ago",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.action}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {item.detail}
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone summary */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Screens by Zone
          </h3>
          <div className="mt-4 space-y-3">
            {[
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
            ].map((z) => (
              <div
                key={z.zone}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">{z.zone}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {z.online}/{z.screens}
                  </span>
                  <div className="h-2 w-16 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${(z.online / z.screens) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
