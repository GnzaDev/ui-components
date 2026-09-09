import { useState } from "react";
import { SwayCard } from "../../SwayCard";
import { Sparkles, Code2, Heart, Share2, Eye } from "lucide-react";

export function ExpandableCardExample() {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/60 dark:text-fuchsia-400">
          <Sparkles size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          SwayCard Expandable
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Feed item morphing from a compact preview card into a full modal reading experience with Motion.
        </p>
      </div>

      <div className="mt-6">
        <SwayCard
          id="showcase-article-card"
          isOpen={openCardId === "showcase-article-card"}
          onOpen={() => setOpenCardId("showcase-article-card")}
          onClose={() => setOpenCardId(null)}
          badge="Design Engineering"
          title="Micro-interactions & Spring Physics"
          subtitle="Published 2 hours ago • 4 min read"
          image={
            <div className="h-full w-full bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-amber-500 p-4 flex flex-col justify-end text-white">
              <span className="font-mono text-xs opacity-80">60 FPS Smooth Interpolation</span>
            </div>
          }
          summary={
            <p>
              Explore how spring physics simulate organic real-world friction and mass, eliminating mechanical linear easing in modern product interfaces.
            </p>
          }
        >
          <div className="space-y-4">
            <p>
              When a user touches or clicks a digital element, the human brain instinctively expects inertia. Traditional cubic-bezier curves often fail because they are bound by fixed durations rather than dynamic velocity.
            </p>

            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
              <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
                <Code2 size={14} />
                <span>Spring Formula Parameterization</span>
              </h4>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                stiffness: 380 | damping: 30 | mass: 0.8
              </p>
            </div>

            <p>
              By leveraging Motion’s <code className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">layoutId</code> projection, the DOM coordinates of the compact card container, header image, and title interpolate seamlessly without layout shifts.
            </p>

            <div className="flex items-center gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <Eye size={14} /> 2,840 views
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart size={14} className="text-rose-500 fill-rose-500" /> 194 likes
              </span>
              <button
                type="button"
                className="ml-auto inline-flex items-center gap-1 font-semibold text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white cursor-pointer"
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        </SwayCard>
      </div>
    </div>
  );
}
