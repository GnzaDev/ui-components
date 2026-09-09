import { useRef, useState } from "react";
import { SwayModal, SwayModalTrigger } from "../../SwayModal";
import { DavoModal } from "../../DavoModal";
import {
  AlertTriangle,
  Trash2,
  Shield,
  CheckCircle2,
  Save,
  Sparkles,
  Layers,
  Server,
  FileCode,
  CreditCard,
} from "lucide-react";

type ModalType = "destructive" | "unsaved" | "upgrade" | null;

export function ConfirmDialogExample() {
  const [engine, setEngine] = useState<"sway" | "davo">("sway");
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Form states inside modals
  const [confirmText, setConfirmText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const targetResource = "production-cluster-01";

  // Trigger refs for Davo GSAP Flip engine
  const destructiveTriggerRef = useRef<HTMLButtonElement>(null);
  const unsavedTriggerRef = useRef<HTMLButtonElement>(null);
  const upgradeTriggerRef = useRef<HTMLButtonElement>(null);

  const handleAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmText("");
      setActiveModal(null);
    }, 800);
  };

  const closeModal = () => {
    setConfirmText("");
    setActiveModal(null);
  };

  return (
    <div className="w-full space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header & Engine Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            ConfirmDialog Scenarios
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Interactive confirmation modals with dual physics engines and proportional button origins.
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setEngine("sway")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              engine === "sway"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Sparkles size={12} className="text-indigo-500" />
            <span>Motion (Sway)</span>
          </button>
          <button
            type="button"
            onClick={() => setEngine("davo")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              engine === "davo"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Layers size={12} className="text-teal-500" />
            <span>GSAP FLIP (Davo)</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {engine === "sway" ? "Euler-Newton Springs (layoutId)" : "Native <dialog> + PRETTY_EASE (0.7s)"}
        </span>
        <span>•</span>
        <span>Click any scenario below to trigger its modal directly</span>
      </div>

      {/* 3 Real-World Scenario Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1: Destructive */}
        <div className="flex flex-col justify-between rounded-2xl border border-red-100 bg-red-50/30 p-4.5 dark:border-red-950/50 dark:bg-red-950/20">
          <div className="space-y-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-400">
              <Server size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                Cluster Maintenance
              </h4>
              <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                Resource: <span className="font-mono text-zinc-700 dark:text-zinc-300">{targetResource}</span>
              </p>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Purges all persistent volumes, redis nodes, and DNS bindings.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-red-100/80 dark:border-red-950/60">
            {engine === "sway" ? (
              <SwayModalTrigger
                layoutId="confirm-dialog-destructive"
                onClick={() => {
                  setConfirmText("");
                  setActiveModal("destructive");
                }}
                className="w-auto px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40 text-xs font-semibold"
              >
                <Trash2 size={13} />
                <span>Delete Cluster</span>
              </SwayModalTrigger>
            ) : (
              <button
                ref={destructiveTriggerRef}
                type="button"
                onClick={() => {
                  setConfirmText("");
                  setActiveModal("destructive");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow-xs hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete Cluster</span>
              </button>
            )}
          </div>
        </div>

        {/* Scenario 2: Unsaved Changes */}
        <div className="flex flex-col justify-between rounded-2xl border border-amber-100 bg-amber-50/30 p-4.5 dark:border-amber-950/50 dark:bg-amber-950/20">
          <div className="space-y-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400">
              <FileCode size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                Unsaved Code Draft
              </h4>
              <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                File: <span className="font-mono text-zinc-700 dark:text-zinc-300">animationTokens.ts</span>
              </p>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Modifications have not been synced to your remote branch yet.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100/80 dark:border-amber-950/60">
            {engine === "sway" ? (
              <SwayModalTrigger
                layoutId="confirm-dialog-unsaved"
                onClick={() => setActiveModal("unsaved")}
                className="w-auto px-4 py-2 border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-400 dark:hover:bg-amber-950/40 text-xs font-semibold"
              >
                <Save size={13} />
                <span>Discard Draft</span>
              </SwayModalTrigger>
            ) : (
              <button
                ref={unsavedTriggerRef}
                type="button"
                onClick={() => setActiveModal("unsaved")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-700 shadow-xs hover:bg-amber-50 dark:border-amber-900/60 dark:bg-zinc-900 dark:text-amber-400 dark:hover:bg-amber-950/40 cursor-pointer transition-colors"
              >
                <Save size={13} />
                <span>Discard Draft</span>
              </button>
            )}
          </div>
        </div>

        {/* Scenario 3: Plan Upgrade */}
        <div className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4.5 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="space-y-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
              <CreditCard size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                Workspace Quota
              </h4>
              <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                Current Tier: <span className="font-semibold text-zinc-700 dark:text-zinc-300">Starter (Free)</span>
              </p>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Unlock unlimited dual-engine instances and priority support.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-700/80">
            {engine === "sway" ? (
              <SwayModalTrigger
                layoutId="confirm-dialog-upgrade"
                onClick={() => setActiveModal("upgrade")}
                className="w-auto px-4 py-2 border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-semibold"
              >
                <Sparkles size={13} />
                <span>Upgrade to Enterprise</span>
              </SwayModalTrigger>
            ) : (
              <button
                ref={upgradeTriggerRef}
                type="button"
                onClick={() => setActiveModal("upgrade")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <Sparkles size={13} />
                <span>Upgrade to Enterprise</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SWAY MODALS (Euler-Newton Spring Physics with layoutId) */}
      {/* ========================================================= */}
      {engine === "sway" && (
        <>
          {/* Destructive Modal */}
          <SwayModal
            open={activeModal === "destructive"}
            onClose={closeModal}
            layoutId="confirm-dialog-destructive"
            title="Delete Production Cluster"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmText !== targetResource || isProcessing}
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-red-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle2 size={13} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Shield size={13} />
                  <span>Irreversible Action</span>
                </div>
                <p className="mt-1 leading-relaxed text-red-700/90 dark:text-red-300/90">
                  All attached persistent volumes, DNS bindings, and redis replicas will be permanently destroyed.
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
          </SwayModal>

          {/* Unsaved Changes Modal */}
          <SwayModal
            open={activeModal === "unsaved"}
            onClose={closeModal}
            layoutId="confirm-dialog-unsaved"
            title="Unsaved Changes"
            maxWidth="max-w-sm"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-amber-700 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle2 size={13} className="animate-spin" />
                      <span>Discarding...</span>
                    </>
                  ) : (
                    <span>Discard Changes</span>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                <AlertTriangle size={15} />
                <span>You have unsaved changes</span>
              </div>
              <p>
                Leaving this view now will lose changes made to <strong className="text-zinc-900 dark:text-white font-mono">animationTokens.ts</strong>. Are you sure you want to discard?
              </p>
            </div>
          </SwayModal>

          {/* Upgrade Modal */}
          <SwayModal
            open={activeModal === "upgrade"}
            onClose={closeModal}
            layoutId="confirm-dialog-upgrade"
            title="Upgrade Subscription"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Maybe Later
                </button>
                <button
                  type="button"
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle2 size={13} className="animate-spin" />
                      <span>Upgrading...</span>
                    </>
                  ) : (
                    <span>Confirm Upgrade ($99/mo)</span>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                Upgrading your workspace to <strong className="text-zinc-900 dark:text-white">Enterprise Plan</strong> unlocks:
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <li>Unlimited Dual-Engine instances</li>
                <li>Priority FLIP matrix calculations</li>
                <li>Custom spring presets &amp; 99.99% SLA guarantee</li>
              </ul>
            </div>
          </SwayModal>
        </>
      )}

      {/* ============================================================ */}
      {/* 2. DAVO MODALS (Native <dialog> + GSAP Flip PRETTY_EASE 0.7s) */}
      {/* ============================================================ */}
      {engine === "davo" && (
        <>
          {/* Destructive Davo Modal */}
          <DavoModal
            open={activeModal === "destructive"}
            onClose={closeModal}
            triggerRef={destructiveTriggerRef}
            title="Delete Production Cluster"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmText !== targetResource || isProcessing}
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-red-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle2 size={13} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Shield size={13} />
                  <span>Irreversible Action (Davo FLIP)</span>
                </div>
                <p className="mt-1 leading-relaxed text-red-700/90 dark:text-red-300/90">
                  All attached persistent volumes, DNS bindings, and redis replicas will be permanently destroyed.
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
          </DavoModal>

          {/* Unsaved Changes Davo Modal */}
          <DavoModal
            open={activeModal === "unsaved"}
            onClose={closeModal}
            triggerRef={unsavedTriggerRef}
            title="Unsaved Changes"
            maxWidth="max-w-sm"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-amber-700 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle2 size={13} className="animate-spin" />
                      <span>Discarding...</span>
                    </>
                  ) : (
                    <span>Discard Changes</span>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                <AlertTriangle size={15} />
                <span>You have unsaved changes (Davo FLIP)</span>
              </div>
              <p>
                Leaving this view now will lose changes made to <strong className="text-zinc-900 dark:text-white font-mono">animationTokens.ts</strong>. Are you sure you want to discard?
              </p>
            </div>
          </DavoModal>

          {/* Upgrade Davo Modal */}
          <DavoModal
            open={activeModal === "upgrade"}
            onClose={closeModal}
            triggerRef={upgradeTriggerRef}
            title="Upgrade Subscription"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Maybe Later
                </button>
                <button
                  type="button"
                  onClick={handleAction}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle2 size={13} className="animate-spin" />
                      <span>Upgrading...</span>
                    </>
                  ) : (
                    <span>Confirm Upgrade ($99/mo)</span>
                  )}
                </button>
              </div>
            }
          >
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                Upgrading your workspace to <strong className="text-zinc-900 dark:text-white">Enterprise Plan</strong> unlocks:
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <li>Unlimited Dual-Engine instances</li>
                <li>Priority FLIP matrix calculations</li>
                <li>Custom spring presets &amp; 99.99% SLA guarantee</li>
              </ul>
            </div>
          </DavoModal>
        </>
      )}
    </div>
  );
}
