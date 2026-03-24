const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
  slate: "bg-slate-100 text-slate-600",
} as const;

type StatColor = keyof typeof colorMap;

export function StatCard({
  label,
  value,
  detail,
  color = "blue",
  icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  color?: StatColor;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon && (
          <div className={`rounded-lg p-2 ${colorMap[color]}`}>{icon}</div>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {detail && (
        <p className="mt-1 text-sm text-slate-500">{detail}</p>
      )}
    </div>
  );
}
