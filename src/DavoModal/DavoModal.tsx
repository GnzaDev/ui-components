import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { prettyModalService } from "./pretty-modal";
import "./davo-modal.css";

export interface DavoModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
  triggerSelector?: string;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  panelClassName?: string;
}

export function DavoModal({
  open,
  onClose,
  triggerRef,
  triggerSelector = "#davo-trigger-btn",
  title,
  children,
  footer,
  maxWidth = "max-w-xl",
  panelClassName,
}: DavoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      isClosingRef.current = false;
      const origin =
        triggerRef?.current ||
        (triggerSelector
          ? document.querySelector<HTMLElement>(triggerSelector)
          : null);

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
  }, [open, triggerRef, triggerSelector]);

  const handleRequestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog || isClosingRef.current) return;
    isClosingRef.current = true;
    prettyModalService.close(dialog, () => {
      isClosingRef.current = false;
      onClose();
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleRequestClose();
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="pretty-modal-dialog fixed inset-0 m-auto p-0 border-0 bg-transparent text-inherit outline-none shadow-none z-50"
    >
      <div
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-[2.5rem] border border-zinc-200/80 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)] outline-none dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_30px_90px_rgba(0,0,0,0.9)] max-h-[90vh]",
          maxWidth,
          panelClassName
        )}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-100 px-6 pb-4 pt-6 dark:border-white/[0.06]">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={handleRequestClose}
              aria-label="Cerrar"
              className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-4 [scrollbar-color:rgba(150,150,150,0.25)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
          <div className="w-full">{children}</div>
        </div>

        {footer && (
          <div className="shrink-0 rounded-b-[2.5rem] border-t border-zinc-100 bg-white px-6 py-4 dark:border-white/[0.08] dark:bg-zinc-900">
            {footer}
          </div>
        )}
      </div>
    </dialog>,
    document.body
  );
}
