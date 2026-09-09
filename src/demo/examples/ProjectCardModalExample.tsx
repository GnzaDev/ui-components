import { useRef, useState } from "react";
import { DavoModal } from "../../DavoModal";
import { FolderGit2, Star, GitFork, ExternalLink, ArrowRight, Activity, Terminal, Zap } from "lucide-react";

interface ProjectData {
  id: string;
  name: string;
  version: string;
  language: string;
  tag: string;
  stars: string;
  forks: string;
  gradient: string;
  description: string;
  command: string;
  bundleSize: string;
  fps: string;
  downloads: string;
  features: Array<{ title: string; desc: string }>;
}

const PROJECTS: ProjectData[] = [
  {
    id: "hyperion",
    name: "Hyperion Design Engine",
    version: "v2.4.0",
    language: "TypeScript",
    tag: "Open Source",
    stars: "1,420",
    forks: "284",
    gradient: "from-violet-600 via-fuchsia-600 to-pink-500",
    description: "Frame-perfect 60fps animations, physics simulations, and seamless UI morphing transitions.",
    command: "npm i @hyperion/engine",
    bundleSize: "4.2 kB",
    fps: "120 fps",
    downloads: "85k/mo",
    features: [
      {
        title: "Composable Layout Coordinates",
        desc: "Uses FLIP algorithms to calculate DOM bounding boxes and compute matrix transforms.",
      },
      {
        title: "Spring Inertia & Velocity Match",
        desc: "Interruptible motion curves ensure interactions feel organic without stuttering.",
      },
    ],
  },
  {
    id: "vortex",
    name: "Vortex Edge Gateway",
    version: "v1.8.2",
    language: "Rust",
    tag: "Infrastructure",
    stars: "2,840",
    forks: "419",
    gradient: "from-teal-600 via-emerald-600 to-cyan-500",
    description: "Sub-millisecond API routing, Anycast DNS resolution, and global distributed cache.",
    command: "cargo add vortex-gateway",
    bundleSize: "1.8 MB",
    fps: "0.4ms TTFB",
    downloads: "240k/mo",
    features: [
      {
        title: "Zero-Copy TCP Sockets",
        desc: "Linux epoll and io_uring architecture for 2M concurrent persistent connections.",
      },
      {
        title: "Dynamic Wasm Filters",
        desc: "Inject request rate-limiters and JWT validation at the edge with WebAssembly.",
      },
    ],
  },
  {
    id: "nova",
    name: "Nova UI Framework",
    version: "v3.0.0-rc",
    language: "React 19",
    tag: "Design System",
    stars: "3,590",
    forks: "612",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    description: "Accessible, unstyled UI primitives powered by React 19 Actions and Suspense streams.",
    command: "npm i @nova/ui@next",
    bundleSize: "3.1 kB",
    fps: "Fluid CSS",
    downloads: "190k/mo",
    features: [
      {
        title: "Headless Primitive Tree",
        desc: "WAI-ARIA compliant keyboard focus management and screen reader announcements.",
      },
      {
        title: "Zero-Runtime CSS Variables",
        desc: "Tailwind v4 compatible design tokens with automatic dark mode contrast tuning.",
      },
    ],
  },
];

export function ProjectCardModalExample() {
  const [selectedProjectId, setSelectedProjectId] = useState("hyperion");
  const [open, setOpen] = useState(false);
  const cardTriggerRef = useRef<HTMLButtonElement>(null);

  const current = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        {/* Project Selector Pills */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400">Select Project:</span>
          <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProjectId(p.id)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  selectedProjectId === p.id
                    ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Card Thumbnail / Header */}
        <div
          className={`relative mb-4 h-32 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${current.gradient} p-4 text-white shadow-inner flex flex-col justify-between transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md">
              <Activity size={10} /> {current.tag}
            </span>
            <span className="text-[11px] font-mono opacity-80">{current.version}</span>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">
              {current.language}
            </span>
            <h4 className="text-base font-bold tracking-tight">
              {current.name}
            </h4>
          </div>
        </div>

        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Project Card FLIP
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Cinematic morphing from card trigger using native HTML &lt;dialog&gt; and GSAP Flip.
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="text-amber-500 fill-amber-500" /> {current.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork size={13} /> {current.forks}
          </span>
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {current.language}
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
          <span>Inspect {current.name}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <DavoModal
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={cardTriggerRef}
        title={current.name}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <Terminal size={14} />
              <span>{current.command}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Close
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
          <div className={`rounded-2xl bg-gradient-to-r ${current.gradient} p-5 text-white`}>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                {current.tag}
              </span>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-medium">
                  <Star size={13} className="fill-amber-300 text-amber-300" /> {current.stars}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <GitFork size={13} /> {current.forks}
                </span>
              </div>
            </div>
            <h3 className="mt-3 text-xl font-bold tracking-tight">
              {current.name} {current.version}
            </h3>
            <p className="mt-1 text-xs opacity-90 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-[11px] text-zinc-400">Bundle / Metric</span>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">{current.bundleSize}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Production ready</span>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-[11px] text-zinc-400">Performance</span>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">{current.fps}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Hardware accelerated</span>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <span className="text-[11px] text-zinc-400">Downloads</span>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">{current.downloads}</p>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Growing community</span>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Key Capabilities
            </h4>
            <div className="space-y-2">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800">
                  <div className="mt-0.5 rounded-lg bg-zinc-100 p-1.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {idx === 0 ? <FolderGit2 size={14} /> : <Zap size={14} />}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {feat.title}
                    </h5>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DavoModal>
    </div>
  );
}
