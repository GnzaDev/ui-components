import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../utils/cn";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export type ToastPosition =
  | "top-center"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: () => void;
  shortcut?: string;
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
  timestamp?: string;
}

export interface FlipToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  variant?: "capsule" | "stack";
  position?: ToastPosition;
}

// ============================================================================
// HELPER: POSITION UTILITIES
// ============================================================================
function getPositionStyles(pos: ToastPosition) {
  const isTop = pos.startsWith("top");
  const isBottom = pos.startsWith("bottom");
  const isCenter = pos.includes("center");
  const isLeft = pos.includes("left");
  const isRight = pos.includes("right");

  let containerClass = "fixed z-50 pointer-events-none ";

  if (isTop) containerClass += "top-5 ";
  if (isBottom) containerClass += "bottom-5 ";

  if (isCenter) {
    containerClass += "left-1/2 -translate-x-1/2 items-center ";
  } else if (isLeft) {
    containerClass += "left-5 items-start ";
  } else if (isRight) {
    containerClass += "right-5 items-end ";
  }

  return {
    containerClass,
    isTop,
    isBottom,
    isCenter,
    isLeft,
    isRight,
  };
}

// ============================================================================
// CONCEPT 1: COMPACT DYNAMIC CAPSULE (Click-to-Expand HUD Island)
// ============================================================================
export function DynamicCapsuleToast({
  toasts,
  onDismiss,
  position = "top-center",
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: ToastPosition;
}) {
  const activeToast = toasts[toasts.length - 1];
  const queueCount = Math.max(0, toasts.length - 1);
  const posConfig = getPositionStyles(position);
  const [expandedToastId, setExpandedToastId] = useState<string | null>(null);

  const isExpanded = activeToast ? expandedToastId === activeToast.id : false;

  const getDotColor = (type?: ToastType) => {
    switch (type) {
      case "loading":
        return "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]";
      case "success":
        return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]";
      case "error":
        return "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.7)]";
      case "warning":
        return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <div className={cn("flex flex-col", posConfig.containerClass)}>
      <AnimatePresence mode="wait">
        {activeToast && (
          <motion.div
            key={activeToast.id}
            layout
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.y) > 25 || Math.abs(info.velocity.y) > 150) {
                onDismiss(activeToast.id);
              }
            }}
            onClick={() => {
              setExpandedToastId(isExpanded ? null : activeToast.id);
            }}
            initial={{
              opacity: 0,
              y: posConfig.isTop ? -16 : 16,
              scale: 0.94,
              filter: "blur(4px)",
            }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: posConfig.isTop ? -12 : 12,
              scale: 0.94,
              filter: "blur(4px)",
            }}
            transition={{
              layout: { duration: 0.22, ease: "easeOut" },
              type: "spring",
              stiffness: 420,
              damping: 30,
              mass: 0.8,
            }}
            className={cn(
              "pointer-events-auto relative overflow-hidden shadow-2xl backdrop-blur-xl select-none",
              "bg-zinc-950/92 text-zinc-100 border border-white/15",
              "shadow-[0_14px_35px_rgba(0,0,0,0.55)] transition-shadow",
              isExpanded
                ? "w-[360px] rounded-2xl p-3.5 cursor-default"
                : "flex items-center gap-2.5 rounded-full py-1.5 px-3.5 cursor-pointer max-w-[320px]"
            )}
          >
            {!isExpanded ? (
              /* COMPACT PILL MODE */
              <div className="flex items-center gap-2 w-full">
                {/* Semantic Micro-Dot */}
                <div className="flex items-center justify-center shrink-0">
                  <span className={cn("h-2 w-2 rounded-full", getDotColor(activeToast.type))} />
                </div>

                {/* Title */}
                <span className="text-[12px] font-medium tracking-tight text-white truncate flex-1">
                  {activeToast.title}
                </span>

                {/* Live Progress Mini-Bar */}
                {activeToast.progress !== undefined && (
                  <div className="flex items-center gap-1.5 shrink-0 pl-0.5">
                    <div className="h-1 w-7 overflow-hidden rounded-full bg-zinc-800">
                      <motion.div
                        className="h-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeToast.progress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                      {activeToast.progress}%
                    </span>
                  </div>
                )}

                {/* Compact Action Button */}
                {activeToast.action && (
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      activeToast.action?.onClick();
                      onDismiss(activeToast.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 px-2 py-0.5 text-[10px] font-medium text-white transition-all cursor-pointer border border-white/10 shrink-0"
                  >
                    <span>{activeToast.action.label}</span>
                    {activeToast.action.shortcut && (
                      <kbd className="font-mono text-[8px] bg-black/40 px-1 rounded text-zinc-300">
                        {activeToast.action.shortcut}
                      </kbd>
                    )}
                  </button>
                )}

                {/* Expand Hint Icon */}
                {(activeToast.message || activeToast.action) && (
                  <div className="text-zinc-400 hover:text-white transition-colors shrink-0">
                    <ChevronDown size={12} />
                  </div>
                )}

                {/* Multi-queue Counter */}
                {queueCount > 0 && (
                  <span className="font-mono text-[9px] font-medium text-zinc-400 bg-zinc-800/90 px-1.5 py-0.5 rounded-full border border-white/5 shrink-0">
                    +{queueCount}
                  </span>
                )}

                {/* Dismiss Cross */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(activeToast.id);
                  }}
                  className="rounded-full p-0.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-0.5"
                  aria-label="Dismiss"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              /* EXPANDED ISLAND HUD MODE */
              <div className="flex flex-col gap-2.5 w-full">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", getDotColor(activeToast.type))} />
                  <h4 className="text-xs font-semibold text-white tracking-tight flex-1 truncate">
                    {activeToast.title}
                  </h4>

                  {/* Collapse Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedToastId(null);
                    }}
                    className="rounded-full p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Collapse"
                  >
                    <ChevronUp size={13} />
                  </button>

                  {/* Dismiss Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(activeToast.id);
                    }}
                    className="rounded-full p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* Message Body */}
                {activeToast.message && (
                  <p className="text-xs text-zinc-300 leading-relaxed pl-4">
                    {activeToast.message}
                  </p>
                )}

                {/* Detailed Progress Bar */}
                {activeToast.progress !== undefined && (
                  <div className="space-y-1.5 pt-1 pl-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Status: Processing</span>
                      <span className="text-emerald-400 font-semibold">{activeToast.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <motion.div
                        className="h-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeToast.progress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer: Time + Action */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1 pl-4">
                  <div className="flex items-center gap-2">
                    {activeToast.timestamp && (
                      <span className="font-mono text-[10px] text-zinc-500">
                        {activeToast.timestamp}
                      </span>
                    )}
                    {queueCount > 0 && (
                      <span className="font-mono text-[10px] text-zinc-400">
                        +{queueCount} in queue
                      </span>
                    )}
                  </div>

                  {activeToast.action && (
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        activeToast.action?.onClick();
                        onDismiss(activeToast.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 py-1 text-xs font-semibold text-white transition-all cursor-pointer border border-white/10"
                    >
                      <RotateCcw size={11} />
                      <span>{activeToast.action.label}</span>
                      {activeToast.action.shortcut && (
                        <kbd className="font-mono text-[8px] bg-black/40 px-1 py-0.5 rounded text-zinc-300 ml-0.5">
                          {activeToast.action.shortcut}
                        </kbd>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// CONCEPT 2: MINIMALIST CARD STACK (Clean Swiss Precision Deck)
// ============================================================================
function MinimalCard({
  toast,
  index,
  total,
  isHovered,
  position,
  onDismiss,
}: {
  toast: ToastItem;
  index: number;
  total: number;
  isHovered: boolean;
  position: ToastPosition;
  onDismiss: (id: string) => void;
}) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-120, 0, 120], [0.2, 1, 0.2]);

  const reverseIndex = total - 1 - index;
  const isTop = reverseIndex === 0;
  const posConfig = getPositionStyles(position);

  // Vertical stack offset depending on top or bottom orientation
  const directionMultiplier = posConfig.isTop ? 1 : -1;
  const offset = isHovered
    ? reverseIndex * (directionMultiplier * 78)
    : reverseIndex * (directionMultiplier * 10);

  const scale = isHovered ? 1 : 1 - reverseIndex * 0.05;
  const zIndex = 30 - reverseIndex;
  const cardOpacity = isHovered ? 1 : Math.max(0.4, 1 - reverseIndex * 0.3);

  const getDotColor = (type?: ToastType) => {
    switch (type) {
      case "success":
        return "bg-emerald-400";
      case "error":
        return "bg-rose-400";
      case "warning":
        return "bg-amber-400";
      case "loading":
        return "bg-indigo-400 animate-pulse";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <motion.div
      layout
      style={{
        x,
        opacity: isTop || isHovered ? opacity : cardOpacity,
        zIndex,
      }}
      drag={isTop || isHovered ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 35 || Math.abs(info.velocity.x) > 120) {
          onDismiss(toast.id);
        }
      }}
      initial={{
        opacity: 0,
        y: posConfig.isTop ? -20 : 20,
        scale: 0.94,
      }}
      animate={{
        y: offset,
        scale,
        opacity: cardOpacity,
      }}
      exit={{
        opacity: 0,
        x: x.get() >= 0 ? 180 : -180,
        scale: 0.9,
        transition: { duration: 0.16 },
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 32,
        mass: 0.8,
      }}
      className={cn(
        "pointer-events-auto absolute w-80 rounded-xl border border-zinc-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100 select-none transition-shadow",
        isTop || isHovered
          ? "cursor-grab active:cursor-grabbing shadow-[0_16px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          : "pointer-events-none",
        posConfig.isBottom ? "bottom-0" : "top-0",
        posConfig.isLeft ? "left-0" : posConfig.isRight ? "right-0" : "left-1/2 -translate-x-1/2"
      )}
    >
      {/* Header: Semantic Dot + Title + Time + Close */}
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full shrink-0", getDotColor(toast.type))} />
        <h5 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate flex-1">
          {toast.title}
        </h5>
        {toast.timestamp && (
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal shrink-0">
            {toast.timestamp}
          </span>
        )}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(toast.id);
          }}
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer p-1 -mr-1"
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
      </div>

      {/* Body Message */}
      {toast.message && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 pl-4">
          {toast.message}
        </p>
      )}

      {/* Progress Track */}
      {toast.progress !== undefined && (
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${toast.progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
      )}

      {/* Minimal Action */}
      {toast.action && (
        <div className="mt-2.5 flex items-center justify-end">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-2.5 py-1 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>{toast.action.label}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function MinimalStackToast({
  toasts,
  onDismiss,
  position = "bottom-right",
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: ToastPosition;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const visibleToasts = toasts.slice(-3);
  const posConfig = getPositionStyles(position);

  return (
    <div className={cn("flex flex-col", posConfig.containerClass)}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative h-36 w-80"
      >
        <AnimatePresence mode="popLayout">
          {visibleToasts.map((toast, idx) => (
            <MinimalCard
              key={toast.id}
              toast={toast}
              index={idx}
              total={visibleToasts.length}
              isHovered={isHovered}
              position={position}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Alias for backward compatibility
export const PhysicalStackToast = MinimalStackToast;

// ============================================================================
// MAIN WRAPPER
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
        position={position}
      />
    );
  }

  return (
    <MinimalStackToast
      toasts={toasts}
      onDismiss={onDismiss}
      position={position}
    />
  );
}
