import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { SWAY_SPRINGS, SWAY_RADIUS } from "../utils/animationTokens";

export interface SwayModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  layoutId?: string;
  maxWidth?: string;
  disableEscape?: boolean;
  closeVariant?: "spring" | "davo";
  inline?: boolean;
  className?: string;
}

export function SwayModal({
  open,
  onClose,
  title,
  children,
  footer,
  layoutId,
  maxWidth = "max-w-xl",
  disableEscape = false,
  closeVariant = "spring",
  inline = false,
  className,
}: SwayModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const node = panelRef.current;
    node?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (!disableEscape) onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !node) return;
      const focusables = node.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    let previousOverflow = "";
    if (!inline) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (!inline) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [open, disableEscape, inline]);

  const content = (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            inline
              ? "absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
              : "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          )}
        >
          <motion.div
            className={cn(
              "absolute inset-0",
              inline
                ? "bg-black/15 backdrop-blur-[2px] dark:bg-black/40"
                : "bg-black/40 backdrop-blur-md dark:bg-black/70"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: closeVariant === "davo" ? 0.45 : 0.25,
              ease: [0.56, 0.27, 0, 1],
            }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            layoutId={layoutId}
            layout
            transition={SWAY_SPRINGS.modal}
            initial={
              layoutId
                ? undefined
                : { opacity: 0, scale: 0.92, y: 16, filter: "blur(8px)" }
            }
            animate={
              layoutId
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              layoutId
                ? closeVariant === "davo"
                  ? {
                      opacity: 0,
                      filter: "blur(32px)",
                      borderRadius: 400,
                      transition: { duration: 0.45, ease: [0.56, 0.27, 0, 1] },
                    }
                  : {
                      opacity: 0,
                      filter: "blur(6px)",
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
                : { opacity: 0, scale: 0.92, y: 12, filter: "blur(12px)" }
            }
            style={{ borderRadius: SWAY_RADIUS.modal }}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-[32px] border border-zinc-200/80 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)] outline-none [isolation:isolate] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_30px_90px_rgba(0,0,0,0.9)] max-h-[90vh]",
              maxWidth,
              className
            )}
          >
            {title && (
              <motion.div
                layout="position"
                className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-100 px-6 pb-4 pt-6 dark:border-white/[0.06]"
              >
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                  {title}
                </h2>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
                >
                  <X size={18} aria-hidden />
                </motion.button>
              </motion.div>
            )}

            <motion.div
              layout
              className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-4 [scrollbar-color:rgba(150,150,150,0.25)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
            >
              <motion.div layout className="w-full">
                {children}
              </motion.div>
            </motion.div>

            {footer && (
              <motion.div
                layout="position"
                className="shrink-0 rounded-b-[32px] border-t border-zinc-100 bg-white px-6 py-4 dark:border-white/[0.08] dark:bg-zinc-900"
              >
                {footer}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return inline ? content : createPortal(content, document.body);
}

export interface SwayModalTriggerProps {
  layoutId?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

export function SwayModalTrigger({
  layoutId,
  onClick,
  children,
  className,
  disabled = false,
  type = "button",
  title,
}: SwayModalTriggerProps) {
  return (
    <motion.button
      type={type}
      layout
      layoutId={layoutId}
      whileHover={disabled ? undefined : { scale: 1.025 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={SWAY_SPRINGS.modal}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ borderRadius: SWAY_RADIUS.trigger }}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <motion.span layout="position" className="inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
}

SwayModal.Trigger = SwayModalTrigger;

// Backwards compatibility aliases
export const GonzaModal = SwayModal;
export const GonzaModalTrigger = SwayModalTrigger;
export type GonzaModalProps = SwayModalProps;
export type GonzaModalTriggerProps = SwayModalTriggerProps;
