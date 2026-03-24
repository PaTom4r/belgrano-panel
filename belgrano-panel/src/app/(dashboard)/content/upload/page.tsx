"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

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
          Back to content
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Upload Content"
          description="Add new media to your content library"
        />

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Content Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                placeholder="e.g., Spring Campaign Ad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="html5">HTML5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="5"
                max="300"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                File
              </label>
              <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-slate-300"
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
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
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
                    <p className="mt-1 text-sm text-slate-600">{file.name}</p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400">
                      MP4, PNG, JPG, HTML or ZIP up to 50MB
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview placeholder */}
            {file && (
              <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                <p className="text-sm font-medium text-slate-700">Preview</p>
                <div className="mt-2 flex items-center justify-center rounded-lg bg-slate-200 h-40">
                  <p className="text-sm text-slate-500">
                    Preview not available in demo mode
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || !name}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? "Uploading..." : "Upload Content"}
              </button>
              <Link
                href="/content"
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
