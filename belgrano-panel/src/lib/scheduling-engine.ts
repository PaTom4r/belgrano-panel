export interface ScheduleRule {
  id: string;
  name: string;
  playlistId: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  daysOfWeek: number[]; // 1=Mon ... 7=Sun
  priority: number; // higher = overrides lower
  zoneIds: string[];
  isClinicContent: boolean;
}

/**
 * Parse "HH:mm" into total minutes since midnight.
 */
function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Convert JS Date.getDay() (0=Sun) to ISO weekday (1=Mon ... 7=Sun).
 */
function toIsoWeekday(jsDay: number): number {
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * Check if a time (in minutes since midnight) falls within a start-end range.
 * Handles overnight ranges (e.g., 22:00 - 06:00).
 */
function isTimeInRange(now: number, start: number, end: number): boolean {
  if (start <= end) {
    return now >= start && now < end;
  }
  // overnight: e.g. 22:00-06:00
  return now >= start || now < end;
}

/**
 * Returns the highest-priority matching schedule for a given zone and time.
 * Returns null if no schedule matches.
 */
export function getActiveSchedule(
  rules: ScheduleRule[],
  zoneId: string,
  now: Date
): ScheduleRule | null {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDay = toIsoWeekday(now.getDay());

  const matching = rules.filter((rule) => {
    // Check zone match (empty zoneIds = all zones)
    if (rule.zoneIds.length > 0 && !rule.zoneIds.includes(zoneId)) {
      return false;
    }

    // Check day of week
    if (!rule.daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Check time range
    const start = parseTime(rule.startTime);
    const end = parseTime(rule.endTime);
    return isTimeInRange(currentMinutes, start, end);
  });

  if (matching.length === 0) return null;

  // Return highest priority
  matching.sort((a, b) => b.priority - a.priority);
  return matching[0];
}

/**
 * Mock schedule rules for development — CLC operates two blocks:
 * 1. Clinic content (health tips, wayfinding) during morning hours
 * 2. Advertiser content (ISAPRE, pharma, insurance) during peak traffic
 */
export function getMockScheduleRules(): ScheduleRule[] {
  return [
    {
      id: "sched-001",
      name: "Morning Clinic Info",
      playlistId: "pl-clinic-morning",
      startTime: "06:00",
      endTime: "10:00",
      daysOfWeek: [1, 2, 3, 4, 5],
      priority: 10,
      zoneIds: [],
      isClinicContent: true,
    },
    {
      id: "sched-002",
      name: "Peak Hours Ads",
      playlistId: "pl-ads-peak",
      startTime: "10:00",
      endTime: "18:00",
      daysOfWeek: [1, 2, 3, 4, 5],
      priority: 20,
      zoneIds: [],
      isClinicContent: false,
    },
    {
      id: "sched-003",
      name: "Evening Mix",
      playlistId: "pl-mix-evening",
      startTime: "18:00",
      endTime: "22:00",
      daysOfWeek: [1, 2, 3, 4, 5],
      priority: 10,
      zoneIds: [],
      isClinicContent: false,
    },
    {
      id: "sched-004",
      name: "Weekend Rotation",
      playlistId: "pl-weekend",
      startTime: "08:00",
      endTime: "20:00",
      daysOfWeek: [6, 7],
      priority: 10,
      zoneIds: [],
      isClinicContent: false,
    },
    {
      id: "sched-005",
      name: "Lobby Priority Ads",
      playlistId: "pl-lobby-premium",
      startTime: "10:00",
      endTime: "14:00",
      daysOfWeek: [1, 2, 3, 4, 5],
      priority: 30,
      zoneIds: ["zone-lobby"],
      isClinicContent: false,
    },
    {
      id: "sched-006",
      name: "Night Fallback",
      playlistId: "pl-night",
      startTime: "22:00",
      endTime: "06:00",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      priority: 5,
      zoneIds: [],
      isClinicContent: true,
    },
  ];
}
