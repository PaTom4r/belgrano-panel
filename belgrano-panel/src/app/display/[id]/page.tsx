"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";

// ── Types ───────────────────────────────────────────────────────────

interface PlaylistItem {
  id: string;
  type: "image" | "video" | "html5";
  url: string;
  duration: number;
  name: string;
  campaignId: string | null;
}

interface PlaylistData {
  screenId: string;
  screenName: string;
  zone: string;
  currentSchedule: string;
  items: PlaylistItem[];
  updatedAt: string;
  pollInterval: number;
}

// ── Mock gradient content (placeholder for real media URLs) ──────────

const MOCK_GRADIENTS: Record<string, string> = {
  "/mock/gradient-1": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "/mock/gradient-2": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "/mock/gradient-3": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "/mock/gradient-fallback": "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
  "/mock/video-1": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "/mock/gradient-clinic-1": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "/mock/gradient-clinic-2": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "/mock/video-clinic-1": "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "/mock/gradient-premium-1": "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  "/mock/gradient-premium-2": "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  "/mock/video-premium-1": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "/mock/video-premium-2": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "/mock/gradient-evening-1": "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "/mock/gradient-evening-2": "linear-gradient(135deg, #f5576c 0%, #ff9a9e 100%)",
  "/mock/video-evening-1": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "/mock/gradient-weekend-1": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "/mock/gradient-weekend-2": "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
  "/mock/video-weekend-1": "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "/mock/gradient-night-1": "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
  "/mock/gradient-night-2": "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
};

function getMockGradient(url: string): string {
  return MOCK_GRADIENTS[url] ?? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)";
}

function isMockUrl(url: string): boolean {
  return url.startsWith("/mock/");
}

// ── Fallback screen ─────────────────────────────────────────────────

function FallbackScreen({ message }: { message?: string }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl shadow-blue-600/30">
          <span className="text-5xl font-bold text-white">B</span>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Belgrano Digital
          </h1>
          <p className="mt-2 text-lg text-blue-300/80">
            Clinica Las Condes
          </p>
        </div>
        {message && (
          <p className="mt-4 text-sm text-slate-400">{message}</p>
        )}
      </div>
    </div>
  );
}

// ── Content renderers ───────────────────────────────────────────────

