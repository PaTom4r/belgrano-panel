"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusDot } from "@/components/ui/status-dot";

type RegisteredScreen = {
  id: string;
  displayId: string;
  name: string | null;
  zoneName: string | null;
  zoneId: string | null;
  isAssigned: boolean;
  ipAddress: string;
  resolution: string;
  userAgent: string;
  registeredAt: string;
  lastSeen: string | null;
  lastHeartbeat: string | null;
  currentContent: string | null;
};

const mockZones = [
  { id: "z1", name: "Lobby Principal" },
  { id: "z2", name: "Sala de Espera 1" },
  { id: "z3", name: "Sala de Espera 2" },
  { id: "z4", name: "Pasillo Central" },
  { id: "z5", name: "Urgencias" },
];

const mockScreens: RegisteredScreen[] = [
  {
    id: "sr-001",
    displayId: "DISP-LBY-01",
    name: "Lobby Display 1",
    zoneName: "Lobby Principal",
    zoneId: "z1",
    isAssigned: true,
    ipAddress: "192.168.1.101",
    resolution: "1920x1080",
    userAgent: "Tizen/5.5 Samsung SM-QBB",
    registeredAt: "2026-03-20T10:00:00Z",
    lastSeen: "2026-03-24T14:55:00Z",
    lastHeartbeat: "2026-03-24T14:55:00Z",
    currentContent: "Promo Isapre Banmedica",
  },
  {
    id: "sr-002",
    displayId: "DISP-SW1-01",
    name: "Waiting Room A",
    zoneName: "Sala de Espera 1",
    zoneId: "z2",
    isAssigned: true,
    ipAddress: "192.168.1.102",
    resolution: "1920x1080",
    userAgent: "Tizen/5.5 Samsung SM-QBB",
    registeredAt: "2026-03-20T10:05:00Z",
    lastSeen: "2026-03-24T14:50:00Z",
    lastHeartbeat: "2026-03-24T14:50:00Z",
    currentContent: "Clinica CLC Institucional",
  },
  {
    id: "sr-003",
    displayId: "DISP-SW2-01",
    name: "Waiting Room B",
    zoneName: "Sala de Espera 2",
    zoneId: "z3",
    isAssigned: true,
    ipAddress: "192.168.1.103",
    resolution: "3840x2160",
    userAgent: "Tizen/6.0 Samsung SM-QBR",
    registeredAt: "2026-03-21T08:30:00Z",
    lastSeen: "2026-03-24T14:40:00Z",
    lastHeartbeat: "2026-03-24T14:40:00Z",
    currentContent: "Farmacia Cruz Verde",
  },
  {
    id: "sr-004",
    displayId: "DISP-NEW-01",
    name: null,
    zoneName: null,
    zoneId: null,
    isAssigned: false,
    ipAddress: "192.168.1.150",
    resolution: "1920x1080",
    userAgent: "Tizen/5.5 Samsung SM-QBN",
    registeredAt: "2026-03-24T09:00:00Z",
    lastSeen: "2026-03-24T14:52:00Z",
    lastHeartbeat: "2026-03-24T14:52:00Z",
    currentContent: null,
  },
  {
    id: "sr-005",
    displayId: "DISP-NEW-02",
    name: null,
    zoneName: null,
    zoneId: null,
    isAssigned: false,
    ipAddress: "192.168.1.151",
    resolution: "3840x2160",
    userAgent: "Tizen/6.0 Samsung SM-QBR",
    registeredAt: "2026-03-24T11:30:00Z",
    lastSeen: "2026-03-24T14:48:00Z",
    lastHeartbeat: "2026-03-24T14:48:00Z",
    currentContent: null,
  },
];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function isOnline(lastHeartbeat: string | null): boolean {
  if (!lastHeartbeat) return false;
  const diff = Date.now() - new Date(lastHeartbeat).getTime();
  // Offline after 3 missed heartbeats (15 min = 900000ms)
  return diff < 900000;
}

