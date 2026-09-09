import { useState } from "react";
import { SwayCard } from "../../SwayCard";
import { Sparkles, Code2, Heart, Share2, Eye, Server, Cpu } from "lucide-react";

export function ExpandableCardExample() {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const cards = [
    {
      id: "card-springs",
      badge: "Design Engineering",
      title: "Micro-interactions & Spring Physics",
      subtitle: "Published 2 hours ago • 4 min read",
      gradient: "from-fuchsia-600 via-pink-600 to-amber-500",
      tagline: "Euler-Newton Springs",
      summary: "Explore how spring physics simulate organic friction and mass, eliminating mechanical linear easing in product interfaces.",
      views: "2.8k",
      likes: "194",
      content: (
        <div className="space-y-4">
          <p>
            When a user interacts with digital elements, the brain instinctively expects inertia. Fixed cubic-bezier durations feel robotic compared to dynamic initial velocity.
          </p>
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
              <Code2 size={14} />
              <span>Spring Formula</span>
            </h4>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              stiffness: 380 | damping: 30 | mass: 0.8
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "card-edge",
      badge: "Infrastructure",
      title: "Edge Delivery & Geo DNS",
      subtitle: "Published 1 day ago • 6 min read",
      gradient: "from-teal-600 via-emerald-600 to-cyan-500",
      tagline: "Sub-15ms Roundtrips",
      summary: "Routing dynamic HTTP requests to nearest edge points of presence with instant failover and TLS handshakes.",
      views: "4.1k",
      likes: "312",
      content: (
        <div className="space-y-4">
          <p>
            By terminating TCP connections at 240+ globally distributed edge points, TTFB drops drastically regardless of distance to the origin database.
          </p>
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
              <Server size={14} />
              <span>Edge Topology</span>
            </h4>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              anycast_dns: true | tls_session_tickets: 0-RTT
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "card-flip",
      badge: "Animation Architecture",
      title: "GSAP FLIP Coordinate Matrix",
      subtitle: "Published 3 days ago • 8 min read",
      gradient: "from-indigo-600 via-violet-600 to-purple-500",
      tagline: "First-Last-Invert-Play",
      summary: "Recording initial client bounding rects and computing affine transforms to avoid costly browser layout thrashing.",
      views: "5.6k",
      likes: "489",
      content: (
        <div className="space-y-4">
          <p>
            FLIP calculates pixel deltas (dx, dy, dw, dh) and inverts the element with GPU transforms, delivering silky 120 FPS transitions without reflowing the DOM.
          </p>
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
            <h4 className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
              <Cpu size={14} />
              <span>FLIP Math</span>
            </h4>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              transform: translate3d(dx, dy, 0) scale(dw, dh)
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/60 dark:text-fuchsia-400">
          <Sparkles size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          SwayCard Multi-Card Grid
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Click any of the cards below to see how Motion seamlessly expands that specific element from its exact grid coordinates into a reading modal.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <SwayCard
            key={c.id}
            id={c.id}
            isOpen={openCardId === c.id}
            onOpen={() => setOpenCardId(c.id)}
            onClose={() => setOpenCardId(null)}
            badge={c.badge}
            title={c.title}
            subtitle={c.subtitle}
            image={
              <div className={`h-full w-full bg-gradient-to-tr ${c.gradient} p-4 flex flex-col justify-end text-white`}>
                <span className="font-mono text-xs opacity-80">{c.tagline}</span>
              </div>
            }
            summary={<p>{c.summary}</p>}
          >
            <div className="space-y-4">
              {c.content}

              <div className="flex items-center gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <Eye size={14} /> {c.views} views
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart size={14} className="text-rose-500 fill-rose-500" /> {c.likes}
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
        ))}
      </div>
    </div>
  );
}
