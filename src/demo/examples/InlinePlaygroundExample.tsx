import { useRef, useState } from "react";
import { GonzaModal, GonzaModalTrigger } from "../../GonzaModal";
import { DavoModal } from "../../DavoModal";
import { Sliders, Monitor, Play, Sparkles, Layers, ArrowRight, Compass } from "lucide-react";

type ModalEngine = "gonza" | "davo";
type TriggerPosition = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export function InlinePlaygroundExample() {
  const [engine, setEngine] = useState<ModalEngine>("gonza");
  const [position, setPosition] = useState<TriggerPosition>("center");
  const [gonzaOpen, setGonzaOpen] = useState(false);
  const [davoOpen, setDavoOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("max-w-md");
  const [closeVariant, setCloseVariant] = useState<"spring" | "davo">("spring");
  const [disableEscape, setDisableEscape] = useState(false);
  const [isInline, setIsInline] = useState(true);

  const davoPlaygroundTriggerRef = useRef<HTMLButtonElement>(null);

  const getPositionClasses = (pos: TriggerPosition) => {
    switch (pos) {
      case "top-left":
        return "top-3 left-3";
      case "top-right":
        return "top-3 right-3";
      case "bottom-left":
        return "bottom-3 left-3";
      case "bottom-right":
        return "bottom-3 right-3";
      case "center":
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              <Sliders size={16} />
            </span>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              Interactive Props & Corner Morphing Playground
            </h3>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Compare <strong>GonzaModal</strong> (Motion Spring) vs <strong>DavoModal</strong> (GSAP Flip) originating from any viewport corner.
          </p>
        </div>

        {/* Engine switcher tab */}
        <div className="flex items-center gap-1 rounded-2xl border border-zinc-200 bg-zinc-100/80 p-1 dark:border-zinc-700 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setEngine("gonza")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              engine === "gonza"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Sparkles size={13} className="text-violet-500" />
            <span>GonzaModal (Motion)</span>
          </button>

          <button
            type="button"
            onClick={() => setEngine("davo")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              engine === "davo"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Layers size={13} className="text-indigo-500" />
            <span>DavoModal (GSAP Flip)</span>
          </button>
        </div>
      </div>

      {/* Configuration row */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        {/* Origin Position selector */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 text-xs dark:border-zinc-700 dark:bg-zinc-800">
          <span className="flex items-center gap-1 px-1.5 text-zinc-400 text-[11px] font-medium">
            <Compass size={12} />
            <span>Origin:</span>
          </span>
          {(
            [
              { id: "top-left", label: "↖ Top-L" },
              { id: "top-right", label: "↗ Top-R" },
              { id: "center", label: "• Center" },
              { id: "bottom-left", label: "↙ Bot-L" },
              { id: "bottom-right", label: "↘ Bot-R" },
            ] as const
          ).map((pos) => (
            <button
              key={pos.id}
              type="button"
              onClick={() => setPosition(pos.id)}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                position === pos.id
                  ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>

        {/* MaxWidth selector */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 text-xs dark:border-zinc-700 dark:bg-zinc-800">
          <span className="px-2 text-zinc-400 text-[11px] font-medium">Width:</span>
          {(["max-w-sm", "max-w-md", "max-w-lg", "max-w-xl"] as const).map((width) => (
            <button
              key={width}
              type="button"
              onClick={() => setMaxWidth(width)}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                maxWidth === width
                  ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {width.replace("max-w-", "")}
            </button>
          ))}
        </div>

        {/* Engine-specific controls */}
        {engine === "gonza" ? (
          <>
            {/* Close variant selector */}
            <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 text-xs dark:border-zinc-700 dark:bg-zinc-800">
              <span className="px-2 text-zinc-400 text-[11px] font-medium">Exit Style:</span>
              {(["spring", "davo"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCloseVariant(v)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                    closeVariant === v
                      ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Escape key toggle */}
            <button
              type="button"
              onClick={() => setDisableEscape(!disableEscape)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                disableEscape
                  ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                  : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <span>Escape: {disableEscape ? "Disabled" : "Active"}</span>
            </button>

            {/* Inline switch */}
            <button
              type="button"
              onClick={() => setIsInline(!isInline)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isInline
                  ? "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
                  : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Monitor size={13} />
              <span>Container Containment (inline): {isInline ? "ON" : "OFF"}</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
              Native &lt;dialog&gt; + GSAP Flip
            </span>
            <span>Renders directly to browser top layer via ref trigger origin</span>
          </div>
        )}
      </div>

      {/* Mockup Canvas */}
      <div className="relative mt-6 h-96 w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100/70 p-6 flex flex-col justify-between dark:border-zinc-800 dark:bg-zinc-950/60">
        {/* Mock window top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-400/80" />
            <div className="h-3 w-3 rounded-full bg-amber-400/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[11px] text-zinc-400">
              engine: {engine === "gonza" ? "GonzaModal (Motion)" : "DavoModal (GSAP Flip)"} • {maxWidth} • origin: {position}
            </span>
          </div>
          <span className="rounded-md bg-zinc-200/60 px-2 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {engine === "gonza"
              ? isInline
                ? "inline containment"
                : "screen portal"
              : "html dialog top-layer"}
          </span>
        </div>

        {/* Dynamic trigger positioning area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Helper hint */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
            <p className="text-xs text-zinc-400/70 select-none">
              Trigger placed at <span className="font-semibold text-zinc-600 dark:text-zinc-300">{position}</span>
              <br />
              Click it to watch the morphing trajectory span across the viewport
            </p>
          </div>

          {/* Trigger button anchored to chosen position */}
          <div className={`absolute transition-all duration-300 ease-out ${getPositionClasses(position)}`}>
            {engine === "gonza" ? (
              <GonzaModalTrigger
                layoutId="playground-modal-trigger"
                onClick={() => setGonzaOpen(true)}
                className="text-xs shadow-md"
              >
                <Play size={14} className="fill-current text-violet-500" />
                <span>Launch GonzaModal</span>
              </GonzaModalTrigger>
            ) : (
              <button
                ref={davoPlaygroundTriggerRef}
                type="button"
                onClick={() => setDavoOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-md hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
              >
                <Play size={14} className="fill-current text-indigo-500" />
                <span>Launch DavoModal</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 text-[11px] text-zinc-400 dark:border-zinc-800">
          <span>
            {engine === "gonza"
              ? "Stiffness: 400 | Damping: 30"
              : "GSAP Flip: 0.45s CustomEase (0.56, 0.27, 0, 1)"}
          </span>
          <span>
            Origin: <strong className="text-zinc-600 dark:text-zinc-300">{position}</strong>
          </span>
        </div>

        {/* GonzaModal Instance */}
        {engine === "gonza" && (
          <GonzaModal
            open={gonzaOpen}
            onClose={() => setGonzaOpen(false)}
            layoutId="playground-modal-trigger"
            title="GonzaModal Playground"
            maxWidth={maxWidth}
            closeVariant={closeVariant}
            disableEscape={disableEscape}
            inline={isInline}
            footer={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGonzaOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Close Modal
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Animation Engine:</span>
                  <span className="font-semibold text-violet-600 dark:text-violet-400">
                    Motion (Spring Physics)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Origin Position:</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white uppercase">
                    {position}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Active MaxWidth:</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                    {maxWidth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Exit Animation Style:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white capitalize">
                    {closeVariant}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Inline Containment:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {isInline ? "Enabled (No Portal)" : "Disabled (Body Portal)"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                GonzaModal uses Motion’s <code className="font-mono text-zinc-700 dark:text-zinc-300">layoutId</code> to smoothly morph across the full distance between the <strong className="text-zinc-800 dark:text-zinc-200">{position}</strong> trigger and the center viewport.
              </p>
            </div>
          </GonzaModal>
        )}
      </div>

      {/* DavoModal Instance (portal to body) */}
      <DavoModal
        open={davoOpen}
        onClose={() => setDavoOpen(false)}
        triggerRef={davoPlaygroundTriggerRef}
        title="DavoModal Playground"
        maxWidth={maxWidth}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDavoOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Close Modal
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-zinc-50 p-3.5 dark:bg-zinc-800/60 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Animation Engine:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                GSAP Flip + CustomEase
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Origin Position:</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-white uppercase">
                {position}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Container Primitive:</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                HTML &lt;dialog&gt; (Top Layer)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Active MaxWidth:</span>
              <span className="font-mono font-semibold text-zinc-900 dark:text-white">
                {maxWidth}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            GSAP Flip captures the bounding rect of the button positioned at <strong className="text-zinc-800 dark:text-zinc-200">{position}</strong>, translates and scales the HTML dialog smoothly to the viewport center.
          </p>
        </div>
      </DavoModal>
    </div>
  );
}
