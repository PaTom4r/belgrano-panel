"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import type { MagicInfoDevice } from "@/lib/magicinfo/types";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ScreenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [device, setDevice] = useState<MagicInfoDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(false);
  const [restartResult, setRestartResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/magicinfo/devices")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.data as MagicInfoDevice[])?.find(
          (d) => d.deviceId === id
        );
        setDevice(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleRestart() {
    setRestarting(true);
    setRestartResult(null);
    try {
      const res = await fetch(`/api/magicinfo/devices/${id}/restart`, {
        method: "POST",
      });
      const data = await res.json();
      setRestartResult(data.message || "Restart command sent");
    } catch {
      setRestartResult("Failed to send restart command");
    } finally {
      setRestarting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading screen details...</p>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Screen not found.</p>
        <Link
          href="/screens"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline transition-colors"
        >
          Back to screens
        </Link>
      </div>
    );
  }

  const isOnline = device.status === "CONNECTED";

  const fields = [
    { label: "Device ID", value: device.deviceId },
    { label: "Name", value: device.deviceName },
    { label: "Model", value: device.deviceModelName },
    { label: "Type", value: device.deviceType },
    { label: "IP Address", value: device.ipAddress },
    { label: "MAC Address", value: device.macAddress },
    { label: "Firmware", value: device.firmwareVersion },
    {
      label: "Resolution",
      value: device.resolution,
      badge: true,
      badgeVariant: "info" as const,
    },
    {
      label: "Orientation",
      value: device.displayOrientation,
      badge: true,
      badgeVariant: "purple" as const,
    },
    { label: "Zone", value: device.groupName },
    {
      label: "Last Connection",
      value: new Date(device.lastConnectionTime).toLocaleString(),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/screens"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to screens
        </Link>
      </div>

      <Card padding="p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <StatusDot
              status={isOnline ? "online" : "offline"}
              size="lg"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {device.deviceName}
              </h1>
              <p className="text-sm text-slate-500">{device.deviceModelName}</p>
            </div>
          </div>
          <Badge variant={isOnline ? "success" : "error"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <div key={f.label} className="bg-white p-4">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {f.label}
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {f.badge ? (
                  <Badge variant={f.badgeVariant}>{f.value}</Badge>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              disabled={restarting}
              className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed outline-none"
            >
              {restarting ? "Restarting..." : "Restart Screen"}
            </button>
            {restartResult && (
              <span className="text-sm text-slate-600">{restartResult}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
