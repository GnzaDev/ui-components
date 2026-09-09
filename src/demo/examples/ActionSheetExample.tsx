import { useRef, useState } from "react";
import { DavoActionSheet } from "../../DavoActionSheet";
import {
  Share2,
  Copy,
  Mail,
  FileDown,
  Trash2,
  ArrowRight,
  Check,
  ExternalLink,
} from "lucide-react";

export function ActionSheetExample() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
          <Share2 size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          DavoActionSheet
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Mobile-style bottom drawer morphing from button trigger via GSAP Flip into native &lt;dialog&gt;.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-teal-50 px-2 py-0.5 font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
            Bottom Sheet
          </span>
          <span>•</span>
          <span>Native Dialog</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
        >
          <Share2 size={14} />
          <span>Open Action Sheet</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <DavoActionSheet
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        title="Share Document"
        description="Choose how you would like to distribute or export this design system specification."
      >
        <div className="mt-4 space-y-2">
          {/* Action 1 */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                <Copy size={16} />
              </span>
              <span>Copy Public Link</span>
            </span>
            {copied ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check size={14} /> Copied!
              </span>
            ) : (
              <span className="text-zinc-400 font-normal">Anyone with link</span>
            )}
          </button>

          {/* Action 2 */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                <Mail size={16} />
              </span>
              <span>Invite via Email</span>
            </span>
            <ExternalLink size={14} className="text-zinc-400" />
          </button>

          {/* Action 3 */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                <FileDown size={16} />
              </span>
              <span>Export PDF Specification</span>
            </span>
            <span className="font-mono text-zinc-400 font-normal">2.4 MB</span>
          </button>

          {/* Danger Action */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-3.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-950/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="rounded-xl bg-red-100 p-2 text-red-600 dark:bg-red-900/60 dark:text-red-300">
                <Trash2 size={16} />
              </span>
              <span>Revoke All Shared Links</span>
            </span>
            <span className="text-[11px] font-normal text-red-400">Irreversible</span>
          </button>
        </div>
      </DavoActionSheet>
    </div>
  );
}
