const dotColors = {
  online: "bg-emerald-500",
  offline: "bg-red-500",
  pending: "bg-amber-500",
  unknown: "bg-slate-400",
} as const;

type DotStatus = keyof typeof dotColors;

export function StatusDot({
  status,
  pulse = true,
  size = "md",
}: {
  status: DotStatus;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = { sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3 w-3" };

  return (
    <span className="relative inline-flex">
      {pulse && status === "online" && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColors[status]} opacity-75`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full ${sizeMap[size]} ${dotColors[status]}`}
      />
    </span>
  );
}
