// Priority level constants
export const PRIORITY_LEVELS = {
  emergency: 100,
  campaign: 50,
  default: 10,
  fallback: 1,
} as const;

export type PriorityLevel = keyof typeof PRIORITY_LEVELS;

export function getPriorityLabel(priority: number): PriorityLevel {
  if (priority >= 100) return "emergency";
  if (priority >= 50) return "campaign";
  if (priority >= 10) return "default";
  return "fallback";
}

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
  // --- New fields (Phase 9) ---
  dateRange?: { startDate: string; endDate: string }; // YYYY-MM-DD
  screenIds?: string[]; // target specific screens
  screenGroupIds?: string[]; // target screen groups
  isEmergency?: boolean; // immediately overrides everything
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
 * Check if a date falls within a date range (inclusive).
 */
function isDateInRange(
  now: Date,
  range: { startDate: string; endDate: string }
): boolean {
  const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return dateStr >= range.startDate && dateStr <= range.endDate;
}

/**
 * Returns all matching schedules for a given zone/screen and time,
 * sorted by priority (highest first).
 */
export function getMatchingSchedules(
  rules: ScheduleRule[],
  options: {
    zoneId?: string;
    screenId?: string;
    now: Date;
  }
): ScheduleRule[] {
  const { zoneId, screenId, now } = options;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDay = toIsoWeekday(now.getDay());

  const matching = rules.filter((rule) => {
    // Emergency rules always match (bypass zone/screen filtering)
    if (!rule.isEmergency) {
      // Check zone match (empty zoneIds = all zones)
      if (
        rule.zoneIds.length > 0 &&
        zoneId &&
        !rule.zoneIds.includes(zoneId)
      ) {
        return false;
      }

      // Check screen match (empty/undefined = all screens)
      if (
        rule.screenIds &&
        rule.screenIds.length > 0 &&
        screenId &&
        !rule.screenIds.includes(screenId)
      ) {
        return false;
      }
    }

    // Check date range (if specified)
    if (rule.dateRange && !isDateInRange(now, rule.dateRange)) {
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

  // Sort: emergency first, then by priority descending
  matching.sort((a, b) => {
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;
    return b.priority - a.priority;
  });

  return matching;
}

/**
 * Returns the highest-priority matching schedule for a given zone and time.
 * Returns null if no schedule matches.
 *
 * Backwards compatible with Phase 6 usage.
 */
export function getActiveSchedule(
  rules: ScheduleRule[],
  zoneId: string,
  now: Date
): ScheduleRule | null {
  const matching = getMatchingSchedules(rules, { zoneId, now });
  return matching.length > 0 ? matching[0] : null;
}

/**
 * Test what schedule would be active for a given zone/screen at a given time.
 * Useful for the "Test Schedule" feature in the UI.
 */
export function testScheduleAt(
  rules: ScheduleRule[],
  options: {
    zoneId?: string;
    screenId?: string;
    testTime: Date;
  }
): {
  activeSchedule: ScheduleRule | null;
  allMatching: ScheduleRule[];
  overriddenSchedules: ScheduleRule[];
} {
  const allMatching = getMatchingSchedules(rules, {
    zoneId: options.zoneId,
    screenId: options.screenId,
    now: options.testTime,
  });

  return {
    activeSchedule: allMatching[0] ?? null,
    allMatching,
    overriddenSchedules: allMatching.slice(1),
  };
}

/**
 * Mock schedule rules for development -- CLC operates two blocks:
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

/**
 * Extended mock rules including Phase 9 conditional scheduling features.
 */
export function getAdvancedMockScheduleRules(): ScheduleRule[] {
  return [
    {
      id: "adv-001",
      name: "Emergency Alert",
      playlistId: "pl-emergency",
      startTime: "00:00",
      endTime: "23:59",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      priority: PRIORITY_LEVELS.emergency,
      zoneIds: [],
      isClinicContent: true,
      isEmergency: true,
    },
    {
      id: "adv-002",
      name: "Warner Bros Launch Week",
      playlistId: "pl-warner-launch",
      startTime: "09:00",
      endTime: "21:00",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      priority: PRIORITY_LEVELS.campaign,
      zoneIds: ["zone-lobby", "zone-cafeteria"],
      isClinicContent: false,
      dateRange: { startDate: "2026-03-25", endDate: "2026-03-31" },
    },
    {
      id: "adv-003",
      name: "ISAPRE Colmena Campaign",
      playlistId: "pl-colmena",
      startTime: "08:00",
      endTime: "20:00",
      daysOfWeek: [1, 2, 3, 4, 5],
      priority: PRIORITY_LEVELS.campaign,
      zoneIds: [],
      isClinicContent: false,
      screenIds: ["screen-lobby-1", "screen-lobby-2", "screen-hallway-1"],
    },
    {
      id: "adv-004",
      name: "Morning Clinic Content",
      playlistId: "pl-clinic-morning",
      startTime: "07:00",
      endTime: "12:00",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      priority: PRIORITY_LEVELS.default,
      zoneIds: [],
      isClinicContent: true,
    },
    {
      id: "adv-005",
      name: "Afternoon Ads Mix",
      playlistId: "pl-ads-afternoon",
      startTime: "12:00",
      endTime: "18:00",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      priority: PRIORITY_LEVELS.default,
      zoneIds: [],
      isClinicContent: false,
    },
    {
      id: "adv-006",
      name: "Night Fallback",
      playlistId: "pl-night-fallback",
      startTime: "18:00",
      endTime: "07:00",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      priority: PRIORITY_LEVELS.fallback,
      zoneIds: [],
      isClinicContent: true,
    },
  ];
}
