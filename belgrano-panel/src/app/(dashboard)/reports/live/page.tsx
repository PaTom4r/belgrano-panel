"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { CHART_COLORS } from "@/lib/constants";

type PlayLog = {
  id: string;
  screenId: string;
  screenName: string;
  contentName: string;
  campaignId: string;
  campaignName: string;
  zone: string;
  playedAt: string;
  durationSeconds: number;
};

type PlayLogResponse = {
  logs: PlayLog[];
  summary: {
    totalPlays: number;
    uniqueScreens: number;
    totalDuration: number;
    byZone: Record<string, number>;
    byCampaign: Record<string, number>;
  };
  lastUpdated: string;
};

const campaignBadgeVariants: Record<string, "info" | "success" | "purple" | "warning" | "teal"> = {
  "camp-001": "info",
  "camp-002": "success",
  "camp-003": "purple",
  "camp-004": "warning",
  "camp-005": "teal",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatTotalDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function LiveReportsPage() {
  const [logs, setLogs] = useState<PlayLog[]>([]);
  const [summary, setSummary] = useState<PlayLogResponse["summary"] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());
  const prevLogIdsRef = useRef<Set<string>>(new Set());

  const fetchLogs = useCallback(async () => {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const now = new Date();
      const from = oneHourAgo.toISOString().split("T")[0];
      const to = now.toISOString().split("T")[0];

      const res = await fetch(`/api/display/play-logs?from=${from}&to=${to}`);
      if (!res.ok) return;

      const data: PlayLogResponse = await res.json();

      // Detect new entries for animation
      const currentIds = new Set(data.logs.map((l) => l.id));
      const freshIds = new Set<string>();
      for (const id of currentIds) {
        if (!prevLogIdsRef.current.has(id)) {
          freshIds.add(id);
        }
      }
      prevLogIdsRef.current = currentIds;
      setNewLogIds(freshIds);

      // Clear "new" highlight after animation
      if (freshIds.size > 0) {
        setTimeout(() => setNewLogIds(new Set()), 1500);
      }

      setLogs(data.logs.slice(0, 20));
      setSummary(data.summary);
      setLastUpdated(data.lastUpdated);
    } catch {
      // Silently fail — will retry on next interval
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(fetchLogs, 10_000);
    return () => clearInterval(interval);
  }, [paused, fetchLogs]);

  // Derive live stats
  const playsLastHour = summary?.totalPlays ?? 0;
  const activeScreens = summary?.uniqueScreens ?? 0;
  const totalDurationToday = summary?.totalDuration ?? 0;

  // Most played campaign
  const mostPlayedCampaign = summary?.byCampaign
    ? Object.entries(summary.byCampaign).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "-"
    : "-";

  // Zone data for grid
  const zoneData = summary?.byZone
    ? Object.entries(summary.byZone).sort(([, a], [, b]) => b - a)
    : [];

  // Campaign data for chart
  const campaignChartData = summary?.byCampaign
    ? Object.entries(summary.byCampaign)
        .map(([id, plays]) => ({
          name: id.replace("camp-00", "Camp "),
          plays,
        }))
        .sort((a, b) => b.plays - a.plays)
    : [];

  return (
    <div>
      <PageHeader
        title="Live Proof of Play"
        description="Real-time view of content playing across all screens"
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/reports"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Reports
            </Link>
            <button
              onClick={() => setPaused((p) => !p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                paused
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <StatusDot status={paused ? "pending" : "online"} />
              {paused ? "Paused" : "Live"}
            </div>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live Stats Bar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Plays (Last Hour)"
              value={playsLastHour.toLocaleString("es-CL")}
              color="blue"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              }
            />
            <StatCard
              label="Active Screens"
              value={activeScreens}
              color="emerald"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
                </svg>
              }
            />
            <StatCard
              label="Most Played Campaign"
              value={mostPlayedCampaign.replace("camp-00", "Camp ")}
              color="purple"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.27.308 6.023 6.023 0 0 1-2.27-.308" />
                </svg>
              }
            />
            <StatCard
              label="Total Duration Today"
              value={formatTotalDuration(totalDurationToday)}
              color="amber"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
            />
          </div>

          {/* Live Ticker + Zone Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Live Ticker — takes 2 cols */}
            <Card padding="p-0" className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <StatusDot status="online" />
                  <h3 className="text-lg font-semibold text-slate-900">Live Feed</h3>
                </div>
                {lastUpdated && (
                  <span className="text-xs text-slate-400">
                    Updated {formatTime(lastUpdated)}
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-slate-400">
                    No plays recorded in the last hour
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-center gap-4 px-6 py-3 transition-all duration-500 ${
                        newLogIds.has(log.id)
                          ? "bg-blue-50 animate-pulse"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="min-w-[70px] text-xs font-mono text-slate-400">
                        {formatTime(log.playedAt)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 truncate">
                            {log.screenName}
                          </span>
                          <span className="text-xs text-slate-400">{log.zone}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {log.contentName}
                        </p>
                      </div>
                      <Badge variant={campaignBadgeVariants[log.campaignId] ?? "info"}>
                        {log.campaignName}
                      </Badge>
                      <span className="min-w-[40px] text-right text-xs font-medium text-slate-600">
                        {formatDuration(log.durationSeconds)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Live by Zone */}
            <Card padding="p-0">
              <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">Live by Zone</h3>
              </div>
              <div className="grid grid-cols-1 gap-0 divide-y divide-slate-100">
                {zoneData.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-slate-400">
                    No zone data
                  </div>
                ) : (
                  zoneData.map(([zone, count]) => (
                    <div
                      key={zone}
                      className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm text-slate-700 truncate">{zone}</span>
                      <Badge variant="info">{count}</Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Live by Campaign — horizontal bar chart */}
          <Card>
            <CardHeader
              title="Plays by Campaign (Last Hour)"
              description="Horizontal bar chart of plays per active campaign"
            />
            {campaignChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={campaignChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="plays"
                    fill={CHART_COLORS[0]}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-8 text-center text-sm text-slate-400">
                No campaign data available
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
