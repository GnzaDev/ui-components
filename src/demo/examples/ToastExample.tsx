import { useState, useRef } from "react";
import { FlipToast, type ToastItem } from "../../FlipToast";
import {
  Sparkles,
  RotateCcw,
  UploadCloud,
  Trash2,
  Layers,
  Hand,
} from "lucide-react";

export function ToastExample() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [variant, setVariant] = useState<"capsule" | "stack">("capsule");
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

  // SCENARIO 1: Dynamic Progress Morphing
  const triggerUploadSimulation = () => {
    if (isUploading) return;
    setIsUploading(true);

    const toastId = "upload-" + Date.now();
    let currentProgress = 0;

    const initialToast: ToastItem = {
      id: toastId,
      title: "Deploying Edge Bundle",
      type: "loading",
      progress: 0,
      duration: 10000,
    };

    setToasts((prev) => [...prev.filter((t) => !t.id.startsWith("upload-")), initialToast]);

    uploadIntervalRef.current = window.setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        setIsUploading(false);
        setToasts((prev) =>
          prev.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  title: "Bundle Deployed to 35 Regions",
                  type: "success",
                  progress: undefined,
                  message: "Latency verified < 15ms globally.",
                }
              : t
          )
        );

        setTimeout(() => {
          dismissToast(toastId);
        }, 3500);
      } else {
        setToasts((prev) =>
          prev.map((t) => (t.id === toastId ? { ...t, progress: currentProgress } : t))
        );
      }
    }, 280);
  };

  // SCENARIO 2: Destructive Action with Undo
  const triggerUndoAction = () => {
    const toastId = "undo-" + Date.now();
    const item: ToastItem = {
      id: toastId,
      title: "Cluster Deleted",
      message: "Worker node us-east-2 removed.",
      type: "warning",
      action: {
        label: "Undo",
        onClick: () => {
          // Trigger restored confirmation
          const restoredId = "restored-" + Date.now();
          setToasts((prev) => [
            ...prev.filter((t) => t.id !== toastId),
            {
              id: restoredId,
              title: "Cluster Restored",
              type: "success",
              message: "Quorum recovered successfully.",
            },
          ]);
          setTimeout(() => dismissToast(restoredId), 3000);
        },
      },
    };

    setToasts((prev) => [...prev, item]);
    setTimeout(() => dismissToast(toastId), 4500);
  };

  // SCENARIO 3: Multi-Item Wave for 3D Stacking
  const triggerStackWave = () => {
    const wave: ToastItem[] = [
      {
        id: "wave-1-" + Date.now(),
        title: "Database Backup Completed",
        message: "Encrypted snapshot stored in us-west-1.",
        type: "success",
      },
      {
        id: "wave-2-" + Date.now(),
        title: "High Memory Warning",
        message: "Worker pool exceeded 85% allocated RAM.",
        type: "warning",
      },
      {
        id: "wave-3-" + Date.now(),
        title: "API Token Revoked",
        message: "Session token invalidated by admin.",
        type: "error",
      },
    ];

    setToasts((prev) => [...prev, ...wave]);
  };

  return (
    <div className="w-full space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header & Concept Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              Dual-Engine Toast Architecture
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Zero Slop
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Two distinct architectural paradigms replacing generic floating corner clones.
          </p>
        </div>

        {/* Concept Switcher */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setVariant("capsule")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              variant === "capsule"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Sparkles size={13} className="text-indigo-500" />
            <span>1. Dynamic Capsule (Pill)</span>
          </button>
          <button
            type="button"
            onClick={() => setVariant("stack")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              variant === "stack"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white font-semibold"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Layers size={13} className="text-teal-500" />
            <span>2. Physical 3D Stack (Flick)</span>
          </button>
        </div>
      </div>

      {/* Concept Architecture Breakdown */}
      <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/50 p-4 dark:border-zinc-800/70 dark:bg-zinc-800/30">
        {variant === "capsule" ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Sparkles size={14} className="text-indigo-500" />
              <span>Concept 1: Dynamic Island Capsule (Top-Center Dock)</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Lives at the top-center directly in the user’s primary line of sight. Uses <strong>Euler-Newton spring morphing</strong> to transition continuously between loading progress, interactive undo buttons, and success state snaps. Swipe up to dismiss with elastic resistance.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
              <Hand size={14} className="text-teal-500" />
              <span>Concept 2: Physical Tangible Stack (3D Perspective & Velocity Ejection)</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stacked cards with genuine 3D depth and rotation. Grab and drag cards horizontally: they tilt dynamically with the cursor. <strong>Flick to dismiss</strong> with inertia, or hover the deck to spread the cards into an interactive inspection list.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Trigger Triggers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Interactive Test Scenarios
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-400">
              Active: {toasts.length}
            </span>
            {toasts.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-mono text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
              >
                <Trash2 size={11} />
                <span>Dismiss All</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Morphing Progress */}
          <button
            type="button"
            onClick={triggerUploadSimulation}
            disabled={isUploading}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <UploadCloud size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Progress Morph
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                0% to 100% live bar &amp; success snap
              </div>
            </div>
          </button>

          {/* Action 2: Undo Timer Action */}
          <button
            type="button"
            onClick={triggerUndoAction}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <RotateCcw size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Interactive Undo Action
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Inline action button with recovery
              </div>
            </div>
          </button>

          {/* Action 3: Multi-card Stack */}
          <button
            type="button"
            onClick={triggerStackWave}
            className="flex flex-col items-start gap-1.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 cursor-pointer transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Layers size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                Spawn 3-Card Stack
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Test 3D deck and swipe ejection
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Render the selected concept */}
      <FlipToast
        toasts={toasts}
        onDismiss={dismissToast}
        variant={variant}
        position={variant === "capsule" ? "top-center" : "bottom-right"}
      />
    </div>
  );
}
