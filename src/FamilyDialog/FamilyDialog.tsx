/**
 * FamilyDialog & FamilyStepperDialog
 *
 * Interaction design inspired by Family App (https://family.co)
 * and morphing dialog techniques popularized by Emil Kowalski (https://animations.dev).
 * Developed for Sway UI (@gonza/ui-components) by Gonza.
 * Uses the View Transition API or Motion springs. Does NOT belong to Davo's FLIP engine.
 */

import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X, Check } from "lucide-react";
import { cn } from "../utils/cn";
import { SWAY_SPRINGS } from "../utils/animationTokens";
import { useScrollLock } from "../utils/useScrollLock";


export interface FamilyDialogProps {
  /** Controlled open state */
  open?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Dialog title */
  title?: string;
  /** Header icon */
  icon?: React.ReactNode;
  /** Dialog description or body */
  description?: React.ReactNode;
  /** Primary button label that morphs with trigger */
  actionLabel?: string;
  /** Secondary button label */
  cancelLabel?: string;
  /** Primary action callback */
  onConfirm?: () => void;
  /** Secondary cancel callback */
  onCancel?: () => void;
  /** Color theme for the morphing action button */
  variant?: "mint" | "destructive" | "indigo" | "amber";
  /** Animation engine strategy */
  engine?: "view-transition" | "spring";
  /** If true, confines modal within parent container */
  inline?: boolean;
  /** Additional trigger class */
  triggerClassName?: string;
  /** Custom trigger label if different from actionLabel */
  triggerLabel?: string;
}

const VARIANT_STYLES = {
  mint: {
    buttonBg: "bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-xs",
    buttonText: "text-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60",
    modalBorder: "border-zinc-200 dark:border-zinc-800",
  },
  destructive: {
    buttonBg: "bg-rose-500 hover:bg-rose-600 text-white shadow-xs",
    buttonText: "text-white",
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60",
    modalBorder: "border-zinc-200 dark:border-zinc-800",
  },
  indigo: {
    buttonBg: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs",
    buttonText: "text-white",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60",
    modalBorder: "border-zinc-200 dark:border-zinc-800",
  },
  amber: {
    buttonBg: "bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-xs",
    buttonText: "text-zinc-950",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60",
    modalBorder: "border-zinc-200 dark:border-zinc-800",
  },
};

