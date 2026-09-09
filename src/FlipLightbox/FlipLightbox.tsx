import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";
import { cn } from "../utils/cn";
import { prettyModalService } from "../DavoModal/pretty-modal";
import { useScrollLock } from "../utils/useScrollLock";
import "../DavoModal/davo-modal.css";

export interface LightboxImage {
  id: string;
  src: string;
  title: string;
  caption?: string;
  tag?: string;
}

export interface FlipLightboxProps {
  images: LightboxImage[];
  className?: string;
}

export function FlipLightbox({ images, className }: FlipLightboxProps) {
  const [activeImage, setActiveImage] = useState<LightboxImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);
  const isClosingRef = useRef(false);

  useScrollLock(!!activeImage);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeImage && activeTriggerRef.current) {
      isClosingRef.current = false;
      prettyModalService.open(dialog, activeTriggerRef.current);
    } else if (!activeImage && dialog.open && !isClosingRef.current) {
      isClosingRef.current = true;
      prettyModalService.close(dialog, () => {
        isClosingRef.current = false;
      });
    }
  }, [activeImage]);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (!dialog || isClosingRef.current) return;
    isClosingRef.current = true;
    prettyModalService.close(dialog, () => {
      isClosingRef.current = false;
      setActiveImage(null);
    });
  };

  return (
    <>
      {/* Grid of gallery items */}
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", className)}>
        {images.map((img) => (
          <div
            key={img.id}
            data-flip-origin={img.id}
            onClick={(e) => {
              activeTriggerRef.current = e.currentTarget;
              setActiveImage(img);
            }}
            className="group relative h-36 w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 cursor-pointer shadow-xs transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <img
              src={img.src}
              alt={img.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
              <span className="text-xs font-bold truncate">{img.title}</span>
              {img.tag && (
                <span className="text-[10px] text-zinc-300 font-medium">{img.tag}</span>
              )}
            </div>
            <div className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Dialog using GSAP Flip */}
      {createPortal(
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === dialogRef.current) handleClose();
          }}
          className="pretty-modal-dialog fixed inset-0 m-auto p-0 border-0 bg-transparent text-inherit outline-none shadow-none z-50 w-fit max-w-[94vw] max-h-[92vh]"
        >
          {activeImage && (
            <div className="relative mx-auto flex flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/20 bg-zinc-950/90 text-white shadow-2xl backdrop-blur-2xl">
              {/* Floating Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-white/90 backdrop-blur-md transition-all hover:bg-black/90 hover:text-white border border-white/10 cursor-pointer shadow-md"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>

              {/* Image View wrapped tightly without letterbox bars */}
              <div className="relative flex items-center justify-center overflow-hidden max-h-[82vh] max-w-[90vw]">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="max-h-[80vh] max-w-[88vw] w-auto h-auto object-contain select-none rounded-[28px]"
                />

                {/* Floating Bottom Glassmorphism Bar */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between rounded-2xl bg-black/65 px-4 py-3 text-xs text-white backdrop-blur-md border border-white/10 shadow-lg">
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="font-bold truncate text-sm">{activeImage.title}</h4>
                    {activeImage.caption && (
                      <p className="text-[11px] text-zinc-300 truncate mt-0.5">{activeImage.caption}</p>
                    )}
                  </div>
                  {activeImage.tag && (
                    <span className="shrink-0 rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase text-white backdrop-blur-sm">
                      {activeImage.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </dialog>,
        document.body
      )}
    </>
  );
}
