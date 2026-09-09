import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import {
  X,
  RotateCcw,
  GripVertical,
  Terminal,
} from "lucide-react";
import { cn } from "../utils/cn";
import { SWAY_SPRINGS } from "../utils/animationTokens";

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
  statusCode?: string;
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

  if (isTop) containerClass += "top-6 ";
  if (isBottom) containerClass += "bottom-6 ";

  if (isCenter) {
    containerClass += "left-1/2 -translate-x-1/2 items-center ";
  } else if (isLeft) {
    containerClass += "left-6 items-start ";
  } else if (isRight) {
    containerClass += "right-6 items-end ";
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
// CONCEPT 1: DYNAMIC CAPSULE HUD (Tactile Studio Island)
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

  const getStatusColor = (type?: ToastType) => {
    switch (type) {
      case "loading":
        return "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]";
      case "success":
        return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]";
      case "error":
        return "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]";
      case "warning":
        return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]";
      case "info":
      default:
        return "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]";
    }
  };

  const getStatusBadge = (toast: ToastItem) => {
    if (toast.statusCode) return toast.statusCode;
    switch (toast.type) {
      case "loading":
        return "PROCESSING";
      case "success":
        return "200 OK";
      case "error":
        return "ERR_500";
      case "warning":
        return "WARN_LIMIT";
      default:
        return "EVENT";
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
            dragConstraints={{
              top: posConfig.isTop ? -60 : 0,
              bottom: posConfig.isBottom ? 60 : 0,
            }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (posConfig.isTop ? info.offset.y < -35 : info.offset.y > 35) {
                onDismiss(activeToast.id);
              }
            }}
            initial={{
              opacity: 0,
              y: posConfig.isTop ? -20 : 20,
              scale: 0.92,
              filter: "blur(6px)",
            }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: posConfig.isTop ? -14 : 14,
              scale: 0.94,
              filter: "blur(4px)",
            }}
            transition={{
              type: "spring",
              stiffness: SWAY_SPRINGS.modal.stiffness,
              damping: SWAY_SPRINGS.modal.damping,
              mass: SWAY_SPRINGS.modal.mass,
            }}
            className={cn(
              "pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-full p-1.5 pl-3 pr-2 shadow-2xl backdrop-blur-2xl cursor-grab active:cursor-grabbing select-none",
              // Dark smoked glass with perimeter light ring
              "bg-zinc-950/95 text-zinc-100 ring-1 ring-white/15",
              "shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            )}
          >
            {/* Live Pulsing Beacon Dot */}
            <div className="relative flex h-2 w-2 shrink-0 items-center justify-center">
              <span
                className={cn(
                  "absolute h-3 w-3 rounded-full opacity-40 animate-ping",
                  getStatusColor(activeToast.type)
                )}
              />
              <span className={cn("h-1.5 w-1.5 rounded-full", getStatusColor(activeToast.type))} />
            </div>

            {/* Status Monospace Badge */}
            <span className="font-mono text-[9px] font-bold tracking-widest text-zinc-400 uppercase bg-zinc-900/90 px-1.5 py-0.5 rounded-md border border-white/10">
              {getStatusBadge(activeToast)}
            </span>

            {/* Title / Main Action */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-tight text-white">
                {activeToast.title}
              </span>
            </div>

            {/* Optional Live Progress Bar */}
            {activeToast.progress !== undefined && (
              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 pl-1">
                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    className="h-full bg-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeToast.progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
                <span className="text-emerald-400 font-bold">{activeToast.progress}%</span>
              </div>
            )}

            {/* Secondary Message preview */}
            {activeToast.message && activeToast.progress === undefined && (
              <span className="hidden md:inline-block max-w-[210px] truncate text-[11px] text-zinc-400 border-l border-zinc-800 pl-2">
                {activeToast.message}
              </span>
            )}

            {/* Interactive Tactile Action Button */}
            {activeToast.action && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  activeToast.action?.onClick();
                  onDismiss(activeToast.id);
                }}
                className="group/btn inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 px-2.5 py-1 text-[11px] font-semibold text-white transition-all cursor-pointer border border-white/10"
              >
                <RotateCcw size={10} className="text-amber-300 group-hover/btn:-rotate-45 transition-transform" />
                <span>{activeToast.action.label}</span>
                {activeToast.action.shortcut && (
                  <kbd className="font-mono text-[9px] bg-black/40 px-1 py-0.2 rounded text-zinc-300 ml-0.5 border border-white/10">
                    {activeToast.action.shortcut}
                  </kbd>
                )}
              </button>
            )}

            {/* Multi-queue Counter indicator */}
            {queueCount > 0 && (
              <span className="font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded-full border border-white/5">
                +{queueCount}
              </span>
            )}

            {/* Dismiss Cross */}
            <button
              type="button"
              onClick={() => onDismiss(activeToast.id)}
              className="rounded-full p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
