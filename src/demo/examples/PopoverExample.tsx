import { useState } from "react";
import { GonzaPopover, type PopoverPlacement } from "../../GonzaPopover";
import {
  Sliders,
  User,
  Settings,
  CreditCard,
  Sparkles,
  Layers,
  ChevronDown,
  LogOut,
} from "lucide-react";

export function PopoverExample() {
  const [open, setOpen] = useState(false);
  const [engine, setEngine] = useState<"gonza" | "davo">("gonza");
  const [placement, setPlacement] = useState<PopoverPlacement>("bottom-center");
  const [preset, setPreset] = useState<"dimensions" | "profile">("dimensions");

  const [dimensions, setDimensions] = useState({
    width: "100%",
    maxWidth: "320px",
    height: "25px",
    maxHeight: "none",
  });

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 w-full">
      {/* Shadcn-style Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {/* Engine switcher */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setEngine("gonza")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              engine === "gonza"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Sparkles size={12} className="text-orange-500" />
            <span>Motion Spring</span>
          </button>
          <button
            type="button"
            onClick={() => setEngine("davo")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              engine === "davo"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Layers size={12} className="text-indigo-500" />
            <span>GSAP Bloom</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setPreset("dimensions")}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              preset === "dimensions"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Dimensions (Shadcn)
          </button>
          <button
            type="button"
            onClick={() => setPreset("profile")}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              preset === "profile"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            User Profile
          </button>
        </div>

        {/* Placement Selector */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          {(["bottom-center", "bottom-left", "bottom-right", "top-center"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlacement(p)}
              className={`rounded-lg px-2 py-1 text-[11px] transition-all cursor-pointer ${
                placement === p
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {p.replace("bottom-", "B-").replace("top-", "T-")}
            </button>
          ))}
        </div>
      </div>

      {/* Popover Centered Anchor Stage */}
      <div className="min-h-[360px] flex items-start justify-center pt-8 pb-32">
        <GonzaPopover
          open={open}
          onClose={() => setOpen(false)}
          placement={placement}
          engine={engine}
          trigger={
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {preset === "dimensions" ? (
                <>
                  <Sliders size={14} className="text-zinc-500" />
                  <span>Open popover</span>
                </>
              ) : (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900">
                    AR
                  </div>
                  <span>Account Settings</span>
                  <ChevronDown size={13} className="text-zinc-400" />
                </>
              )}
            </button>
          }
        >
          {/* Preset 1: Shadcn Dimensions Popover */}
          {preset === "dimensions" && (
            <div className="w-80 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-zinc-950 dark:text-white">
                    Dimensions
                  </h4>
                  <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {engine === "gonza" ? "Motion" : "GSAP"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Set the dimensions for the layer.
                </p>
              </div>

              <div className="grid gap-2 text-xs">
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Width</label>
                  <input
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                    className="col-span-2 h-8 rounded-lg border border-zinc-200 bg-transparent px-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Max. width</label>
                  <input
                    value={dimensions.maxWidth}
                    onChange={(e) => setDimensions({ ...dimensions, maxWidth: e.target.value })}
                    className="col-span-2 h-8 rounded-lg border border-zinc-200 bg-transparent px-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Height</label>
                  <input
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                    className="col-span-2 h-8 rounded-lg border border-zinc-200 bg-transparent px-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">Max. height</label>
                  <input
                    value={dimensions.maxHeight}
                    onChange={(e) => setDimensions({ ...dimensions, maxHeight: e.target.value })}
                    className="col-span-2 h-8 rounded-lg border border-zinc-200 bg-transparent px-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preset 2: Profile Popover */}
          {preset === "profile" && (
            <div className="w-64 space-y-1">
              <div className="flex items-center justify-between border-b border-zinc-100 px-2 py-2 dark:border-zinc-800">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">Alex Rivera</p>
                  <p className="text-[11px] text-zinc-400">alex@example.com</p>
                </div>
                <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {engine === "gonza" ? "Motion" : "GSAP"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <User size={14} className="text-zinc-400" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <CreditCard size={14} className="text-zinc-400" />
                <span>Billing</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Settings size={14} className="text-zinc-400" />
                <span>Settings</span>
              </button>

              <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </GonzaPopover>
      </div>
    </div>
  );
}
