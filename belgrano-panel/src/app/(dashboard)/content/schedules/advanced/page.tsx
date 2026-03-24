"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type ScheduleRule,
  type PriorityLevel,
  PRIORITY_LEVELS,
  getPriorityLabel,
  getAdvancedMockScheduleRules,
  testScheduleAt,
} from "@/lib/scheduling-engine";

const dayNames = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const priorityOptions: { label: string; value: PriorityLevel; level: number }[] = [
  { label: "Emergency", value: "emergency", level: PRIORITY_LEVELS.emergency },
  { label: "Campaign", value: "campaign", level: PRIORITY_LEVELS.campaign },
  { label: "Default", value: "default", level: PRIORITY_LEVELS.default },
  { label: "Fallback", value: "fallback", level: PRIORITY_LEVELS.fallback },
];

type TargetType = "zone" | "screen" | "group";

const allZones = [
  { id: "zone-lobby", name: "Lobby Principal" },
  { id: "zone-urgencias", name: "Urgencias" },
  { id: "zone-pediatria", name: "Pediatria" },
  { id: "zone-cafeteria", name: "Cafeteria" },
  { id: "zone-hallway-1", name: "Pasillos Piso 1" },
  { id: "zone-hallway-2", name: "Pasillos Piso 2" },
];

const allScreens = [
  { id: "screen-lobby-1", name: "Lobby TV 1" },
  { id: "screen-lobby-2", name: "Lobby TV 2" },
  { id: "screen-hallway-1", name: "Hallway Screen 1" },
  { id: "screen-urgencias-1", name: "Urgencias TV" },
  { id: "screen-cafeteria-1", name: "Cafeteria TV" },
  { id: "screen-pediatria-1", name: "Pediatria TV" },
];

const allScreenGroups = [
  { id: "group-all-lobby", name: "All Lobby Screens" },
  { id: "group-hallways", name: "All Hallway Screens" },
  { id: "group-clinical", name: "Clinical Areas" },
];

const allPlaylists = [
  { id: "pl-emergency", name: "Emergency Alerts" },
  { id: "pl-warner-launch", name: "Warner Bros Launch" },
  { id: "pl-colmena", name: "ISAPRE Colmena" },
  { id: "pl-clinic-morning", name: "Clinic Morning" },
  { id: "pl-ads-afternoon", name: "Afternoon Ads Mix" },
  { id: "pl-night-fallback", name: "Night Fallback" },
];

function priorityBadge(priority: number) {
  const level = getPriorityLabel(priority);
  const variantMap: Record<PriorityLevel, "error" | "info" | "draft" | "warning"> = {
    emergency: "error",
    campaign: "info",
    default: "draft",
    fallback: "warning",
  };
  return (
    <Badge variant={variantMap[level]}>
      {level.charAt(0).toUpperCase() + level.slice(1)} ({priority})
    </Badge>
  );
}

