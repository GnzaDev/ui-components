import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../utils/cn";
import { prettyModalService } from "../DavoModal/pretty-modal";
import "../DavoModal/davo-modal.css";
import { SWAY_SPRINGS } from "../utils/animationTokens";

export type PopoverPlacement =
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "top-left"
  | "top-right"
  | "top-center";

export interface SwayPopoverProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  placement?: PopoverPlacement;
  engine?: "sway" | "davo" | "gonza";
  className?: string;
  panelClassName?: string;
  disableEscape?: boolean;
}

export function SwayPopover({
  open,
  onClose,
  trigger,
  children,
  placement = "bottom-center",
  engine = "sway",
  className,
  panelClassName,
  disableEscape = false,
}: SwayPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const isClosingRef = useRef(false);

  // Click outside and Escape key listeners
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onCloseRef.current();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !disableEscape) {
        onCloseRef.current();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, disableEscape]);

  // Davo Engine: exact PrettyModalService integration adapted for Popover
  useEffect(() => {
    if (engine !== "davo") return;

    const panel = panelRef.current;
    const origin =
      (triggerRef.current?.firstElementChild as HTMLElement) ||
      triggerRef.current;

    if (!panel || !origin) return;

    if (open) {
      isClosingRef.current = false;
      panel.style.display = "block";
      prettyModalService.openElement(panel, origin);
    } else if (panel.style.display !== "none" && !isClosingRef.current) {
      isClosingRef.current = true;
      prettyModalService.closeElement(panel, origin, () => {
        panel.style.display = "none";
        isClosingRef.current = false;
      });
    }
  }, [open, engine]);

  const getPlacementStyles = (p: PopoverPlacement) => {
    switch (p) {
      case "bottom-left":
        return "top-full left-0 mt-2 origin-top-left";
      case "bottom-right":
        return "top-full right-0 mt-2 origin-top-right";
      case "bottom-center":
        return "top-full left-1/2 -translate-x-1/2 mt-2 origin-top";
      case "top-left":
        return "bottom-full left-0 mb-2 origin-bottom-left";
      case "top-right":
        return "bottom-full right-0 mb-2 origin-bottom-right";
      case "top-center":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom";
      default:
        return "top-full left-1/2 -translate-x-1/2 mt-2 origin-top";
    }
  };

  const isSway = engine === "sway" || engine === "gonza";

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Anchor Trigger wrapper */}
      <div ref={triggerRef} className="inline-block">
        {trigger}
      </div>

      {/* Engine 1: Sway (Motion Spring Physics - High-velocity elastic snap) */}
      {isSway && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.35,
                y: placement.startsWith("top") ? 16 : -16,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                y: placement.startsWith("top") ? 10 : -10,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              transition={SWAY_SPRINGS.popover}
              className={cn(
                "absolute z-50 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.15)] outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden",
                getPlacementStyles(placement),
                panelClassName
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Engine 2: Davo (Authentic PrettyModalService GSAP FLIP morphing from origin) */}
      {engine === "davo" && (
        <div
          ref={panelRef}
          style={{ display: "none" }}
          className={cn(
            "absolute z-50 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.15)] outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden",
            getPlacementStyles(placement),
            panelClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DavoPopover(props: Omit<SwayPopoverProps, "engine">) {
  return <SwayPopover {...props} engine="davo" />;
}

// Backwards compatibility aliases
export const GonzaPopover = SwayPopover;
export type GonzaPopoverProps = SwayPopoverProps;
