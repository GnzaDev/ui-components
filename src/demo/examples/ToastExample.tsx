import { useState } from "react";
import { FlipToast, type ToastItem, type ToastType } from "../../FlipToast";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export function ToastExample() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: ToastType, title: string, message: string) => {
    const newToast: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400">
          <Bell size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          FlipToast (Stacking Toasts)
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Fluid interactive notifications with spring entrance, auto-dismiss, and layout stacking.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => addToast("success", "Changes Published", "Deployment v2.4 successfully promoted to production edge.")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer"
        >
          <CheckCircle2 size={13} />
          <span>Success</span>
        </button>

        <button
          type="button"
          onClick={() => addToast("error", "Deployment Blocked", "High severity dependency vulnerability discovered.")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/50 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100/60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 cursor-pointer"
        >
          <XCircle size={13} />
          <span>Error</span>
        </button>

        <button
          type="button"
          onClick={() => addToast("warning", "Storage at 88%", "Consider upgrading your enterprise tier before the cycle ends.")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50/50 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-100/60 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 cursor-pointer"
        >
          <AlertTriangle size={13} />
          <span>Warning</span>
        </button>

        <button
          type="button"
          onClick={() => addToast("info", "Sync in Progress", "Background index rebuild started across all distributed nodes.")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200/80 bg-blue-50/50 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100/60 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer"
        >
          <Info size={13} />
          <span>Info</span>
        </button>
      </div>

      <FlipToast
        toasts={toasts}
        onDismiss={dismissToast}
        position="bottom-right"
      />
    </div>
  );
}
