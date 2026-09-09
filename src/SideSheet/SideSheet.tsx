import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

export interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  disableEscape?: boolean;
  maxWidth?: string;
  className?: string;
  overlay?: ReactNode;
}

export function SideSheet({
  open,
  onClose,
  title,
  children,
  disableEscape = false,
  maxWidth = "max-w-2xl",
  className,
  overlay,
}: SideSheetProps) {
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, disableEscape]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/15 backdrop-blur-[2px] dark:bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={cn(
              "fixed right-3 top-3 bottom-3 flex w-full flex-col overflow-hidden rounded-[2.5rem] border border-zinc-200/80 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.14)] outline-none dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_25px_80px_rgba(0,0,0,0.85)]",
              maxWidth,
              className
            )}
            initial={{ x: "100%", opacity: 0, filter: "blur(8px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: "100%", opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 32, mass: 0.8 }}
          >
            {title && (
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-100 px-6 pb-4 pt-6 dark:border-white/[0.06]">
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
                  className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <X size={18} aria-hidden />
                </motion.button>
              </div>
            )}
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-7 [scrollbar-color:rgba(150,150,150,0.25)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
              {children}
            </div>
            {overlay}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
