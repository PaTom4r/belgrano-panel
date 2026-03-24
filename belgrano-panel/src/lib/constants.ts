// Chart colors — single source of truth
export const CHART_COLORS = [
  "#2563eb", // blue-600
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ef4444", // red-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
] as const;

// CLP formatter
export const clpFormat = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

// Number formatter
export const numberFormat = new Intl.NumberFormat("es-CL");

// Zone names
export const ZONES = [
  "Lobby Principal",
  "Urgencias",
  "Pediatría",
  "Cardiología",
  "Traumatología",
  "Maternidad",
  "Oncología",
  "Cafetería",
  "Pasillos Piso 1",
  "Pasillos Piso 2",
] as const;