export default function AdvancedSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleRule[]>(
    getAdvancedMockScheduleRules
  );
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPriority, setFormPriority] = useState<PriorityLevel>("default");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formDays, setFormDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [formStartTime, setFormStartTime] = useState("08:00");
  const [formEndTime, setFormEndTime] = useState("18:00");
  const [formTargetType, setFormTargetType] = useState<TargetType>("zone");
  const [formTargets, setFormTargets] = useState<string[]>([]);
  const [formPlaylist, setFormPlaylist] = useState(allPlaylists[0].id);
  const [formIsEmergency, setFormIsEmergency] = useState(false);

  // Test schedule state
  const [testResult, setTestResult] = useState<{
    active: ScheduleRule | null;
    overridden: ScheduleRule[];
  } | null>(null);

  const sortedSchedules = useMemo(
    () => [...schedules].sort((a, b) => b.priority - a.priority),
    [schedules]
  );

  function toggleDay(day: number) {
    setFormDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  }

  function toggleTarget(id: string) {
    setFormTargets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function getTargetOptions() {
    switch (formTargetType) {
      case "zone":
        return allZones;
      case "screen":
        return allScreens;
      case "group":
        return allScreenGroups;
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;

    const newSchedule: ScheduleRule = {
      id: `adv-${Date.now()}`,
      name: formName,
      playlistId: formPlaylist,
      startTime: formStartTime,
      endTime: formEndTime,
      daysOfWeek: formDays,
      priority: PRIORITY_LEVELS[formPriority],
      zoneIds: formTargetType === "zone" ? formTargets : [],
      screenIds: formTargetType === "screen" ? formTargets : undefined,
      screenGroupIds: formTargetType === "group" ? formTargets : undefined,
      isClinicContent: formPriority === "fallback" || formPriority === "default",
      isEmergency: formIsEmergency,
      dateRange:
        formStartDate && formEndDate
          ? { startDate: formStartDate, endDate: formEndDate }
          : undefined,
    };

    setSchedules([...schedules, newSchedule]);
    resetForm();
  }

  function resetForm() {
    setFormName("");
    setFormPriority("default");
    setFormStartDate("");
    setFormEndDate("");
    setFormDays([1, 2, 3, 4, 5]);
    setFormStartTime("08:00");
    setFormEndTime("18:00");
    setFormTargetType("zone");
    setFormTargets([]);
    setFormPlaylist(allPlaylists[0].id);
    setFormIsEmergency(false);
    setShowForm(false);
  }

  function handleTestSchedule() {
    const result = testScheduleAt(schedules, {
      zoneId: "zone-lobby",
      screenId: "screen-lobby-1",
      testTime: new Date(),
    });
    setTestResult({
      active: result.activeSchedule,
      overridden: result.overriddenSchedules,
    });
  }

  return (
    <div>
      <PageHeader
        title="Advanced Scheduling"
        description="Priority-based conditional scheduling with date ranges and emergency overrides"
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleTestSchedule}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Test Schedule
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {showForm ? "Cancel" : "Create Schedule"}
            </button>
          </div>
        }
      />

      {/* Subnavigation */}
      <div className="mb-6 flex gap-4 border-b border-slate-200">
        <Link
          href="/content/schedules"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
        >
          Basic
        </Link>
        <Link
          href="/content/schedules/advanced"
          className="border-b-2 border-blue-600 px-1 pb-3 text-sm font-medium text-blue-600 transition-colors"
        >
          Advanced
        </Link>
        <Link
          href="/content/schedules/smart-playlist"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
        >
          Smart Playlists
        </Link>
      </div>

      {/* Test Schedule Result */}
      {testResult && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Schedule Test Result (Now, Lobby, Screen Lobby-1)
          </h3>
          {testResult.active ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-slate-700">
                  Active:
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {testResult.active.name}
                </span>
                {priorityBadge(testResult.active.priority)}
                {testResult.active.isEmergency && (
                  <Badge variant="error">EMERGENCY</Badge>
                )}
              </div>
              {testResult.overridden.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-500">
                    Overridden ({testResult.overridden.length}):
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {testResult.overridden.map((s) => (
                      <span
                        key={s.id}
                        className="text-xs text-slate-400 line-through"
                      >
                        {s.name} (p{s.priority})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No schedule is active right now for this zone/screen.
            </p>
          )}
          <button
            onClick={() => setTestResult(null)}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Dismiss
          </button>
        </Card>
      )}

      {/* Create form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Create Advanced Schedule
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Schedule Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                  placeholder="e.g., Warner Bros Launch Week"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Priority Level
                </label>
                <div className="mt-1 flex gap-2">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormPriority(opt.value);
                        if (opt.value === "emergency") setFormIsEmergency(true);
                        else setFormIsEmergency(false);
                      }}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        formPriority === opt.value
                          ? opt.value === "emergency"
                            ? "bg-red-600 text-white"
                            : opt.value === "campaign"
                            ? "bg-blue-600 text-white"
                            : opt.value === "default"
                            ? "bg-slate-600 text-white"
                            : "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label} ({opt.level})
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Start Date (optional)
                </label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
              </div>

              {/* Days of week */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Days of Week
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-9 w-12 rounded-lg text-xs font-medium transition-colors ${
                        formDays.includes(day)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {dayNames[day]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time block */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  End Time
                </label>
                <input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
              </div>

              {/* Target type */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Type
                </label>
                <div className="flex gap-3">
                  {(["zone", "screen", "group"] as TargetType[]).map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="targetType"
                        checked={formTargetType === type}
                        onChange={() => {
                          setFormTargetType(type);
                          setFormTargets([]);
                        }}
                        className="h-4 w-4 border-slate-300 text-blue-600"
                      />
                      <span className="text-sm text-slate-700 capitalize">
                        {type === "group" ? "Screen Group" : type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target selector */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Targets
                </label>
                <div className="flex flex-wrap gap-2">
                  {getTargetOptions().map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => toggleTarget(target.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        formTargets.includes(target.id)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {target.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Playlist */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Playlist
                </label>
                <select
                  value={formPlaylist}
                  onChange={(e) => setFormPlaylist(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                >
                  {allPlaylists.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Emergency toggle */}
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formIsEmergency}
                    onChange={(e) => setFormIsEmergency(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus-visible:ring-red-500"
                  />
                  <span className="text-sm text-slate-700">
                    Emergency override (bypasses all other schedules)
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Create Schedule
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Schedules list sorted by priority */}
      <Card padding="p-0">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date Range
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Targets
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Flags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedSchedules.map((schedule) => (
              <tr
                key={schedule.id}
                className={`hover:bg-slate-50 transition-colors ${
                  schedule.isEmergency ? "bg-red-50/50" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {schedule.name}
                </td>
                <td className="px-4 py-3">
                  {priorityBadge(schedule.priority)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <span
                        key={day}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded text-[10px] font-medium ${
                          schedule.daysOfWeek.includes(day)
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-50 text-slate-300"
                        }`}
                      >
                        {dayNames[day][0]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {schedule.dateRange
                    ? `${schedule.dateRange.startDate} to ${schedule.dateRange.endDate}`
                    : "Always"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {schedule.zoneIds.length > 0 &&
                      schedule.zoneIds.map((zId) => {
                        const zone = allZones.find((z) => z.id === zId);
                        return (
                          <Badge key={zId} variant="draft">
                            {zone?.name ?? zId}
                          </Badge>
                        );
                      })}
                    {schedule.screenIds &&
                      schedule.screenIds.length > 0 &&
                      schedule.screenIds.map((sId) => {
                        const screen = allScreens.find((s) => s.id === sId);
                        return (
                          <Badge key={sId} variant="purple">
                            {screen?.name ?? sId}
                          </Badge>
                        );
                      })}
                    {!schedule.zoneIds.length &&
                      !schedule.screenIds?.length &&
                      !schedule.screenGroupIds?.length && (
                        <span className="text-xs text-slate-400">All</span>
                      )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {schedule.isEmergency && (
                      <Badge variant="error">EMERGENCY</Badge>
                    )}
                    {schedule.isClinicContent && (
                      <Badge variant="teal">Clinic</Badge>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Priority Legend */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Priority Override Rules
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="text-sm font-semibold text-red-700">
              Emergency (100)
            </div>
            <p className="mt-1 text-xs text-red-600">
              Immediately overrides everything. Used for safety alerts.
            </p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="text-sm font-semibold text-blue-700">
              Campaign (50)
            </div>
            <p className="mt-1 text-xs text-blue-600">
              Advertiser campaigns with date ranges. Overrides defaults.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm font-semibold text-slate-700">
              Default (10)
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Regular scheduled content. Clinic info, daily rotations.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="text-sm font-semibold text-amber-700">
              Fallback (1)
            </div>
            <p className="mt-1 text-xs text-amber-600">
              Plays only when nothing else matches. Night content.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
