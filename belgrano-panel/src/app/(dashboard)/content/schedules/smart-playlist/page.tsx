"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import {
  type PlaylistItem,
  buildSmartPlaylist,
  getAdvertiserShares,
  simulateDay,
} from "@/lib/smart-playlist";

const mockAdvertisers = [
  { id: "adv-colmena", name: "ISAPRE Colmena" },
  { id: "adv-warner", name: "Warner Bros" },
  { id: "adv-pfizer", name: "Pfizer Chile" },
];

const mockItems: PlaylistItem[] = [
  {
    id: "item-1",
    contentId: "content-001",
    campaignId: "camp-colmena-1",
    advertiserId: "adv-colmena",
    priority: 8,
    weight: 40,
    maxPlaysPerDay: 120,
    todayPlays: 15,
    duration: 30,
    type: "video",
    name: "Colmena ISAPRE - Plan Salud 2026",
  },
  {
    id: "item-2",
    contentId: "content-002",
    campaignId: "camp-colmena-2",
    advertiserId: "adv-colmena",
    priority: 6,
    weight: 20,
    maxPlaysPerDay: 80,
    todayPlays: 10,
    duration: 15,
    type: "image",
    name: "Colmena - Descuento Marzo",
  },
  {
    id: "item-3",
    contentId: "content-003",
    campaignId: "camp-warner-1",
    advertiserId: "adv-warner",
    priority: 9,
    weight: 30,
    maxPlaysPerDay: 100,
    todayPlays: 5,
    duration: 20,
    type: "video",
    name: "Warner Bros - Superman Legacy Estreno",
  },
  {
    id: "item-4",
    contentId: "content-004",
    campaignId: "camp-pfizer-1",
    advertiserId: "adv-pfizer",
    priority: 5,
    weight: 25,
    maxPlaysPerDay: null,
    todayPlays: 30,
    duration: 15,
    type: "video",
    name: "Pfizer - Campaña Vacunacion Invierno",
  },
  {
    id: "item-5",
    contentId: "content-005",
    campaignId: "camp-pfizer-2",
    advertiserId: "adv-pfizer",
    priority: 7,
    weight: 15,
    maxPlaysPerDay: 60,
    todayPlays: 8,
    duration: 10,
    type: "html5",
    name: "Pfizer - Info Farmacia CLC",
  },
];

const priorityColors: Record<number, string> = {
  10: "bg-red-500",
  9: "bg-red-400",
  8: "bg-orange-400",
  7: "bg-amber-400",
  6: "bg-yellow-400",
  5: "bg-lime-400",
  4: "bg-green-400",
  3: "bg-emerald-400",
  2: "bg-teal-400",
  1: "bg-cyan-400",
};

const advertiserColors: Record<string, string> = {
  "adv-colmena": "bg-blue-400",
  "adv-warner": "bg-purple-400",
  "adv-pfizer": "bg-emerald-400",
  _internal: "bg-slate-400",
};

