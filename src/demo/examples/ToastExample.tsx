import { useState, useRef } from "react";
import {
  FlipToast,
  type ToastItem,
  type ToastPosition,
} from "../../FlipToast";
import {
  Sparkles,
  RotateCcw,
  UploadCloud,
  Trash2,
  Layers,
  Compass,
  AlertOctagon,
} from "lucide-react";

export function ToastExample() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [variant, setVariant] = useState<"capsule" | "stack">("capsule");
  const [position, setPosition] = useState<ToastPosition>("top-center");
  const [isUploading, setIsUploading] = useState(false);
  const uploadIntervalRef = useRef<number | null>(null);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    setIsUploading(false);
  };

  const getFormattedTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  // SCENARIO 1: Live Progress Morphing
  const triggerUploadSimulation = () => {
    if (isUploading) return;
    setIsUploading(true);

    const toastId = "deploy-" + Date.now();
    let currentProgress = 0;

    const initialToast: ToastItem = {
      id: toastId,
      title: "Deploying Edge Bundle",
      statusCode: "COMPILING",
      type: "loading",
      progress: 0,
      timestamp: getFormattedTime(),
      duration: 10000,
    };

    setToasts((prev) => [...prev.filter((t) => !t.id.startsWith("deploy-")), initialToast]);

    uploadIntervalRef.current = window.setInterval(() => {
      currentProgress += 16;
      if (currentProgress >= 100) {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        setIsUploading(false);
        setToasts((prev) =>
          prev.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  title: "Bundle Deployed to 35 Regions",
                  statusCode: "200 OK",
                  type: "success",
                  progress: undefined,
                  message: "P99 latency verified < 12ms globally.",
                }
              : t
          )
        );

        setTimeout(() => {
          dismissToast(toastId);
        }, 4000);
      } else {
        setToasts((prev) =>
          prev.map((t) => (t.id === toastId ? { ...t, progress: currentProgress } : t))
        );
      }
    }, 260);
  };

  // SCENARIO 2: Destructive Action with Undo & Shortcut
  const triggerUndoAction = () => {
    const toastId = "delete-" + Date.now();
    const item: ToastItem = {
      id: toastId,
      title: "Cluster Deleted",
      statusCode: "ROLLBACK",
      message: "Worker pool us-east-02 detached.",
      type: "warning",
      timestamp: getFormattedTime(),
      action: {
        label: "Undo",
        shortcut: "⌘Z",
        onClick: () => {
          const restoredId = "restored-" + Date.now();
          setToasts((prev) => [
            ...prev.filter((t) => t.id !== toastId),
            {
              id: restoredId,
              title: "Cluster Restored",
              statusCode: "RESTORED",
              type: "success",
              message: "Quorum recovered with 0 dropped packets.",
              timestamp: getFormattedTime(),
            },
          ]);
          setTimeout(() => dismissToast(restoredId), 3500);
        },
      },
    };

    setToasts((prev) => [...prev, item]);
    setTimeout(() => dismissToast(toastId), 5000);
  };

  // SCENARIO 3: Telemetry Studio Slip Stack Wave
  const triggerStackWave = () => {
    const wave: ToastItem[] = [
      {
        id: "slip-1-" + Date.now(),
        title: "L2 Redis Cache Eviction",
        statusCode: "CACHE_SYNC",
        message: "Pruned 14,280 expired session tokens across shards.",
        type: "info",
        timestamp: getFormattedTime(),
      },
      {
        id: "slip-2-" + Date.now(),
        title: "Elevated Memory Pressure",
        statusCode: "HEAP_91%",
        message: "Node worker #04 memory ceiling reached 1.82 GB.",
        type: "warning",
        timestamp: getFormattedTime(),
      },
      {
        id: "slip-3-" + Date.now(),
        title: "Session Token Invalidation",
        statusCode: "AUTH_EXPIRE",
        message: "Admin security challenge forced global session reset.",
        type: "error",
        timestamp: getFormattedTime(),
      },
    ];

    setToasts((prev) => [...prev, ...wave]);
  };

  // SCENARIO 4: Upstream Timeout Error
  const triggerErrorAlert = () => {
    const toastId = "err-" + Date.now();
    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        title: "Upstream Gateway Timeout",
        statusCode: "ERR_504",
        message: "RPC health check failed on edge proxy /billing-sync.",
        type: "error",
        timestamp: getFormattedTime(),
      },
    ]);
    setTimeout(() => dismissToast(toastId), 4500);
  };

  return (
    <div className="w-full space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header & Concept Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              Tactile Toast Architecture
            </h3>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              High Contrast HUD
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Beyond generic white boxes: hardware-inspired dynamic pills and engineered telemetry slips.
          </p>
        </div>

        {/* Concept Switcher */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setVariant("capsule")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              variant === "capsule"
                ? "bg-zinc-950 text-white shadow-xs dark:bg-white dark:text-zinc-950 font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Sparkles size={13} className="text-indigo-400" />
            <span>1. Dynamic Capsule HUD</span>
          </button>
          <button
            type="button"
            onClick={() => setVariant("stack")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              variant === "stack"
                ? "bg-zinc-950 text-white shadow-xs dark:bg-white dark:text-zinc-950 font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Layers size={13} className="text-emerald-400" />
            <span>2. Studio Slip Stack (3D)</span>
          </button>
        </div>
      </div>

      {/* Concept Architecture Description */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        {variant === "capsule" ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Sparkles size={14} className="text-indigo-500" />
              <span>Dynamic Capsule HUD (Smoked Glass &amp; Optical Rim)</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Lives in high-contrast smoked glass (<code>bg-zinc-950/95</code>) with a perimeter optical ring (<code>ring-1 ring-white/15</code>). Features live status chips (<code>200 OK</code>, <code>ROLLBACK</code>), real-time progress bars, pulsing micro-beacons, and keyboard shortcuts. Discard by dragging vertically with spring recoil.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Layers size={14} className="text-emerald-500" />
              <span>Studio Slip Stack (Engineered Telemetry &amp; Inertial Flick)</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No generic white boxes: modeled after developer console slips with real-time timestamps (<code>01:50:12</code>), telemetry status badges, glowing accent rails, and tactile drag grips. Grab and rotate with 3D perspective, or flick to eject. Hover the deck to fan out older items.
            </p>
          </div>
        )}
      </div>

      {/* 6-Position Matrix Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass size={12} />
            <span>Viewport Anchor Point: <span className="text-zinc-900 dark:text-white font-semibold">{position}</span></span>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(
            [
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ] as ToastPosition[]
          ).map((pos) => {
            const isSelected = position === pos;
            return (
              <button
                key={pos}
                type="button"
                onClick={() => setPosition(pos)}
                className={`rounded-xl border px-3 py-2 text-xs font-mono transition-all cursor-pointer text-center ${
                  isSelected
                    ? "border-zinc-950 bg-zinc-950 text-white font-semibold shadow-xs dark:border-white dark:bg-white dark:text-zinc-950"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {pos}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Trigger Buttons */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Interactive Test Triggers
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-400">
              Active in queue: {toasts.length}
            </span>
            {toasts.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-mono text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer transition-colors"
              >
                <Trash2 size={11} />
                <span>Dismiss All</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action 1: Live Progress Morph */}
          <button
            type="button"
            onClick={triggerUploadSimulation}
            disabled={isUploading}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/60 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <UploadCloud size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Progress Morph
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                0% to 100% bar + 200 OK snap
              </div>
            </div>
          </button>

          {/* Action 2: Destructive Action with Undo & Shortcut */}
          <button
            type="button"
            onClick={triggerUndoAction}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <RotateCcw size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Interactive Undo (⌘Z)
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Action recovery button with timer
              </div>
            </div>
          </button>

          {/* Action 3: Telemetry Slip Stack Wave */}
          <button
            type="button"
            onClick={triggerStackWave}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Layers size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Spawn 3-Slip Stack
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                3D deck tilt &amp; velocity swipe
              </div>
            </div>
          </button>

          {/* Action 4: Anomaly Timeout */}
          <button
            type="button"
            onClick={triggerErrorAlert}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertOctagon size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Laser Anomaly (504)
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                RPC health check timeout
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mount active Toast Engine */}
      <FlipToast
        toasts={toasts}
        onDismiss={dismissToast}
        variant={variant}
        position={position}
      />
    </div>
  );
}
