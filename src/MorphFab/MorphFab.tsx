import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { cn } from "../utils/cn";
import { PRETTY_EASE } from "../DavoModal/pretty-modal";
import "../DavoModal/davo-modal.css";

gsap.registerPlugin(Flip, CustomEase);

export interface FabAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  badge?: string;
}

export interface MorphFabProps {
  actions: FabAction[];
  title?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  icon?: ReactNode;
  engine?: "sway" | "davo" | "gonza";
  className?: string;
}

export function MorphFab({
  actions,
  title = "Quick Actions",
  position = "bottom-right",
  icon = <Plus size={20} />,
  engine = "sway",
  className,
}: MorphFabProps) {
  const [open, setOpen] = useState(false);

  // Davo GSAP Flip refs
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "bottom-6 right-6";
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      default:
        return "bottom-6 right-6";
    }
  };

  const getMenuAlignmentClass = () => {
    switch (position) {
      case "bottom-right":
        return "bottom-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      case "top-right":
        return "top-0 right-0";
      case "top-left":
        return "top-0 left-0";
      default:
        return "bottom-0 right-0";
    }
  };

  const handleDavoOpen = () => {
    if (isAnimatingRef.current || open || !triggerRef.current) return;
    isAnimatingRef.current = true;
    setOpen(true);
  };

  const handleDavoClose = () => {
    if (isAnimatingRef.current || !open || !menuRef.current || !triggerRef.current) return;
    isAnimatingRef.current = true;

    // 1. Immediately fade out inner content in 90ms (zero squished text)
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.09,
        ease: "power2.in",
      });
    }

    // 2. Fade out backdrop
    if (backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      });
    }

    const isDark = document.documentElement.classList.contains("dark");
    const buttonBg = isDark ? "#ffffff" : "#09090b";

    // 3. Freeze current height and morph width/height down into the 56x56 circular FAB
    const currentHeight = menuRef.current.offsetHeight;
    gsap.set(menuRef.current, { height: currentHeight, overflow: "hidden" });

    gsap.to(menuRef.current, {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: buttonBg,
      borderColor: buttonBg,
      duration: 0.38,
      ease: CustomEase.create("custom", PRETTY_EASE),
      onComplete: () => {
        // Clear all inline styles from trigger button cleanly so it's fresh, clickable, and without jump
        gsap.set(triggerRef.current, { clearProps: "all" });
        setOpen(false);
        isAnimatingRef.current = false;
      },
    });
  };

  useLayoutEffect(() => {
    if (engine !== "davo" || !open || !menuRef.current || !triggerRef.current) return;

    if (backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }

    // Hide trigger button cleanly
    gsap.set(triggerRef.current, { opacity: 0 });

    // Coordinated content emergence: fades in and glides up from inside the shell as it expands
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          delay: 0.08,
          ease: "power2.out",
        }
      );
    }

    const isDark = document.documentElement.classList.contains("dark");
    const buttonBg = isDark ? "#ffffff" : "#09090b";
    const menuBg = isDark ? "#18181b" : "#ffffff";
    const menuBorder = isDark ? "#27272a" : "#e4e4e7";

    // Measure exact target natural dimensions including borders and padding
    const targetHeight = menuRef.current.offsetHeight;
    const targetWidth = menuRef.current.offsetWidth || 288;

    // Set initial bubble state: 56x56 perfect circle with button background
    gsap.set(menuRef.current, {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: buttonBg,
      borderColor: buttonBg,
      overflow: "hidden",
    });

    // Animate smoothly to exact expanded menu dimensions with Davo's signature cubic bezier
    // Locks seamlessly into final dimensions with ZERO snap, jitter, or layout adjustment
    gsap.to(menuRef.current, {
      width: targetWidth,
      height: targetHeight,
      borderRadius: 28,
      backgroundColor: menuBg,
      borderColor: menuBorder,
      duration: 0.42,
      ease: CustomEase.create("custom", PRETTY_EASE),
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [open, engine]);

  const handleClose = () => {
    if (engine === "davo") {
      handleDavoClose();
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, engine]);

  const menuContent = (
    <div
      ref={engine === "davo" ? contentRef : undefined}
      className="w-full p-4"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
            {title}
          </span>
          <span className="ml-2 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {engine === "gonza" ? "Motion" : "GSAP Flip"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 dark:text-zinc-400">{action.icon}</span>
              <span>{action.label}</span>
            </div>
            {action.badge && (
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {action.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  /* Engine 1: Sway (Motion Spring with layoutId) */
  if (engine === "sway" || engine === "gonza") {
    return createPortal(
      <div className={cn("fixed z-50", getPositionClasses(), className)}>
        {/* Backdrop when opened */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] dark:bg-black/60 cursor-pointer"
            />
          )}
        </AnimatePresence>

        <div className="relative z-50 h-14 w-14">
          <AnimatePresence>
            {!open ? (
              <motion.button
                key="fab-button"
                layoutId="morph-fab-motion-shell"
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 30,
                  mass: 0.8,
                }}
                style={{ borderRadius: 28 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-xl hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer"
                aria-label={title}
              >
                <motion.span
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.12 }}
                >
                  {icon}
                </motion.span>
              </motion.button>
            ) : (
              <motion.div
                key="fab-menu"
                layoutId="morph-fab-motion-shell"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                  mass: 0.8,
                }}
                style={{ borderRadius: 28 }}
                className={cn(
                  "absolute overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 w-72",
                  getMenuAlignmentClass()
                )}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.26, delay: 0.05 }}
                >
                  {menuContent}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>,
      document.body
    );
  }

  /* Engine 2: Davo (GSAP Flip morphing on pure FAB elements, NO <dialog>) */
  return createPortal(
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      {/* Backdrop when opened */}
      {open && (
        <div
          ref={backdropRef}
          onClick={handleDavoClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] dark:bg-black/60 cursor-pointer"
        />
      )}

      <div className="relative z-50 h-14 w-14">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleDavoOpen}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-xl hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer transition-transform hover:scale-105 active:scale-95",
            open ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          aria-label={title}
        >
          {icon}
        </button>

        {open && (
          <div
            ref={menuRef}
            className={cn(
              "absolute overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 z-10 w-72",
              getMenuAlignmentClass()
            )}
            style={{ borderRadius: 28 }}
          >
            {menuContent}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
