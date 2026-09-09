import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

export interface FloatingAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "primary";
  disabled?: boolean;
}

export interface FloatingActionBarProps {
  open: boolean;
  selectedCount?: number;
  onClear?: () => void;
  actions: FloatingAction[];
  position?: "bottom" | "top";
  className?: string;
}

export function FloatingActionBar({
  open,
  selectedCount,
  onClear,
  actions,
  position = "bottom",
  className,
}: FloatingActionBarProps) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-x-0 z-40 flex pointer-events-none justify-center px-4",
            position === "bottom" ? "bottom-6" : "top-6"
          )}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: position === "bottom" ? 24 : -24,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: position === "bottom" ? 20 : -20,
              scale: 0.94,
            }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 30,
            }}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/95 p-1.5 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.6)]",
              className
            )}
          >
            {/* Selected Count Indicator */}
            {selectedCount !== undefined && (
              <div className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border-r border-zinc-200/80 dark:border-zinc-800">
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-bold text-white dark:bg-white dark:text-zinc-900">
                  {selectedCount}
                </span>
                <span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">
                  seleccionados
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {actions.map((act) => {
                const isDanger = act.variant === "danger";
                const isPrimary = act.variant === "primary";

                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={act.onClick}
                    disabled={act.disabled}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all active:scale-97 cursor-pointer",
                      !isDanger &&
                        !isPrimary &&
                        "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                      isPrimary &&
                        "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold shadow-xs",
                      isDanger &&
                        "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 font-medium",
                      act.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    {act.icon && <span className="text-base">{act.icon}</span>}
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Clear / Dismiss button */}
            {onClear && (
              <div className="pl-1 border-l border-zinc-200/80 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Cerrar barra de acciones"
                  className="rounded-xl p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
