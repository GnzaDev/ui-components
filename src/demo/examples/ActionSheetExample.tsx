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
  Camera,
  Image,
  ScanLine,
  User,
  Building,
  Shield,
  LogOut,
} from "lucide-react";

type ActionPreset = "share" | "media" | "account";

export function ActionSheetExample() {
  const [preset, setPreset] = useState<ActionPreset>("share");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getPresetDetails = () => {
    switch (preset) {
      case "share":
        return {
          title: "Share Document",
          description: "Choose how you would like to distribute or export this design system specification.",
          triggerLabel: "Open Share Sheet",
          icon: <Share2 size={14} />,
        };
      case "media":
        return {
          title: "Upload Media Attachment",
          description: "Select capture source or upload from device storage.",
          triggerLabel: "Open Media Sheet",
          icon: <Camera size={14} />,
        };
      case "account":
        return {
          title: "Switch Active Workspace",
          description: "Switch your current authenticated context or manage permissions.",
          triggerLabel: "Open Switcher Sheet",
          icon: <User size={14} />,
        };
    }
  };

  const current = getPresetDetails();

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <Share2 size={20} />
          </div>

          {/* Preset Selector */}
          <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setPreset("share")}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                preset === "share"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => setPreset("media")}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                preset === "media"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Media
            </button>
            <button
              type="button"
              onClick={() => setPreset("account")}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                preset === "account"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Account
            </button>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
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
          <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
            Preset: {preset}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
        >
          {current.icon}
          <span>{current.triggerLabel}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <DavoActionSheet
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        title={current.title}
        description={current.description}
      >
        <div className="mt-4 space-y-2">
          {preset === "share" && (
            <>
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
            </>
          )}

          {preset === "media" && (
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                    <Camera size={16} />
                  </span>
                  <span>Take Live Photo</span>
                </span>
                <span className="text-zinc-400 font-normal">Camera</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                    <Image size={16} />
                  </span>
                  <span>Choose from Photos</span>
                </span>
                <span className="text-zinc-400 font-normal">Library</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                    <ScanLine size={16} />
                  </span>
                  <span>Scan Physical Document</span>
                </span>
                <span className="text-zinc-400 font-normal">OCR</span>
              </button>
            </>
          )}

          {preset === "account" && (
            <>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-900/10 bg-zinc-100/70 p-3.5 text-xs font-semibold text-zinc-950 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-zinc-900 p-2 text-white shadow-xs dark:bg-white dark:text-zinc-950">
                    <User size={16} />
                  </span>
                  <span className="text-left">
                    <div className="font-semibold">Alex Rivera (Personal)</div>
                    <div className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">alex@rivera.dev</div>
                  </span>
                </span>
                <Check size={14} className="text-emerald-500" />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                    <Building size={16} />
                  </span>
                  <span className="text-left">
                    <div className="font-semibold">Acronis Studio (Team)</div>
                    <div className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">14 Members • Admin</div>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-white p-2 text-zinc-700 shadow-xs dark:bg-zinc-700 dark:text-zinc-200">
                    <Shield size={16} />
                  </span>
                  <span className="text-left">
                    <div className="font-semibold">Enterprise Sandbox</div>
                    <div className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">Read-only cluster</div>
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-3.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-950/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60 cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-red-100 p-2 text-red-600 dark:bg-red-900/60 dark:text-red-300">
                    <LogOut size={16} />
                  </span>
                  <span>Sign Out of All Accounts</span>
                </span>
              </button>
            </>
          )}
        </div>
      </DavoActionSheet>
    </div>
  );
}
