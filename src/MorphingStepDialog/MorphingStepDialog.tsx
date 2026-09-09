import { useState, useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "../utils/cn";
import { prettyModalService } from "../DavoModal/pretty-modal";
import "../DavoModal/davo-modal.css";

export interface StepItem {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  isValid?: boolean;
}

export interface MorphingStepDialogProps {
  open: boolean;
  onClose: () => void;
  steps: StepItem[];
  onComplete?: () => void;
  maxWidth?: string;
  className?: string;
  engine?: "gonza" | "davo";
  triggerRef?: RefObject<HTMLElement | null>;
  layoutId?: string;
}

export function MorphingStepDialog({
  open,
  onClose,
  steps,
  onComplete,
  maxWidth = "max-w-lg",
  className,
  engine = "gonza",
  triggerRef,
  layoutId,
}: MorphingStepDialogProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const isClosingRef = useRef(false);

  // Reset step index when opened
  useEffect(() => {
    if (open) {
      setCurrentStepIndex(0);
      setDirection(1);
      setIsSubmitting(false);
    }
  }, [open]);

  // Davo Engine: GSAP FLIP Open/Close Lifecycle
  useEffect(() => {
    if (engine !== "davo") return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      isClosingRef.current = false;
      const origin = triggerRef?.current;
      if (origin) {
        prettyModalService.open(dialog, origin);
      } else if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open && !isClosingRef.current) {
      isClosingRef.current = true;
      prettyModalService.close(dialog, () => {
        isClosingRef.current = false;
      });
    }
  }, [open, engine, triggerRef]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRequestClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, engine]);

  const handleRequestClose = () => {
    if (engine === "davo") {
      const dialog = dialogRef.current;
      if (!dialog || isClosingRef.current) return;
      isClosingRef.current = true;
      prettyModalService.close(dialog, () => {
        isClosingRef.current = false;
        onClose();
      });
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleRequestClose();
    }
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete?.();
        handleRequestClose();
      }, 700);
      return;
    }
    setDirection(1);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    if (isFirstStep) return;
    setDirection(-1);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  const dialogInner = (
    <>
      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isDone = idx < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold transition-all",
                    isActive &&
                      "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-900 scale-105",
                    isDone &&
                      "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white",
                    !isActive &&
                      !isDone &&
                      "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                  )}
                >
                  {isDone ? <Check size={14} /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-6 rounded-full transition-colors",
                      isDone ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleRequestClose}
          aria-label="Cerrar"
          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Step Header */}
      <div className="mt-4">
        <h3 className="text-base font-bold text-zinc-950 dark:text-white">
          {currentStep.title}
        </h3>
        {currentStep.description && (
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {currentStep.description}
          </p>
        )}
      </div>

      {/* Animated Step Body (Height auto-morphs via parent layout) */}
      <motion.div layout className="relative mt-5 min-h-[140px] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={currentStep.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {currentStep.content}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Footer Navigation Actions */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstStep || isSubmitting}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer",
            isFirstStep && "invisible pointer-events-none"
          )}
        >
          <ArrowLeft size={14} />
          <span>Atrás</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentStep.isValid === false || isSubmitting}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-98 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer",
            (currentStep.isValid === false || isSubmitting) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          <span>
            {isSubmitting
              ? "Guardando..."
              : isLastStep
              ? "Finalizar"
              : "Continuar"}
          </span>
          {!isLastStep && <ArrowRight size={14} />}
          {isLastStep && !isSubmitting && <Check size={14} />}
        </button>
      </div>
    </>
  );

  // Engine 1: Davo (GSAP FLIP Matrix Projection on native <dialog>)
  if (engine === "davo") {
    return createPortal(
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="pretty-modal-dialog fixed inset-0 m-auto p-0 border-0 bg-transparent text-inherit outline-none shadow-none z-50"
      >
        <div
          className={cn(
            "relative flex w-full flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh]",
            maxWidth,
            className
          )}
        >
          {dialogInner}
        </div>
      </dialog>,
      document.body
    );
  }

  // Engine 2: Gonza (Motion Spring Physics & Layout Projection)
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleRequestClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Morphing Dialog Container */}
          <motion.div
            layout
            layoutId={layoutId}
            style={{ borderRadius: 24 }}
            initial={
              layoutId
                ? undefined
                : { opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }
            }
            animate={
              layoutId
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              layoutId
                ? { opacity: 0, filter: "blur(6px)", transition: { duration: 0.2 } }
                : { opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }
            }
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className={cn(
              "relative z-10 flex w-full flex-col overflow-hidden border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh]",
              maxWidth,
              className
            )}
          >
            {dialogInner}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export interface MorphingStepDialogTriggerProps {
  layoutId?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function MorphingStepDialogTrigger({
  layoutId = "step-dialog-morph",
  onClick,
  children,
  className,
}: MorphingStepDialogTriggerProps) {
  return (
    <motion.button
      type="button"
      layout
      layoutId={layoutId}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      onClick={onClick}
      style={{ borderRadius: 16 }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer",
        className
      )}
    >
      <motion.span layout="position" className="inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
}

MorphingStepDialog.Trigger = MorphingStepDialogTrigger;

