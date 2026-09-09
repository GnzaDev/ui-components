import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import {
  Check,
  AlertTriangle,
  Info,
  XCircle,
  X,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { cn } from "../utils/cn";
import { SWAY_SPRINGS } from "../utils/animationTokens";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  progress?: number;
  action?: ToastAction;
}

export interface FlipToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  variant?: "capsule" | "stack";
  position?: "top-center" | "bottom-center" | "bottom-right" | "top-right";
}

// ============================================================================
// CONCEPT 1: DYNAMIC CAPSULE TOAST (Sway Motion - Island Pill Morphing)
// ============================================================================
export function DynamicCapsuleToast({
  toasts,
  onDismiss,
  position = "top-center",
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: "top-center" | "bottom-center";
}) {
  const activeToast = toasts[toasts.length - 1];
  const queueCount = Math.max(0, toasts.length - 1);

  const getStatusIcon = (type?: ToastType) => {
    switch (type) {
      case "loading":
        return <Loader2 size={14} className="animate-spin text-zinc-900 dark:text-white" />;
      case "success":
        return (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={11} strokeWidth={3} />
          </div>
        );
      case "error":
        return (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white">
            <X size={11} strokeWidth={3} />
          </div>
        );
      case "warning":
        return <AlertTriangle size={14} className="text-amber-500" />;
      case "info":
      default:
        return <Info size={14} className="text-blue-500" />;
    }
  };

  const isBottom = position === "bottom-center";

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center",
        isBottom ? "bottom-6" : "top-6"
      )}
    >
      <AnimatePresence mode="wait">
        {activeToast && (
          <motion.div
            key={activeToast.id}
            layout
            drag="y"
            dragConstraints={{ top: isBottom ? 0 : -80, bottom: isBottom ? 80 : 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (isBottom ? info.offset.y > 40 : info.offset.y < -40) {
                onDismiss(activeToast.id);
              }
            }}
            initial={{ opacity: 0, y: isBottom ? 24 : -24, scale: 0.85, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: isBottom ? 16 : -16, scale: 0.9, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: SWAY_SPRINGS.modal.stiffness,
              damping: SWAY_SPRINGS.modal.damping,
              mass: SWAY_SPRINGS.modal.mass,
            }}
            className="pointer-events-auto group relative flex items-center gap-3 rounded-full border border-zinc-200/90 bg-white/95 px-4 py-2 text-xs text-zinc-900 shadow-2xl backdrop-blur-xl dark:border-zinc-800/90 dark:bg-zinc-950/95 dark:text-zinc-100 dark:shadow-[0_16px_40px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing select-none"
          >
            {/* Live Progress Ring / Indicator */}
            <div className="flex items-center gap-2">
              {getStatusIcon(activeToast.type)}
              <span className="font-semibold tracking-tight">{activeToast.title}</span>
            </div>

            {/* Optional message or progress number */}
            {activeToast.progress !== undefined ? (
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <motion.div
                    className="h-full bg-zinc-900 dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeToast.progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
                <span>{activeToast.progress}%</span>
              </div>
            ) : activeToast.message ? (
              <span className="hidden sm:inline-block max-w-[200px] truncate text-zinc-500 dark:text-zinc-400">
                {activeToast.message}
              </span>
            ) : null}

            {/* Interactive Action Button (e.g. Undo, Retry) */}
            {activeToast.action && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  activeToast.action?.onClick();
                  onDismiss(activeToast.id);
                }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                  activeToast.action.primary
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                <RotateCcw size={10} />
                <span>{activeToast.action.label}</span>
              </button>
            )}

            {/* Queue Counter Badge if multiple toasts exist */}
            {queueCount > 0 && (
              <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                +{queueCount}
              </span>
            )}

            {/* Quick Dismiss Cross */}
            <button
              type="button"
              onClick={() => onDismiss(activeToast.id)}
              className="rounded-full p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// CONCEPT 2: PHYSICAL GESTURE STACK TOAST (3D Perspective, Tilt & Swipe Ejection)
// ============================================================================
function PhysicalToastCard({
  toast,
  index,
  total,
  isHovered,
  onDismiss,
}: {
  toast: ToastItem;
  index: number;
  total: number;
  isHovered: boolean;
  onDismiss: (id: string) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14]);
  const opacity = useTransform(x, [-160, 0, 160], [0.2, 1, 0.2]);

  // Stack calculation
  const reverseIndex = total - 1 - index;
  const isTop = reverseIndex === 0;

  // Visual stacking parameters
  const offset = isHovered ? reverseIndex * -68 : reverseIndex * -10;
  const scale = isHovered ? 1 : 1 - reverseIndex * 0.05;
  const zIndex = 30 - reverseIndex;
  const cardOpacity = isHovered ? 1 : Math.max(0.4, 1 - reverseIndex * 0.2);

  const getStatusIcon = (type?: ToastType) => {
    switch (type) {
      case "success":
        return <Check size={14} className="text-emerald-500" />;
      case "error":
        return <XCircle size={14} className="text-rose-500" />;
      case "warning":
        return <AlertTriangle size={14} className="text-amber-500" />;
      case "info":
      default:
        return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <motion.div
      layout
      style={{
        x,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : cardOpacity,
        zIndex,
        perspective: 1000,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 350) {
          onDismiss(toast.id);
        }
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{
        y: offset,
        scale,
        opacity: cardOpacity,
      }}
      exit={{
        opacity: 0,
        x: x.get() >= 0 ? 200 : -200,
        scale: 0.85,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
        mass: 0.8,
      }}
      className={cn(
        "absolute bottom-0 right-0 w-80 rounded-2xl border p-4 shadow-xl select-none transition-shadow",
        isTop ? "cursor-grab active:cursor-grabbing shadow-2xl" : "pointer-events-none",
        "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        "dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{getStatusIcon(toast.type)}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
              {toast.title}
            </h5>
            {isTop && (
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                Swipe
              </span>
            )}
          </div>
          {toast.message && (
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {toast.message}
            </p>
          )}

          {toast.action && (
            <div className="mt-2.5 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 cursor-pointer transition-colors"
              >
                <RotateCcw size={10} />
                <span>{toast.action.label}</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
}

export function PhysicalStackToast({
  toasts,
  onDismiss,
  position = "bottom-right",
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: "bottom-right" | "top-right";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const visibleToasts = toasts.slice(-3);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed z-50 h-28 w-84",
        position === "bottom-right" ? "bottom-6 right-6" : "top-6 right-6"
      )}
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast, idx) => (
          <PhysicalToastCard
            key={toast.id}
            toast={toast}
            index={idx}
            total={visibleToasts.length}
            isHovered={isHovered}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN WRAPPER (Switches seamlessly between Capsule and Physical Stack)
// ============================================================================
export function FlipToast({
  toasts,
  onDismiss,
  variant = "capsule",
  position = "top-center",
}: FlipToastProps) {
  if (toasts.length === 0) return null;

  if (variant === "capsule") {
    return (
      <DynamicCapsuleToast
        toasts={toasts}
        onDismiss={onDismiss}
        position={position === "bottom-center" ? "bottom-center" : "top-center"}
      />
    );
  }

  return (
    <PhysicalStackToast
      toasts={toasts}
      onDismiss={onDismiss}
      position={position === "top-right" ? "top-right" : "bottom-right"}
    />
  );
}
