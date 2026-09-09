import { useState } from "react";
import { SwayModal, SwayModalTrigger } from "../../SwayModal";
import { AlertTriangle, Trash2, Shield, CheckCircle2, Save, Sparkles } from "lucide-react";

type ConfirmVariant = "destructive" | "unsaved" | "upgrade";

export function ConfirmDialogExample() {
  const [variant, setVariant] = useState<ConfirmVariant>("destructive");
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const targetResource = "production-cluster-01";

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmText("");
      setOpen(false);
    }, 800);
  };

  const getVariantData = () => {
    switch (variant) {
      case "destructive":
        return {
          title: "Delete Production Cluster",
          maxWidth: "max-w-md",
          triggerText: "Delete Cluster",
          triggerClass: "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40",
          icon: <Trash2 size={14} />,
        };
      case "unsaved":
        return {
          title: "Unsaved Changes",
          maxWidth: "max-w-sm",
          triggerText: "Discard Draft",
          triggerClass: "border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-400 dark:hover:bg-amber-950/40",
          icon: <Save size={14} />,
        };
      case "upgrade":
        return {
          title: "Confirm Subscription Upgrade",
          maxWidth: "max-w-md",
          triggerText: "Upgrade to Enterprise",
          triggerClass: "border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100",
          icon: <Sparkles size={14} />,
        };
    }
  };

  const current = getVariantData();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 w-full space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              ConfirmDialog Scenarios
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Modal confirmations with layoutId morphing and friction guards.
            </p>
          </div>

          {/* Variant Selector */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => {
                setVariant("destructive");
                setConfirmText("");
              }}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                variant === "destructive"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Destructive
            </button>
            <button
              type="button"
              onClick={() => {
                setVariant("unsaved");
                setConfirmText("");
              }}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                variant === "unsaved"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Unsaved Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setVariant("upgrade");
                setConfirmText("");
              }}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                variant === "upgrade"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Upgrade
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Currently testing: <span className="font-mono text-zinc-900 dark:text-white">{variant}</span> scenario. The dialog physically expands from the trigger button.
        </p>
      </div>

      <div className="pt-2">
        <SwayModalTrigger
          layoutId={`example-confirm-${variant}`}
          onClick={() => {
            setConfirmText("");
            setOpen(true);
          }}
          className={`w-full text-xs font-medium h-10 ${current.triggerClass}`}
        >
          {current.icon}
          <span>Trigger {current.triggerText}</span>
        </SwayModalTrigger>
      </div>

      <SwayModal
        open={open}
        onClose={() => setOpen(false)}
        layoutId={`example-confirm-${variant}`}
        title={current.title}
        maxWidth={current.maxWidth}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {variant === "unsaved" ? "Keep Editing" : "Cancel"}
            </button>
            <button
              type="button"
              disabled={
                variant === "destructive"
                  ? confirmText !== targetResource || isProcessing
                  : isProcessing
              }
              onClick={handleAction}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-white shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700"
                  : variant === "unsaved"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              }`}
            >
              {isProcessing ? (
                <>
                  <CheckCircle2 size={13} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : variant === "destructive" ? (
                <span>Permanently Delete</span>
              ) : variant === "unsaved" ? (
                <span>Discard Changes</span>
              ) : (
                <span>Confirm Upgrade ($99/mo)</span>
              )}
            </button>
          </div>
        }
      >
        {variant === "destructive" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <Shield size={13} />
                <span>Irreversible Action</span>
              </div>
              <p className="mt-1 leading-relaxed text-red-700/90 dark:text-red-300/90">
                All attached persistent volumes, DNS bindings, and redis replicas will be purged.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Type <span className="font-mono font-bold text-zinc-900 dark:text-white select-all">{targetResource}</span> to verify:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={targetResource}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {variant === "unsaved" && (
          <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
              <AlertTriangle size={15} />
              <span>You have unsaved changes</span>
            </div>
            <p>
              Leaving this view now will lose changes made to <strong className="text-zinc-900 dark:text-white">animationTokens.ts</strong>. Are you sure you want to discard?
            </p>
          </div>
        )}

        {variant === "upgrade" && (
          <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <p>
              Upgrading your workspace to <strong className="text-zinc-900 dark:text-white">Enterprise Plan</strong> unlocks:
            </p>
            <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
              <li>Unlimited Dual-Engine instances</li>
              <li>Priority FLIP matrix calculations</li>
              <li>Custom spring presets & SLA guarantee</li>
            </ul>
          </div>
        )}
      </SwayModal>
    </div>
  );
}
