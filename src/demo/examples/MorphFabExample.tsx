import { useState } from "react";
import { MorphFab, type FabAction } from "../../MorphFab";
import {
  Plus,
  MessageSquarePlus,
  Upload,
  UserPlus,
  Check,
  Terminal,
  Play,
  Layers,
  Send,
  Mic,
  Paperclip,
} from "lucide-react";

type CornerPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
type FabPreset = "creative" | "developer" | "composer";

export function MorphFabExample() {
  const [enabled, setEnabled] = useState(false);
  const [engine, setEngine] = useState<"sway" | "davo">("sway");
  const [position, setPosition] = useState<CornerPosition>("bottom-right");
  const [preset, setPreset] = useState<FabPreset>("creative");
  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const PRESETS: Record<FabPreset, { title: string; actions: FabAction[] }> = {
    creative: {
      title: "Create & Share",
      actions: [
        {
          id: "action-chat",
          label: "Start Discussion",
          icon: <MessageSquarePlus size={16} />,
          onClick: () => triggerFeedback("Discussion thread opened!"),
        },
        {
          id: "action-upload",
          label: "Upload Assets",
          icon: <Upload size={16} />,
          badge: "50MB",
          onClick: () => triggerFeedback("Asset uploader ready!"),
        },
        {
          id: "action-member",
          label: "Invite Colleague",
          icon: <UserPlus size={16} />,
          onClick: () => triggerFeedback("Invite link copied!"),
        },
      ],
    },
    developer: {
      title: "Dev Tools",
      actions: [
        {
          id: "action-terminal",
          label: "Open Shell",
          icon: <Terminal size={16} />,
          onClick: () => triggerFeedback("Terminal attached on port 5173!"),
        },
        {
          id: "action-run",
          label: "Run Benchmark",
          icon: <Play size={16} />,
          badge: "60fps",
          onClick: () => triggerFeedback("Matrix FPS test completed!"),
        },
        {
          id: "action-inspect",
          label: "Inspect DOM Top-Layer",
          icon: <Layers size={16} />,
          onClick: () => triggerFeedback("Top-layer stack inspected!"),
        },
      ],
    },
    composer: {
      title: "Quick Composer",
      actions: [
        {
          id: "action-send",
          label: "Send Message",
          icon: <Send size={16} />,
          onClick: () => triggerFeedback("Message dispatched!"),
        },
        {
          id: "action-mic",
          label: "Record Voice Note",
          icon: <Mic size={16} />,
          badge: "HD",
          onClick: () => triggerFeedback("Audio recording started!"),
        },
        {
          id: "action-attach",
          label: "Attach Document",
          icon: <Paperclip size={16} />,
          onClick: () => triggerFeedback("File picker opened!"),
        },
      ],
    },
  };

  const activePresetData = PRESETS[preset];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 w-full space-y-6">
      <div className="space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              MorphFab Corner Coordinates
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Dimensional expanding button without radial scale distortion.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setEngine("sway")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                engine === "sway"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Sway (Spring)
            </button>
            <button
              type="button"
              onClick={() => setEngine("davo")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                engine === "davo"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Davo (FLIP)
            </button>
          </div>
        </div>

        {/* Position & Scenario Selectors */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Position Matrix */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Corner Placement ({position})
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(["bottom-right", "bottom-left", "top-right", "top-left"] as CornerPosition[]).map((pos) => (
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

          {/* Preset Scenario */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Action Preset ({preset})
            </label>
            <div className="space-y-1.5">
              {(["creative", "developer", "composer"] as FabPreset[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreset(p)}
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer text-left flex items-center justify-between ${
                    preset === p
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 font-medium"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="capitalize">{p} Actions</span>
                  <span className="text-[10px] font-mono opacity-60">
                    {PRESETS[p].actions.length} items
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {feedback && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Check size={13} />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Trigger Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-medium transition-colors cursor-pointer ${
            enabled
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
              : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          }`}
        >
          <Plus size={14} />
          <span>{enabled ? `Disable FAB (${position})` : `Mount FAB at ${position}`}</span>
        </button>
      </div>

      {enabled && (
        <MorphFab
          title={activePresetData.title}
          actions={activePresetData.actions}
          position={position}
          engine={engine}
        />
      )}
    </div>
  );
}
