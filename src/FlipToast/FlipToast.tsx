import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "../utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export interface FlipToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "top-center" | "bottom-center";
}

export function FlipToast({
  toasts,
  onDismiss,
  position = "bottom-right",
}: FlipToastProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "bottom-6 right-6 flex-col-reverse items-end";
      case "bottom-left":
        return "bottom-6 left-6 flex-col-reverse items-start";
      case "top-right":
        return "top-6 right-6 flex-col items-end";
      case "top-left":
        return "top-6 left-6 flex-col items-start";
      case "top-center":
        return "top-6 left-1/2 -translate-x-1/2 flex-col items-center";
      case "bottom-center":
        return "bottom-6 left-1/2 -translate-x-1/2 flex-col-reverse items-center";
      default:
        return "bottom-6 right-6 flex-col-reverse items-end";
    }
  };

  const getIcon = (type: ToastType = "info") => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
      case "error":
        return <XCircle size={16} className="text-red-500 shrink-0" />;
      case "warning":
        return <AlertTriangle size={16} className="text-amber-500 shrink-0" />;
      case "info":
      default:
        return <Info size={16} className="text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className={cn("fixed z-50 pointer-events-none flex gap-2.5 max-w-sm w-full px-4 sm:px-0", getPositionClasses())}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: position.startsWith("top") ? -20 : 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
            className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-2xl"
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-semibold text-zinc-950 dark:text-white">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
