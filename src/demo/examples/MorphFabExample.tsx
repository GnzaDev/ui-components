import { useState } from "react";
import { MorphFab, type FabAction } from "../../MorphFab";
import { Plus, MessageSquarePlus, Upload, UserPlus, Sparkles, Check, Layers } from "lucide-react";

export function MorphFabExample() {
  const [enabled, setEnabled] = useState(false);
  const [engine, setEngine] = useState<"gonza" | "davo">("gonza");
  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const actions: FabAction[] = [
    {
      id: "action-chat",
      label: "Start Discussion",
      icon: <MessageSquarePlus size={16} />,
      onClick: () => triggerFeedback("Discussion started!"),
    },
    {
      id: "action-upload",
      label: "Upload Assets",
      icon: <Upload size={16} />,
      badge: "Max 50MB",
      onClick: () => triggerFeedback("Upload dialog triggered!"),
    },
    {
      id: "action-member",
      label: "Invite Colleague",
      icon: <UserPlus size={16} />,
      onClick: () => triggerFeedback("Invite link generated!"),
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
            <Sparkles size={20} />
          </div>

          {/* Engine Selector */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/70 p-0.5 text-[11px] dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setEngine("gonza")}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                engine === "gonza"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Sparkles size={11} className="text-orange-500" />
              <span>Motion (Gonza)</span>
            </button>
            <button
              type="button"
              onClick={() => setEngine("davo")}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                engine === "davo"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Layers size={11} className="text-indigo-500" />
              <span>GSAP Flip (Davo)</span>
            </button>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
          MorphFab (Corner Action)
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Floating action button that morphs into an expanded menu. Test both <strong>Motion Spring</strong> and <strong>GSAP Flip</strong>.
        </p>

        <div className="mt-2 text-[11px] font-medium text-zinc-400">
          Active animation: <span className="text-orange-600 dark:text-orange-400 font-semibold">{engine === "gonza" ? "Gonza (Motion Spring Physics)" : "Davo (GSAP Flip Matrix)"}</span>
        </div>

        {feedback && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Check size={13} />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
            enabled
              ? "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
              : "border-zinc-200/80 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80"
          }`}
        >
          <Plus size={14} />
          <span>{enabled ? "Disable Corner FAB" : "Enable Corner FAB (Bottom-Right)"}</span>
        </button>
      </div>

      {enabled && (
        <MorphFab
          title="Create & Share"
          actions={actions}
          position="bottom-right"
          engine={engine}
        />
      )}
    </div>
  );
}
