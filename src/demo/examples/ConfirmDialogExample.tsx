import { useState } from "react";
import { GonzaModal, GonzaModalTrigger } from "../../GonzaModal";
import { AlertTriangle, Trash2, Shield, CheckCircle2 } from "lucide-react";

export function ConfirmDialogExample() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const targetResource = "production-cluster-01";

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setConfirmText("");
      setOpen(false);
    }, 900);
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <AlertTriangle size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Destructive Confirm
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          High-friction confirmation dialog for mission-critical actions with text verification.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            max-w-md
          </span>
          <span>•</span>
          <span className="text-red-500 font-medium">Irreversible</span>
        </div>
      </div>

      <div className="mt-6">
        <GonzaModalTrigger
          layoutId="example-confirm-dialog"
          onClick={() => {
            setConfirmText("");
            setOpen(true);
          }}
          className="w-full text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <Trash2 size={14} />
          <span>Delete Cluster</span>
        </GonzaModalTrigger>
      </div>

      <GonzaModal
        open={open}
        onClose={() => setOpen(false)}
        layoutId="example-confirm-dialog"
        title="Delete Resource Cluster"
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={confirmText !== targetResource || isDeleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <CheckCircle2 size={14} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Permanently Delete</span>
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-red-200/80 bg-red-50/50 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <div className="flex items-center gap-2 font-semibold">
              <Shield size={14} />
              <span>Warning: This action cannot be undone</span>
            </div>
            <p className="mt-1 leading-relaxed text-red-700/90 dark:text-red-300/90">
              All container volumes, persistent databases, and load balancers will be wiped out immediately.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              To confirm, type <span className="font-mono font-bold text-zinc-900 dark:text-white select-all">{targetResource}</span> below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={targetResource}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-red-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </GonzaModal>
    </div>
  );
}
