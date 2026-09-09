import { useRef, useState } from "react";
import { DavoModal } from "../../DavoModal";
import { FolderGit2, Star, GitFork, ExternalLink, ArrowRight, Activity, Terminal } from "lucide-react";

export function ProjectCardModalExample() {
  const [open, setOpen] = useState(false);
  const cardTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        {/* Card Thumbnail / Header */}
        <div className="relative mb-4 h-32 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 p-4 text-white shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md">
              <Activity size={10} /> Active Release
            </span>
            <span className="text-[11px] font-mono opacity-80">v2.4.0</span>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">
              Open Source
            </span>
            <h4 className="text-base font-bold tracking-tight">
              Hyperion Engine
            </h4>
          </div>
        </div>

        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Project Card Flip
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Cinematic morphing from card trigger using native HTML dialog and GSAP Flip.
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="text-amber-500 fill-amber-500" /> 1,420
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork size={13} /> 284
          </span>
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            TypeScript
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          ref={cardTriggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
        >
          <span>View Project Specs</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <DavoModal
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={cardTriggerRef}
        title="Hyperion Design Engine"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <Terminal size={14} />
              <span>npm i @hyperion/engine</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Done
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
              >
                <span>Documentation</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Banner inside modal */}
          <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                Production Ready
              </span>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-medium">
                  <Star size={13} className="fill-amber-300 text-amber-300" /> 1.4k
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <GitFork size={13} /> 284
                </span>
              </div>
            </div>
            <h3 className="mt-3 text-xl font-bold tracking-tight">
              High-performance WebGL & Motion Architecture
            </h3>
            <p className="mt-1 text-xs opacity-90 leading-relaxed">
              Designed for creative developers seeking frame-perfect 60fps animations, physics simulations, and seamless UI morphing transitions.
            </p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-[11px] text-zinc-400">Bundle Size</span>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">4.2 kB</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Zero dependencies</span>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-[11px] text-zinc-400">Render Loop</span>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">120 fps</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Hardware accelerated</span>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-[11px] text-zinc-400">Downloads</span>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">85k/mo</p>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400">+14% this month</span>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Key Capabilities
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="mt-0.5 rounded-lg bg-zinc-100 p-1.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <FolderGit2 size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Composable Layout Coordinates
                  </h5>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Uses FLIP (First, Last, Invert, Play) algorithms to calculate DOM bounding boxes and compute matrix transforms with GPU acceleration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="mt-0.5 rounded-lg bg-zinc-100 p-1.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <Activity size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Spring Inertia & Velocity Match
                  </h5>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Interruptible motion curves ensure interactions feel organic without stuttering when gestures change mid-flight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DavoModal>
    </div>
  );
}