export default function SmartPlaylistPage() {
  const [items, setItems] = useState<PlaylistItem[]>(mockItems);
  const [playlistName, setPlaylistName] = useState("CLC Peak Hours Smart Mix");
  const [showSimulation, setShowSimulation] = useState(false);

  const playlist = useMemo(() => buildSmartPlaylist(items, 3600), [items]); // 1-hour playlist
  const shares = useMemo(() => getAdvertiserShares(playlist.items), [playlist]);
  const simulation = useMemo(
    () => (showSimulation ? simulateDay(items, 14) : []),
    [items, showSimulation]
  );

  const updateItem = useCallback(
    (
      itemId: string,
      field: "priority" | "weight" | "maxPlaysPerDay",
      value: number | null
    ) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div>
      <PageHeader
        title="Smart Playlist"
        description="Priority-based ordering with frequency caps and advertiser balancing"
        actions={
          <button
            onClick={() => setShowSimulation(!showSimulation)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {showSimulation ? "Hide Simulation" : "Simulate Day"}
          </button>
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
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
        >
          Advanced
        </Link>
        <Link
          href="/content/schedules/smart-playlist"
          className="border-b-2 border-blue-600 px-1 pb-3 text-sm font-medium text-blue-600 transition-colors"
        >
          Smart Playlists
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Playlist Items"
          value={items.length}
          detail={`${playlist.items.length} in generated sequence`}
          color="blue"
        />
        <StatCard
          label="Total Duration"
          value={`${Math.round(playlist.totalDuration / 60)}m`}
          detail={`${playlist.totalDuration}s total`}
          color="purple"
        />
        <StatCard
          label="Advertisers"
          value={mockAdvertisers.length}
          detail={playlist.advertisersBalanced ? "Balanced" : "Imbalanced"}
          color={playlist.advertisersBalanced ? "emerald" : "amber"}
        />
        <StatCard
          label="Frequency Caps"
          value={items.filter((i) => i.maxPlaysPerDay !== null).length}
          detail={`of ${items.length} items have caps`}
          color="teal"
        />
      </div>

      {/* Playlist name */}
      <Card className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Playlist Name
        </label>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="block w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
        />
      </Card>

      {/* Items configuration */}
      <Card className="mb-6" padding="p-0">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Content Items
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Adjust priority, weight, and frequency caps for each item
          </p>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Advertiser
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority (1-10)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Max Plays/Day
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Played Today
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => {
              const advertiser = mockAdvertisers.find(
                (a) => a.id === item.advertiserId
              );
              const isCapped =
                item.maxPlaysPerDay !== null &&
                item.todayPlays >= item.maxPlaysPerDay;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isCapped
                      ? "bg-red-50/50 opacity-60"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.duration}s
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        item.advertiserId === "adv-colmena"
                          ? "info"
                          : item.advertiserId === "adv-warner"
                          ? "purple"
                          : "teal"
                      }
                    >
                      {advertiser?.name ?? "Unknown"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="draft">{item.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={item.priority}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "priority",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20 accent-blue-600"
                      />
                      <span className="text-sm font-mono font-medium text-slate-700 w-5 text-center">
                        {item.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={item.weight}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "weight",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 rounded border border-slate-300 px-2 py-1 text-sm text-center text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={item.maxPlaysPerDay ?? ""}
                      placeholder="No cap"
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "maxPlaysPerDay",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-20 rounded border border-slate-300 px-2 py-1 text-sm text-center text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-medium ${
                        isCapped ? "text-red-600" : "text-slate-700"
                      }`}
                    >
                      {item.todayPlays}
                      {isCapped && " (capped)"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Advertiser Balance */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Advertiser Balance
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={playlist.advertisersBalanced ? "success" : "warning"}>
            {playlist.advertisersBalanced ? "Balanced" : "Imbalanced"}
          </Badge>
          <span className="text-sm text-slate-500">
            Distribution is {playlist.advertisersBalanced ? "within" : "outside"}{" "}
            10% of target weights
          </span>
        </div>
        <div className="space-y-3">
          {shares.map((share) => {
            const advertiser = mockAdvertisers.find(
              (a) => a.id === share.advertiserId
            );
            const bgColor =
              advertiserColors[share.advertiserId] ?? "bg-slate-400";
            return (
              <div key={share.advertiserId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {advertiser?.name ?? "Internal Content"}
                  </span>
                  <span className="text-xs text-slate-500">
                    Target: {share.targetPercent.toFixed(1)}% | Actual:{" "}
                    {share.actualPercent.toFixed(1)}% ({share.itemCount} slots)
                  </span>
                </div>
                <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
                  {/* Target bar (outline) */}
                  <div
                    className={`${bgColor} rounded-full transition-all duration-300`}
                    style={{ width: `${share.actualPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Weight Distribution Legend */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Weight Distribution
          </h4>
          <div className="flex flex-wrap gap-3">
            {items.map((item) => {
              const pct =
                totalWeight > 0 ? (item.weight / totalWeight) * 100 : 0;
              return (
                <div key={item.id} className="text-xs text-slate-600">
                  <span className="font-medium">{item.name.split(" - ")[1] ?? item.name}</span>
                  : {item.weight}w ({pct.toFixed(1)}%)
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Generated Playlist Preview */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Generated Playlist Order
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Preview of the first {Math.min(playlist.items.length, 20)} items in
          the calculated sequence (1-hour block)
        </p>
        <div className="flex flex-wrap gap-1">
          {playlist.items.slice(0, 20).map((item, index) => {
            const bgColor =
              advertiserColors[item.advertiserId ?? "_internal"] ??
              "bg-slate-400";
            return (
              <div
                key={`${item.id}-${index}`}
                className={`${bgColor} rounded px-2 py-1 text-[10px] font-medium text-white`}
                title={`#${index + 1}: ${item.name} (p${item.priority}, w${item.weight}, ${item.duration}s)`}
              >
                {index + 1}. {item.name.split(" - ")[1] ?? item.name}
              </div>
            );
          })}
          {playlist.items.length > 20 && (
            <span className="text-xs text-slate-400 self-center ml-2">
              +{playlist.items.length - 20} more
            </span>
          )}
        </div>
      </Card>

      {/* Day Simulation */}
      {showSimulation && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            14-Hour Day Simulation
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Estimated play counts for each item across a full operating day (07:00 - 21:00)
          </p>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                  Content
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                  Advertiser
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">
                  Est. Plays
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                  Visual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {simulation.map((sim) => {
                const maxPlays = Math.max(...simulation.map((s) => s.plays), 1);
                const barWidth = (sim.plays / maxPlays) * 100;
                const bgColor =
                  advertiserColors[sim.advertiserId ?? "_internal"] ??
                  "bg-slate-400";
                const advertiser = mockAdvertisers.find(
                  (a) => a.id === sim.advertiserId
                );
                return (
                  <tr key={sim.itemId} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {sim.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600">
                      {advertiser?.name ?? "Internal"}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-slate-900 text-center">
                      {sim.plays}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`${bgColor} h-full rounded-full transition-all duration-300`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
