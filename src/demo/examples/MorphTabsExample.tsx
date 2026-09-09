import { useState } from "react";
import { MorphTabs, type TabItem } from "../../MorphTabs";
import { Activity, Users, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function MorphTabsExample() {
  const [activeTab, setActiveTab] = useState("overview");
  const [fullWidth, setFullWidth] = useState(true);

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", icon: <Activity size={13} /> },
    { id: "team", label: "Team", icon: <Users size={13} />, badge: 8 },
    { id: "security", label: "Security", icon: <Shield size={13} /> },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">Segmented Tabs Preview</span>
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setFullWidth(true)}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              fullWidth
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Full Width
          </button>
          <button
            type="button"
            onClick={() => setFullWidth(false)}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              !fullWidth
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Fit Content
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Tabs switcher */}
        <div className="flex w-full items-center justify-start">
          <MorphTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            fullWidth={fullWidth}
            layoutIdPrefix="demo-showcase-tabs"
          />
        </div>

        {/* Content panel with animated switch */}
        <div className="min-h-[105px] rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5"
            >
              {activeTab === "overview" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-500" />
                    <span>Live Cluster Metrics</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Average response latency: 18ms across 6 edge regions. 99.98% uptime SLA recorded over the last 90 days.
                  </p>
                </div>
              )}
              {activeTab === "team" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Users size={13} className="text-blue-500" />
                    <span>8 Active Maintainers</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Design engineering and platform architecture squads are currently online and syncing with staging branches.
                  </p>
                </div>
              )}
              {activeTab === "security" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Shield size={13} className="text-emerald-500" />
                    <span>Enterprise Zero-Trust</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    SAML SSO, RBAC roles, and automated dependency vulnerability scans are all strictly enforced.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
