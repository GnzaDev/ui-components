import { useState } from "react";
import { FlipToast, type ToastItem, type ToastType } from "../../FlipToast";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  Trash2,
} from "lucide-react";

type ToastPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-center";

export function ToastExample() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [position, setPosition] = useState<ToastPosition>("bottom-right");

  const addToast = (type: ToastType, title: string, message: string) => {
    const newToast: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const spawnWave = () => {
    const batch: ToastItem[] = [
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "Cluster Connected",
        message: "Worker pool us-east-1 re-established quorum.",
        type: "success",
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "Latency Spike Detected",
        message: "P99 latency elevated to 142ms on /api/v1/checkout.",
        type: "warning",
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "Cache Eviction",
        message: "L2 redis cache pruned 14,200 stale tokens.",
        type: "info",
      },
    ];

    setToasts((prev) => [...prev, ...batch]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 w-full space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              FlipToast (Physics Stacking)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Spring-powered toast queue with layout projection and physical dismissal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-400">
              Active: {toasts.length}
            </span>
            {toasts.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-mono text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
              >
                <Trash2 size={11} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Position Matrix (6 positions) */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Viewport Placement ({position})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {(
              [
                "bottom-right",
                "bottom-center",
                "bottom-left",
                "top-right",
                "top-center",
                "top-left",
              ] as ToastPosition[]
            ).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPosition(pos)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-mono transition-colors cursor-pointer text-left ${
                  position === pos
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 font-medium"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Toast Triggers
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() =>
                addToast(
                  "success",
                  "Changes Published",
                  "Deployment v2.4 successfully promoted to edge."
                )
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Success</span>
            </button>

            <button
              type="button"
              onClick={() =>
                addToast(
                  "error",
                  "Request Timeout",
                  "Upstream gateway 504 on RPC handler."
                )
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <XCircle size={13} className="text-red-500" />
              <span>Error</span>
            </button>

            <button
              type="button"
              onClick={() =>
                addToast(
                  "warning",
                  "Quota at 92%",
                  "Monthly egress limit approaching capacity."
                )
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <AlertTriangle size={13} className="text-amber-500" />
              <span>Warning</span>
            </button>

            <button
              type="button"
              onClick={() =>
                addToast(
                  "info",
                  "Syncing Cache",
                  "Distributed nodes reindexing active collections."
                )
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <Info size={13} className="text-blue-500" />
              <span>Info</span>
            </button>
          </div>
        </div>

        {/* Multi-item test */}
        <div className="pt-2">
          <button
            type="button"
            onClick={spawnWave}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer transition-colors"
          >
            <Sparkles size={13} />
            <span>Spawn Stacking Wave (Test 3 Simultaneous Toasts)</span>
          </button>
        </div>
      </div>

      <FlipToast
        toasts={toasts}
        onDismiss={dismissToast}
        position={position}
      />
    </div>
  );
}
