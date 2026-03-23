"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadContentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("video");
  const [duration, setDuration] = useState("15");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Placeholder — simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/content");
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/content"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
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
          Back to content
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add new media to your content library
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Spring Campaign Ad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="html5">HTML5</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="5"
              max="300"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              File
            </label>
            <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-10 w-10 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                <label className="mt-2 cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Choose file
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*,image/*,.html,.htm,.zip"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file ? (
                  <p className="mt-1 text-sm text-gray-600">{file.name}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    MP4, PNG, JPG, HTML or ZIP up to 50MB
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview placeholder */}
          {file && (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700">Preview</p>
              <div className="mt-2 flex items-center justify-center rounded-lg bg-gray-200 h-40">
                <p className="text-sm text-gray-500">
                  Preview not available in demo mode
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !name}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Uploading..." : "Upload Content"}
            </button>
            <Link
              href="/content"
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
