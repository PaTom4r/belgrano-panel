"use client";

import { useState } from "react";
import Link from "next/link";

interface Playlist {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  totalDuration: number;
  updatedAt: string;
}

const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Lobby Morning Mix",
    description: "Rotation for lobby screens during morning hours (8AM-12PM)",
    itemCount: 8,
    totalDuration: 180,
    updatedAt: "2026-03-22T10:00:00Z",
  },
  {
    id: "2",
    name: "Advertiser Block A",
    description: "ISAPRE + Pharma ads for high-traffic zones",
    itemCount: 5,
    totalDuration: 120,
    updatedAt: "2026-03-21T14:00:00Z",
  },
  {
    id: "3",
    name: "CLC Institutional",
    description: "Health tips, emergency info, visitor guides",
    itemCount: 6,
    totalDuration: 150,
    updatedAt: "2026-03-20T09:00:00Z",
  },
  {
    id: "4",
    name: "Pediatria Special",
    description: "Kid-friendly content for pediatric waiting area",
    itemCount: 4,
    totalDuration: 90,
    updatedAt: "2026-03-19T16:00:00Z",
  },
];

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState(mockPlaylists);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPlaylist: Playlist = {
      id: String(Date.now()),
      name: newName,
      description: newDescription,
      itemCount: 0,
      totalDuration: 0,
      updatedAt: new Date().toISOString(),
    };
    setPlaylists([newPlaylist, ...playlists]);
    setNewName("");
    setNewDescription("");
    setShowForm(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize content into playlists for scheduling
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "New Playlist"}
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
          className="border-b-2 border-blue-600 px-1 pb-3 text-sm font-medium text-blue-600"
        >
          Playlists
        </Link>
        <Link
          href="/content/schedules"
          className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
            Create New Playlist
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Afternoon Rotation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Optional description..."
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Playlist
            </button>
          </div>
        </form>
      )}

      {/* Playlist list */}
      <div className="space-y-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="rounded-xl bg-white p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {playlist.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {playlist.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {playlist.itemCount} items
                </p>
                <p className="text-xs text-gray-500">
                  {Math.floor(playlist.totalDuration / 60)}m{" "}
                  {playlist.totalDuration % 60}s total
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Updated {new Date(playlist.updatedAt).toLocaleDateString()}
              </span>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