export function FamilyDialog({
  open: controlledOpen,
  onOpenChange,
  title = "Confirm",
  icon,
  description = "Are you sure you want to receive a load of money?",
  actionLabel = "Receive",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "mint",
  engine = "view-transition",
  inline = false,
  triggerClassName,
  triggerLabel,
}: FamilyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  useScrollLock(isOpen && !inline);

  const [isSuccess, setIsSuccess] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayTriggerLabel = triggerLabel || actionLabel;
  const currentVariant = VARIANT_STYLES[variant];

  // View transition helper with fallback
  const setOpenWithTransition = (nextOpen: boolean) => {
    if (engine === "view-transition" && typeof document !== "undefined" && "startViewTransition" in document) {
      if (!nextOpen) {
        document.documentElement.classList.add("family-closing");
      }

      const transition = (document as unknown as {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      }).startViewTransition(() => {
        flushSync(() => {
          if (controlledOpen === undefined) {
            setInternalOpen(nextOpen);
          }
          onOpenChange?.(nextOpen);
        });
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove("family-closing");
      });
    } else {
      if (controlledOpen === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    }
  };

  // Sync native <dialog> state when using view-transition mode
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || engine !== "view-transition") return;

    if (isOpen && !dialog.open) {
      if (inline) {
        dialog.setAttribute("open", "");
      } else {
        dialog.showModal();
      }
    } else if (!isOpen && dialog.open) {
      if (inline) {
        dialog.removeAttribute("open");
      } else {
        dialog.close();
      }
    }
  }, [isOpen, engine, inline]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    onCancel?.();
    setOpenWithTransition(false);
  };

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm?.();
      setOpenWithTransition(false);
      setIsSuccess(false);
    }, 600);
  };

  // ==========================================================================
  // RENDER: VIEW TRANSITION API STRATEGY
  // ==========================================================================
  if (engine === "view-transition") {
    return (
      <div
        ref={containerRef}
        className={cn(
          "w-full flex flex-col items-center justify-center",
          inline ? "relative min-h-[380px]" : ""
        )}
      >
        {/* Trigger Button (Visible when dialog is closed) */}
        {!isOpen && (
          <div className="w-full flex items-center justify-center py-6">
            <button
              type="button"
              onClick={() => setOpenWithTransition(true)}
              style={{ viewTransitionName: "family-button" } as React.CSSProperties}
              className={cn(
                "group relative inline-flex h-12 w-64 sm:w-80 items-center justify-center rounded-full px-8 text-sm font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
                currentVariant.buttonBg,
                triggerClassName
              )}
            >
              <span
                style={{ viewTransitionName: "family-label" } as React.CSSProperties}
                className="inline-block tracking-tight font-semibold"
              >
                {displayTriggerLabel}
              </span>
            </button>
          </div>
        )}

        {/* Dialog / Modal (Visible when open) */}
        {isOpen && (
          <div
            className={cn(
              "flex items-center justify-center z-50",
              inline
                ? "absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs p-4"
                : "fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4"
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <div
              style={{ viewTransitionName: "family-modal" } as React.CSSProperties}
              className={cn(
                "w-full max-w-[380px] rounded-3xl border bg-white dark:bg-zinc-900 p-6 text-zinc-900 dark:text-white shadow-2xl transition-all",
                currentVariant.modalBorder
              )}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      currentVariant.iconBg,
                      currentVariant.iconColor
                    )}
                  >
                    {icon || <HelpCircle size={18} />}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Description Body */}
              <div className="mt-3.5">
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {description}
                </div>
              </div>

              {/* Controls Footer */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-11 sm:h-12 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-xs sm:text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                >
                  {cancelLabel}
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSuccess}
                  style={{ viewTransitionName: "family-button" } as React.CSSProperties}
                  className={cn(
                    "flex-1 h-11 sm:h-12 rounded-full px-4 text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2",
                    currentVariant.buttonBg
                  )}
                >
                  {isSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Done</span>
                    </>
                  ) : (
                    <span
                      style={{ viewTransitionName: "family-label" } as React.CSSProperties}
                      className="inline-block tracking-tight font-semibold"
                    >
                      {actionLabel}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER: MOTION SPRING STRATEGY (Euler-Newton Layout Projection)
  // ==========================================================================
  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full flex flex-col items-center justify-center",
        inline ? "relative min-h-[380px]" : ""
      )}
    >
      {/* Trigger Button */}
      {!isOpen && (
        <div className="w-full flex items-center justify-center py-6">
          <motion.button
            layoutId="family-spring-button"
            type="button"
            onClick={() => setOpenWithTransition(true)}
            transition={{
              type: "spring",
              stiffness: SWAY_SPRINGS.modal.stiffness,
              damping: SWAY_SPRINGS.modal.damping,
              mass: SWAY_SPRINGS.modal.mass,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative inline-flex h-12 w-64 sm:w-80 items-center justify-center rounded-full px-8 text-sm font-semibold shadow-md cursor-pointer",
              currentVariant.buttonBg,
              triggerClassName
            )}
          >
            <motion.span
              layoutId="family-spring-label"
              transition={{
                type: "spring",
                stiffness: SWAY_SPRINGS.modal.stiffness,
                damping: SWAY_SPRINGS.modal.damping,
                mass: SWAY_SPRINGS.modal.mass,
              }}
              className="inline-block tracking-tight font-semibold"
            >
              {displayTriggerLabel}
            </motion.span>
          </motion.button>
        </div>
      )}

      {/* Modal Dialog with Spring Morph */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-center justify-center z-50",
              inline
                ? "absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-xs p-4"
                : "fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4"
            )}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: SWAY_SPRINGS.modal.stiffness,
                damping: SWAY_SPRINGS.modal.damping,
                mass: SWAY_SPRINGS.modal.mass,
              }}
              className={cn(
                "w-full max-w-[380px] rounded-3xl border bg-white dark:bg-zinc-900 p-6 text-zinc-900 dark:text-white shadow-2xl",
                currentVariant.modalBorder
              )}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      currentVariant.iconBg,
                      currentVariant.iconColor
                    )}
                  >
                    {icon || <HelpCircle size={18} />}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Description Body */}
              <div className="mt-3.5">
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {description}
                </div>
              </div>

              {/* Controls Footer */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-11 sm:h-12 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-xs sm:text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                >
                  {cancelLabel}
                </button>

                <motion.button
                  layoutId="family-spring-button"
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSuccess}
                  transition={{
                    type: "spring",
                    stiffness: SWAY_SPRINGS.modal.stiffness,
                    damping: SWAY_SPRINGS.modal.damping,
                    mass: SWAY_SPRINGS.modal.mass,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex-1 h-11 sm:h-12 rounded-full px-4 text-xs sm:text-sm font-semibold shadow-sm cursor-pointer inline-flex items-center justify-center gap-2",
                    currentVariant.buttonBg
                  )}
                >
                  {isSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Done</span>
                    </>
                  ) : (
                    <motion.span
                      layoutId="family-spring-label"
                      transition={{
                        type: "spring",
                        stiffness: SWAY_SPRINGS.modal.stiffness,
                        damping: SWAY_SPRINGS.modal.damping,
                        mass: SWAY_SPRINGS.modal.mass,
                      }}
                      className="inline-block tracking-tight font-semibold"
                    >
                      {actionLabel}
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