// CONCEPT 2: STUDIO SLIP / ENGINEERED TICKET STACK (Tangible Hardware Deck)
// ============================================================================
function StudioSlipCard({
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
  const rotate = useTransform(x, [-180, 0, 180], [-12, 0, 12]);
  const opacity = useTransform(x, [-140, 0, 140], [0.2, 1, 0.2]);

  const reverseIndex = total - 1 - index;
  const isTop = reverseIndex === 0;
  const posConfig = getPositionStyles(position);

  // Vertical stack offset depending on top or bottom orientation
  const directionMultiplier = posConfig.isTop ? 1 : -1;
  const offset = isHovered
    ? reverseIndex * (directionMultiplier * 78)
    : reverseIndex * (directionMultiplier * 10);

  const scale = isHovered ? 1 : 1 - reverseIndex * 0.04;
  const zIndex = 30 - reverseIndex;
  const cardOpacity = isHovered ? 1 : Math.max(0.5, 1 - reverseIndex * 0.2);

  const getAccentBorder = (type?: ToastType) => {
    switch (type) {
      case "success":
        return "border-l-emerald-500 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent";
      case "error":
        return "border-l-rose-500 bg-gradient-to-r from-rose-500/10 via-transparent to-transparent";
      case "warning":
        return "border-l-amber-400 bg-gradient-to-r from-amber-400/10 via-transparent to-transparent";
      case "loading":
        return "border-l-indigo-500 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent";
      default:
        return "border-l-cyan-400 bg-gradient-to-r from-cyan-400/10 via-transparent to-transparent";
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
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 300) {
          onDismiss(toast.id);
        }
      }}
      initial={{
        opacity: 0,
        y: posConfig.isTop ? -30 : 30,
        scale: 0.9,
      }}
      animate={{
        y: offset,
        scale,
        opacity: cardOpacity,
      }}
      exit={{
        opacity: 0,
        x: x.get() >= 0 ? 220 : -220,
        scale: 0.85,
        transition: { duration: 0.18 },
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 32,
        mass: 0.8,
      }}
      className={cn(
        "absolute w-84 rounded-xl border border-zinc-200/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/95 select-none transition-shadow",
        "border-l-[3px]",
        getAccentBorder(toast.type),
        isTop ? "cursor-grab active:cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)]" : "pointer-events-none",
        posConfig.isBottom ? "bottom-0" : "top-0",
        posConfig.isLeft ? "left-0" : posConfig.isRight ? "right-0" : "left-1/2 -translate-x-1/2"
      )}
    >
      {/* Telemetry Header: Time + System Status */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          <Terminal size={11} className="text-zinc-400" />
          <span>{toast.timestamp || "TELEMETRY"}</span>
          {toast.statusCode && (
            <>
              <span>•</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-200">{toast.statusCode}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isTop && (
            <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
              <GripVertical size={11} />
              <span>Swipe</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer p-0.5"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Title & Body */}
      <div>
        <h5 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-white">
          {toast.title}
        </h5>
        {toast.message && (
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {toast.message}
          </p>
        )}
      </div>

      {/* Optional Interactive Footer Action */}
      {toast.action && (
        <div className="mt-3 flex items-center justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer transition-colors shadow-xs"
          >
            <RotateCcw size={10} />
            <span>{toast.action.label}</span>
          </button>
        </div>
      )}
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
  position?: ToastPosition;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const visibleToasts = toasts.slice(-3);
  const posConfig = getPositionStyles(position);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("h-36 w-84", posConfig.containerClass)}
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast, idx) => (
          <StudioSlipCard
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
  );
}

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
    <PhysicalStackToast
      toasts={toasts}
      onDismiss={onDismiss}
      position={position}
    />
  );
}
