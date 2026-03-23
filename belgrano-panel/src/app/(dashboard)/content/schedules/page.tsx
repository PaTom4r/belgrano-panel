"use client";

import { useState } from "react";
import Link from "next/link";

interface ScheduleBlock {
  id: string;
  name: string;
  playlist: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  zones: string[];
  isClinicContent: boolean;
}

const dayNames = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const mockSchedules: ScheduleBlock[] = [
  {
    id: "1",
    name: "Morning Lobby Rotation",
    playlist: "Lobby Morning Mix",
    startTime: "08:00",
    endTime: "12:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    zones: ["Lobby Principal", "Cafeteria"],
    isClinicContent: false,
  },
  {
    id: "2",
    name: "Advertiser Block Morning",
    playlist: "Advertiser Block A",
    startTime: "09:00",
    endTime: "13:00",
    daysOfWeek: [1, 2, 3, 4, 5, 6],
    zones: ["Pasillos Piso 1", "Pasillos Piso 2"],
    isClinicContent: false,
  },
  {
    id: "3",
    name: "Afternoon Institutional",
    playlist: "CLC Institutional",
    startTime: "13:00",
    endTime: "18:00",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    zones: ["Urgencias", "Cardiologia", "Traumatologia"],
    isClinicContent: true,
  },
  {
    id: "4",
    name: "Pediatria All Day",
    playlist: "Pediatria Special",
    startTime: "08:00",
    endTime: "20:00",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    zones: ["Pediatria"],
    isClinicContent: true,
  },
  {
    id: "5",
    name: "Evening Ads",
    playlist: "Advertiser Block A",
    startTime: "18:00",
    endTime: "22:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    zones: ["Lobby Principal", "Cafeteria", "Pasillos Piso 1"],
    isClinicContent: false,
  },
];

const allZones = [
  "Lobby Principal",
  "Urgencias",
  "Pediatria",
  "Cardiologia",
  "Traumatologia",
  "Maternidad",
  "Oncologia",
  "Cafeteria",
  "Pasillos Piso 1",
  "Pasillos Piso 2",
];

const allPlaylists = [
  "Lobby Morning Mix",
  "Advertiser Block A",
  "CLC Institutional",
  "Pediatria Special",
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPlaylist, setFormPlaylist] = useState(allPlaylists[0]);
  const [formStart, setFormStart] = useState("08:00");
  const [formEnd, setFormEnd] = useState("12:00");
  const [formDays, setFormDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [formZones, setFormZones] = useState<string[]>([]);
  const [formIsClinic, setFormIsClinic] = useState(false);

  function toggleDay(day: number) {
    setFormDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  }

  function toggleZone(zone: string) {
    setFormZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || formZones.length === 0) return;

    const newSchedule: ScheduleBlock = {
      id: String(Date.now()),
      name: formName,
      playlist: formPlaylist,
      startTime: formStart,
      endTime: formEnd,
      daysOfWeek: formDays,
      zones: formZones,
      isClinicContent: formIsClinic,
    };
    setSchedules([newSchedule, ...schedules]);
    setFormName("");
    setFormZones([]);
    setShowForm(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define when and where playlists are displayed
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create Schedule"}
        </button>
      </div>

      {/* Subnavigation */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <Link
          href="/content"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Library
        </Link>
        <Link
          href="/content/playlists"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Playlists
        </Link>
        <Link
          href="/content/schedules"
          className="border-b-2 border-blue-600 px-1 pb-3 text-sm font-medium text-blue-600"
        >
          Schedules
        </Link>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create Schedule
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Weekend Morning Rotation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Playlist
              </label>
              <select
                value={formPlaylist}
                onChange={(e) => setFormPlaylist(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {allPlaylists.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                value={formEnd}
                onChange={(e) => setFormEnd(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {dayNames[day]}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Zones
              </label>
              <div className="flex flex-wrap gap-2">
                {allZones.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => toggleZone(zone)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      formZones.includes(zone)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formIsClinic}
                  onChange={(e) => setFormIsClinic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Clinic content (institutional, not ads)
                </span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Schedule
            </button>
          </div>
        </form>
      )}

      {/* Schedule timeline table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Playlist
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zones
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {schedule.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {schedule.playlist}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
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
                            : "bg-gray-50 text-gray-300"
                        }`}
                      >
                        {dayNames[day][0]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {schedule.zones.map((zone) => (
                      <span
                        key={zone}
                        className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      schedule.isClinicContent
                        ? "bg-teal-50 text-teal-700"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {schedule.isClinicContent ? "Clinic" : "Ad"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual timeline */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Timeline
        </h3>
        <div className="space-y-3">
          {/* Time ruler */}
          <div className="flex items-center">
            <div className="w-32 flex-shrink-0" />
            <div className="flex flex-1">
              {Array.from({ length: 15 }, (_, i) => i + 8).map((hour) => (
                <div key={hour} className="flex-1 text-[10px] text-gray-400">
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>
          </div>

          {/* Schedule bars */}
          {schedules.map((schedule) => {
            const startHour = parseInt(schedule.startTime.split(":")[0]);
            const endHour = parseInt(schedule.endTime.split(":")[0]);
            const dayStart = 8;
            const dayEnd = 23;
            const totalHours = dayEnd - dayStart;
            const left = ((startHour - dayStart) / totalHours) * 100;
            const width = ((endHour - startHour) / totalHours) * 100;

            return (
              <div key={schedule.id} className="flex items-center">
                <div className="w-32 flex-shrink-0 truncate pr-2 text-xs text-gray-600">
                  {schedule.name}
                </div>
                <div className="relative flex-1 h-7 bg-gray-50 rounded">
                  <div
                    className={`absolute top-0.5 bottom-0.5 rounded text-[10px] font-medium flex items-center px-2 truncate ${
                      schedule.isClinicContent
                        ? "bg-teal-100 text-teal-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                    style={{
                      left: `${Math.max(0, left)}%`,
                      width: `${Math.min(width, 100 - left)}%`,
                    }}
                  >
                    {schedule.playlist}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
