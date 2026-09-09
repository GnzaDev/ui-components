import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { prettyModalService } from "../DavoModal/pretty-modal";
import "../DavoModal/davo-modal.css";

export interface DavoActionSheetProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
  title?: string;
  description?: string;
  children?: ReactNode;
  maxWidth?: string;
  className?: string;
  dismissible?: boolean;
}

export function DavoActionSheet({
  open,
  onClose,
  triggerRef,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
  className,
  dismissible = true,
}: DavoActionSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const currentTranslateYRef = useRef(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      isClosingRef.current = false;
      if (sheetRef.current) {
        sheetRef.current.style.transform = "";
        sheetRef.current.style.transition = "";
      }
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
  }, [open, triggerRef]);

  const handleRequestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog || isClosingRef.current) return;
    isClosingRef.current = true;
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
      sheetRef.current.style.transition = "";
    }
    prettyModalService.close(dialog, () => {
      isClosingRef.current = false;
      onClose();
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current && !isDraggingRef.current) {
      handleRequestClose();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dismissible || isClosingRef.current) return;
    if (e.button !== 0) return; // Only primary button (left-click or touch)

    // Ignore if user clicked on an interactive element
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select")) {
      return;
    }

    const sheet = sheetRef.current;
    if (!sheet) return;

    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartTimeRef.current = Date.now();
    currentTranslateYRef.current = 0;

    sheet.style.transition = "none";
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    const deltaY = e.clientY - dragStartYRef.current;

    // Moving downwards: 1:1 displacement; moving upwards: rubber-band resistance
    if (deltaY > 0) {
      currentTranslateYRef.current = deltaY;
    } else {
      currentTranslateYRef.current = deltaY * 0.2;
    }

    sheet.style.transform = `translateY(${currentTranslateYRef.current}px)`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already lost
    }

    const sheet = sheetRef.current;
    const dialog = dialogRef.current;
    if (!sheet || !dialog) return;

    const deltaY = currentTranslateYRef.current;
    const duration = Math.max(Date.now() - dragStartTimeRef.current, 1);
    const velocityY = deltaY / duration; // px/ms

    // Dismiss if pulled down > 90px OR fast downward swipe (> 30px with velocity > 0.4)
    const shouldDismiss = deltaY > 90 || (deltaY > 30 && velocityY > 0.4);

    if (shouldDismiss) {
      isClosingRef.current = true;
      dialog.classList.add("pretty-modal-closing");
      sheet.style.transition = "transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)";
      sheet.style.transform = "translateY(100%)";

      let dismissed = false;
      const finishDismiss = () => {
        if (dismissed) return;
        dismissed = true;
        sheet.removeEventListener("transitionend", finishDismiss);
        dialog.classList.remove("pretty-modal-closing");
        dialog.setAttribute("style", "");
        sheet.style.transition = "";
        sheet.style.transform = "";
        if (dialog.open) dialog.close();
        isClosingRef.current = false;
        onClose();
      };

      sheet.addEventListener("transitionend", finishDismiss, { once: true });
      setTimeout(finishDismiss, 260);
    } else {
      // Snap back to original position
      sheet.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
      sheet.style.transform = "translateY(0px)";

      const handleResetEnd = () => {
        sheet.removeEventListener("transitionend", handleResetEnd);
        sheet.style.transition = "";
        sheet.style.transform = "";
      };

      sheet.addEventListener("transitionend", handleResetEnd, { once: true });
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="pretty-modal-dialog fixed inset-x-0 bottom-0 top-auto m-0 mx-auto p-0 border-0 bg-transparent text-inherit outline-none shadow-none z-50 w-full"
    >
      <div
        ref={sheetRef}
        className={cn(
          "relative mx-auto flex w-full flex-col overflow-hidden rounded-t-[2.5rem] border-t border-x border-zinc-200/80 bg-white p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] outline-none dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_-20px_70px_rgba(0,0,0,0.85)] max-h-[85vh]",
          maxWidth,
          className
        )}
      >
        {/* Top drag handle zone */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={cn(
            "touch-none select-none",
            dismissible && "cursor-grab active:cursor-grabbing"
          )}
        >
          {/* Grab bar indicator with enlarged touch target */}
          <div className="mx-auto -mt-2 mb-3 flex h-6 w-full items-center justify-center">
            <div className="h-1.5 w-12 rounded-full bg-zinc-300 transition-colors group-hover:bg-zinc-400 dark:bg-zinc-700" />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="pointer-events-none">
              {title && (
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleRequestClose}
              aria-label="Cerrar"
              className="pointer-events-auto rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto [scrollbar-color:rgba(150,150,150,0.25)_transparent] [scrollbar-width:thin]">
          {children}
        </div>
      </div>
    </dialog>,
    document.body
  );
}