function ImageContent({ item }: { item: PlaylistItem }) {
  if (isMockUrl(item.url)) {
    return (
      <div
        className="h-full w-full"
        style={{ background: getMockGradient(item.url) }}
      >
        <div className="flex h-full w-full items-end justify-start p-8">
          <div className="rounded-lg bg-black/40 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm font-medium text-white/90">{item.name}</p>
            {item.campaignId && (
              <p className="text-xs text-white/60">{item.campaignId}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.url}
      alt={item.name}
      className="h-full w-full object-cover"
    />
  );
}

function VideoContent({
  item,
  onEnded,
}: {
  item: PlaylistItem;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {
      // Autoplay blocked — move on after duration
    });
  }, [item.url]);

  if (isMockUrl(item.url)) {
    // Mock video: show gradient with a "play" icon and auto-advance after duration
    return (
      <div
        className="h-full w-full"
        style={{ background: getMockGradient(item.url) }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
            <svg className="ml-1 h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="rounded-lg bg-black/40 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm font-medium text-white/90">{item.name}</p>
            <p className="text-xs text-white/60">Video - {item.duration}s</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={item.url}
      className="h-full w-full object-cover"
      muted
      playsInline
      onEnded={onEnded}
    />
  );
}

function Html5Content({ item }: { item: PlaylistItem }) {
  if (isMockUrl(item.url)) {
    return (
      <div
        className="h-full w-full"
        style={{ background: getMockGradient(item.url) }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-lg bg-black/40 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm font-medium text-white/90">{item.name}</p>
            <p className="text-xs text-white/60">HTML5 Widget</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={item.url}
      className="h-full w-full border-0"
      sandbox="allow-scripts allow-same-origin"
      title={item.name}
    />
  );
}

// ── Display Player ──────────────────────────────────────────────────

const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_POLL_INTERVAL = 60 * 1000; // 60 seconds

export default function DisplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playStartRef = useRef<number>(Date.now());

  // ── Fetch playlist ──────────────────────────────────────────────

  const fetchPlaylist = useCallback(async () => {
    try {
      const res = await fetch(`/api/display/${id}/playlist`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PlaylistData = await res.json();

      setPlaylist((prev) => {
        // Only update if content actually changed
        if (prev && prev.updatedAt === data.updatedAt) return prev;
        return data;
      });
      setError(null);
    } catch (err) {
      console.error("[display] Playlist fetch failed:", err);
      setError("No se pudo cargar el contenido");
    }
  }, [id]);

  // ── Report play log (fire-and-forget) ───────────────────────────

  const reportPlay = useCallback(
    (item: PlaylistItem, durationSeconds: number) => {
      fetch(`/api/display/${id}/play-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenId: id,
          contentItemId: item.id,
          campaignId: item.campaignId,
          playedAt: new Date().toISOString(),
          durationSeconds,
          zone: playlist?.zone ?? "unknown",
        }),
      }).catch(() => {
        // Fire-and-forget — don't block playback
      });
    },
    [id, playlist?.zone]
  );

  // ── Send heartbeat ──────────────────────────────────────────────

  const sendHeartbeat = useCallback(() => {
    const currentItem = playlist?.items[currentIndex];
    fetch(`/api/display/${id}/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        screenId: id,
        currentContentId: currentItem?.id ?? null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Heartbeat failure is non-critical
    });
  }, [id, playlist, currentIndex]);

  // ── Advance to next item ────────────────────────────────────────

  const advanceToNext = useCallback(() => {
    if (!playlist || playlist.items.length === 0) return;

    const currentItem = playlist.items[currentIndex];
    const elapsed = Math.round((Date.now() - playStartRef.current) / 1000);
    reportPlay(currentItem, elapsed);

    // Fade transition
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % playlist.items.length);
      playStartRef.current = Date.now();
      setIsTransitioning(false);
    }, 500);
  }, [playlist, currentIndex, reportPlay]);

  // ── Schedule next advance based on current item ─────────────────

  useEffect(() => {
    if (!playlist || playlist.items.length === 0) return;

    const item = playlist.items[currentIndex];
    if (!item) return;

    playStartRef.current = Date.now();

    // For mock videos or images/html5, use duration timer
    // Real videos use onEnded callback instead
    const useDurationTimer = item.type !== "video" || isMockUrl(item.url);

    if (useDurationTimer) {
      timerRef.current = setTimeout(advanceToNext, item.duration * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playlist, currentIndex, advanceToNext]);

  // ── Initial fetch + polling ─────────────────────────────────────

  useEffect(() => {
    fetchPlaylist();

    pollRef.current = setInterval(fetchPlaylist, DEFAULT_POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchPlaylist]);

  // ── Heartbeat ───────────────────────────────────────────────────

  useEffect(() => {
    sendHeartbeat();
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [sendHeartbeat]);

  // ── Render ──────────────────────────────────────────────────────

  if (error && !playlist) {
    return <FallbackScreen message={error} />;
  }

  if (!playlist || playlist.items.length === 0) {
    return <FallbackScreen />;
  }

  const currentItem = playlist.items[currentIndex];
  if (!currentItem) {
    return <FallbackScreen />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Content layer with fade transition */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {currentItem.type === "image" && (
          <ImageContent item={currentItem} />
        )}
        {currentItem.type === "video" && (
          <VideoContent item={currentItem} onEnded={advanceToNext} />
        )}
        {currentItem.type === "html5" && (
          <Html5Content item={currentItem} />
        )}
      </div>

      {/* Debug overlay — hidden in production, visible with ?debug=1 */}
      <DebugOverlay
        playlist={playlist}
        currentIndex={currentIndex}
        currentItem={currentItem}
      />
    </div>
  );
}

// ── Debug overlay (shows schedule & item info) ────────────────────

function DebugOverlay({
  playlist,
  currentIndex,
  currentItem,
}: {
  playlist: PlaylistData;
  currentIndex: number;
  currentItem: PlaylistItem;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get("debug") === "1");
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute right-4 top-4 z-50 rounded-lg bg-black/70 p-4 text-xs text-white backdrop-blur-sm">
      <p className="font-semibold">{playlist.screenName}</p>
      <p className="text-white/60">{playlist.zone}</p>
      <p className="mt-1 text-blue-300">{playlist.currentSchedule}</p>
      <hr className="my-2 border-white/20" />
      <p>
        Item {currentIndex + 1}/{playlist.items.length}
      </p>
      <p className="text-white/80">{currentItem.name}</p>
      <p className="text-white/50">
        {currentItem.type} - {currentItem.duration}s
      </p>
    </div>
  );
}
