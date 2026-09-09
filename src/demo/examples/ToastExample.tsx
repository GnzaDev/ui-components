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
  AlertCircle,
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
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // SCENARIO 1: Live Progress Morphing
  const triggerUploadSimulation = () => {
    if (isUploading) return;
    setIsUploading(true);

    const toastId = "deploy-" + Date.now();
    let currentProgress = 0;

    const initialToast: ToastItem = {
      id: toastId,
      title: "Uploading build assets...",
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
                  title: "Build published successfully",
                  type: "success",
                  progress: undefined,
                  message: "Changes live on global edge CDN.",
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
    }, 250);
  };

  // SCENARIO 2: Action with Undo & Shortcut
  const triggerUndoAction = () => {
    const toastId = "delete-" + Date.now();
    const item: ToastItem = {
      id: toastId,
      title: "Project moved to trash",
      message: "You have 30 days to restore this workspace.",
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
              title: "Project restored",
              type: "success",
              message: "Workspace and members reinstated.",
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

  // SCENARIO 3: Minimalist 3-Card Stack Wave
  const triggerStackWave = () => {
    const time = getFormattedTime();
    const wave: ToastItem[] = [
      {
        id: "card-1-" + Date.now(),
        title: "Workspace invited",
        message: "Sarah accepted the design team invitation.",
        type: "info",
        timestamp: time,
      },
      {
        id: "card-2-" + Date.now(),
        title: "Storage quota alert",
        message: "You have reached 85% of your team storage limit.",
        type: "warning",
        timestamp: time,
      },
      {
        id: "card-3-" + Date.now(),
        title: "Deployment completed",
        message: "v2.4.0 deployed without errors in 18s.",
        type: "success",
        timestamp: time,
      },
    ];

    setToasts((prev) => [...prev, ...wave]);
  };

  // SCENARIO 4: Real Application Error
  const triggerErrorAlert = () => {
    const toastId = "err-" + Date.now();
    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        title: "Failed to sync changes",
        message: "Network request timed out. Retrying in background.",
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
              Clean High-Contrast
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Minimalist notifications built with physical spring physics and restrained typography.
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
            <span>1. Compact Capsule (HUD Pill)</span>
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
            <span>2. Minimal Stack (Swiss Deck)</span>
          </button>
        </div>
      </div>

      {/* Concept Architecture Description */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        {variant === "capsule" ? (
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Sparkles size={14} className="text-indigo-500" />
              <span>Compact Capsule (Floating Island Pill)</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ultra-tight smoked glass pill (<code>h-9</code>, max 320px) with semantic micro-dot, truncated title, live progress bar, and vertical drag dismiss.
            </p>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Layers size={14} className="text-emerald-500" />
              <span>Minimal Stack (Swiss Deck Precision)</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Restrained dark matte card (<code>w-76</code>) with clean typography and semantic status dots. Older items tuck underneath in physical depth and smoothly fan out on hover. Drag horizontally to flick dismiss.
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
                Live Progress
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                0% to 100% progress animation
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
                Undo Recovery (⌘Z)
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Temporary action recovery button
              </div>
            </div>
          </button>

          {/* Action 3: Minimalist Card Stack */}
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
                Spawn 3-Card Stack
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Physical depth &amp; hover fan-out
              </div>
            </div>
          </button>

          {/* Action 4: Sync Error */}
          <button
            type="button"
            onClick={triggerErrorAlert}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertCircle size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Sync Error Alert
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Network timeout notification
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