export default function ScreenManagePage() {
  const [screens, setScreens] = useState(mockScreens);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignName, setAssignName] = useState("");
  const [assignZone, setAssignZone] = useState("");
  const [commandingId, setCommandingId] = useState<string | null>(null);

  const assignedCount = screens.filter((s) => s.isAssigned).length;
  const unassignedCount = screens.filter((s) => !s.isAssigned).length;
  const onlineCount = screens.filter((s) => isOnline(s.lastHeartbeat)).length;

  function handleAssign(screenId: string) {
    if (!assignName.trim() || !assignZone) return;
    setScreens((prev) =>
      prev.map((s) =>
        s.id === screenId
          ? {
              ...s,
              name: assignName.trim(),
              zoneId: assignZone,
              zoneName: mockZones.find((z) => z.id === assignZone)?.name || null,
              isAssigned: true,
            }
          : s,
      ),
    );
    setAssigningId(null);
    setAssignName("");
    setAssignZone("");
  }

  function handleCommand(screenId: string, command: string) {
    // Mock: fire and forget to API
    fetch(`/api/display/${screenId}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    }).catch(() => {
      // Silently fail in mock
    });
    setCommandingId(null);
  }

  return (
    <div>
      <PageHeader
        title="Screen Management"
        description="Register, assign, and control display hardware"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Registered"
          value={screens.length}
          color="blue"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
            </svg>
          }
        />
        <StatCard
          label="Online"
          value={onlineCount}
          color="emerald"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
        <StatCard
          label="Assigned"
          value={assignedCount}
          detail={`${unassignedCount} unassigned`}
          color="purple"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          }
        />
        <StatCard
          label="Unassigned"
          value={unassignedCount}
          color="amber"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
        />
      </div>

      {/* Screen list */}
      <Card padding="p-0">
        <div className="p-5">
          <CardHeader
            title="Registered Screens"
            description="Screens that have self-registered by loading the display URL"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                <th className="px-5 py-3 font-medium text-slate-500">Display ID</th>
                <th className="px-5 py-3 font-medium text-slate-500">Name</th>
                <th className="px-5 py-3 font-medium text-slate-500">Zone</th>
                <th className="px-5 py-3 font-medium text-slate-500">Resolution</th>
                <th className="px-5 py-3 font-medium text-slate-500">Last Heartbeat</th>
                <th className="px-5 py-3 font-medium text-slate-500">Current Content</th>
                <th className="px-5 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {screens.map((screen) => {
                const online = isOnline(screen.lastHeartbeat);
                return (
                  <tr
                    key={screen.id}
                    className={`${!screen.isAssigned ? "bg-amber-50/50" : ""} hover:bg-slate-50 transition-colors`}
                  >
                    <td className="px-5 py-3">
                      <StatusDot status={online ? "online" : "offline"} />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">
                      {screen.displayId}
                    </td>
                    <td className="px-5 py-3">
                      {screen.name ? (
                        <span className="font-medium text-slate-900">{screen.name}</span>
                      ) : (
                        <Badge variant="warning">Unassigned</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {screen.zoneName || <span className="text-slate-400">--</span>}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{screen.resolution}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {timeAgo(screen.lastHeartbeat)}
                    </td>
                    <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">
                      {screen.currentContent || (
                        <span className="text-slate-400">No content</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {!screen.isAssigned && (
                          <button
                            onClick={() => {
                              setAssigningId(screen.id);
                              setAssignName("");
                              setAssignZone("");
                            }}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                          >
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setCommandingId(
                              commandingId === screen.id ? null : screen.id,
                            )
                          }
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Control
                        </button>
                      </div>

                      {/* Assign form */}
                      {assigningId === screen.id && (
                        <div className="mt-3 space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <input
                            type="text"
                            placeholder="Display name..."
                            value={assignName}
                            onChange={(e) => setAssignName(e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                          />
                          <select
                            value={assignZone}
                            onChange={(e) => setAssignZone(e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                          >
                            <option value="">Select zone...</option>
                            {mockZones.map((z) => (
                              <option key={z.id} value={z.id}>
                                {z.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAssign(screen.id)}
                              disabled={!assignName.trim() || !assignZone}
                              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setAssigningId(null)}
                              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Command panel */}
                      {commandingId === screen.id && (
                        <div className="mt-3 flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <button
                            onClick={() => handleCommand(screen.id, "restart")}
                            className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                          >
                            Restart
                          </button>
                          <button
                            onClick={() => handleCommand(screen.id, "power_off")}
                            className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Power Off
                          </button>
                          <button
                            onClick={() => handleCommand(screen.id, "power_on")}
                            className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Power On
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
