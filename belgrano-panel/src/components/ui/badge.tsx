const variants = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  error: "bg-red-50 text-red-700 ring-red-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  info: "bg-blue-50 text-blue-700 ring-blue-600/20",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/20",
  purple: "bg-purple-50 text-purple-700 ring-purple-600/20",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/20",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
} as const;

type BadgeVariant = keyof typeof variants;

export function Badge({
  variant = "info",
  children,
  className = "",
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
