import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { cn } from "../utils/cn";
import { SWAY_SPRINGS, SWAY_RADIUS } from "../utils/animationTokens";

export interface SwayCardProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  image?: ReactNode;
  summary?: ReactNode;
  children?: ReactNode;
  className?: string;
  expandedClassName?: string;
}

export function SwayCard({
  id,
  isOpen,
  onClose,
  onOpen,
  title,
  subtitle,
  badge,
  image,
  summary,
  children,
  className,
  expandedClassName,
}: SwayCardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cardLayoutId = `sway-card-container-${id}`;
  const imageLayoutId = `sway-card-image-${id}`;
  const titleLayoutId = `sway-card-title-${id}`;

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Collapsed Card */}
      <motion.div
        layoutId={cardLayoutId}
        onClick={onOpen}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        style={{ borderRadius: SWAY_RADIUS.card }}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer",
          className
        )}
      >
        {image && (
          <motion.div
            layoutId={imageLayoutId}
            className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl"
          >
            {image}
          </motion.div>
        )}

        <div className="flex flex-1 flex-col justify-between">
          <div>
            {badge && (
              <motion.span
                layout="position"
                className="mb-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {badge}
              </motion.span>
            )}

            <motion.h3
              layoutId={titleLayoutId}
              className="text-base font-bold text-zinc-900 dark:text-white"
            >
              {title}
            </motion.h3>

            {subtitle && (
              <motion.p
                layout="position"
                className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
              >
                {subtitle}
              </motion.p>
            )}

            {summary && (
              <motion.div
                layout="position"
                className="mt-3 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2"
              >
                {summary}
              </motion.div>
            )}
          </div>

          <motion.div
            layout="position"
            className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs font-semibold text-zinc-900 dark:border-zinc-800 dark:text-white"
          >
            <span>Read Details</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-transform group-hover:translate-x-1 dark:bg-zinc-800 dark:text-zinc-200">
              <ArrowRight size={14} />
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded Modal Overlay */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-md dark:bg-black/70"
              />

              {/* Expanded Card Container */}
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                layoutId={cardLayoutId}
                tabIndex={-1}
                transition={SWAY_SPRINGS.modal}
                style={{ borderRadius: SWAY_RADIUS.modal }}
                className={cn(
                  "relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900",
                  expandedClassName
                )}
              >
                {/* Close Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-20 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/60 cursor-pointer"
                >
                  <X size={16} />
                </motion.button>

                {image && (
                  <motion.div
                    layoutId={imageLayoutId}
                    className="relative h-64 w-full shrink-0 overflow-hidden"
                  >
                    {image}
                  </motion.div>
                )}

                <div className="flex-1 overflow-y-auto p-6 sm:p-8 [scrollbar-color:rgba(150,150,150,0.25)_transparent] [scrollbar-width:thin]">
                  {badge && (
                    <motion.span
                      layout="position"
                      className="mb-2 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {badge}
                    </motion.span>
                  )}

                  <motion.h2
                    layoutId={titleLayoutId}
                    className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white"
                  >
                    {title}
                  </motion.h2>

                  {subtitle && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {subtitle}
                    </p>
                  )}

                  <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-4">
                    {children || summary}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// Backwards compatibility alias
export const GonzaCard = SwayCard;
export type GonzaCardProps = SwayCardProps;
