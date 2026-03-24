"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MagicInfoDevice } from "@/lib/magicinfo/types";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function ScreensPage() {
  const [devices, setDevices] = useState<MagicInfoDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");

  useEffect(() => {
    fetch("/api/magicinfo/devices")
      .then((res) => res.json())
      .then((data) => {
        setDevices(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const zones = useMemo(() => {
    const set = new Set(devices.map((d) => d.groupName));
    return Array.from(set).sort();
  }, [devices]);

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch =
        !search ||
        d.deviceName.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceModelName.toLowerCase().includes(search.toLowerCase());
      const matchesZone = zoneFilter === "all" || d.groupName === zoneFilter;
      return matchesSearch && matchesZone;
    });
  }, [devices, search, zoneFilter]);

  const onlineCount = devices.filter((d) => d.status === "CONNECTED").length;
  const offlineCount = devices.filter(
    (d) => d.status === "DISCONNECTED"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading screens...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Screens"
        description="Manage and monitor all digital signage displays"
      />

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card padding="p-4">
          <p className="text-sm text-slate-500">Total Screens</p>
          <p className="text-2xl font-bold text-slate-900">{devices.length}</p>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-2">
            <StatusDot status="online" />
            <p className="text-sm text-slate-500">Online</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{onlineCount}</p>
        </Card>
        <Card padding="p-4">
          <div className="flex items-center gap-2">
            <StatusDot status="offline" pulse={false} />
            <p className="text-sm text-slate-500">Offline</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none transition-shadow"
        />
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none transition-shadow"
        >
          <option value="all">All Zones</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Screen grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((device) => {
          const isOnline = device.status === "CONNECTED";
          return (
            <Link
              key={device.deviceId}
              href={`/screens/${device.deviceId}`}
              className="group rounded-xl bg-white p-4 shadow-sm border border-slate-200 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {device.deviceName}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {device.deviceModelName}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <StatusDot
                    status={isOnline ? "online" : "offline"}
                  />
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Zone</span>
                  <span className="text-slate-600">{device.groupName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Resolution</span>
                  <span className="text-slate-600">{device.resolution}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <Badge variant={isOnline ? "success" : "error"}>
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Last seen</span>
                  <span className="text-slate-600">
                    {new Date(device.lastConnectionTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500">No screens match your filters.</p>
        </div>
      )}
    </div>
  );
}
