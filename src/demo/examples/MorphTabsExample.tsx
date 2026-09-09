import { useState } from "react";
import { MorphTabs, type TabItem } from "../../MorphTabs";
import {
  Activity,
  Users,
  Shield,
  Zap,
  FileCode,
  GitPullRequest,
  Terminal,
  CreditCard,
  Sparkles,
  Building,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type TabScenario = "cluster" | "editor" | "billing";
type TabAlignment = "full" | "start" | "center" | "end";

export function MorphTabsExample() {
  const [scenario, setScenario] = useState<TabScenario>("cluster");
  const [alignment, setAlignment] = useState<TabAlignment>("full");
  const [activeTab, setActiveTab] = useState("overview");

  const scenarioTabs: Record<TabScenario, TabItem[]> = {
    cluster: [
      { id: "overview", label: "Overview", icon: <Activity size={13} /> },
      { id: "team", label: "Team", icon: <Users size={13} />, badge: 8 },
      { id: "security", label: "Security", icon: <Shield size={13} /> },
    ],
    editor: [
      { id: "files", label: "Explorer", icon: <FileCode size={13} /> },
      { id: "diff", label: "Changes", icon: <GitPullRequest size={13} />, badge: 3 },
      { id: "terminal", label: "Terminal", icon: <Terminal size={13} /> },
    ],
    billing: [
      { id: "monthly", label: "Monthly", icon: <CreditCard size={13} /> },
      { id: "annual", label: "Annual", icon: <Sparkles size={13} />, badge: "-20%" },
      { id: "enterprise", label: "Enterprise", icon: <Building size={13} /> },
    ],
  };

  const handleScenarioChange = (newScenario: TabScenario) => {
    setScenario(newScenario);
    setActiveTab(scenarioTabs[newScenario][0].id);
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case "start":
        return "justify-start";
      case "center":
        return "justify-center";
      case "end":
        return "justify-end";
      default:
        return "w-full";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Scenario Switcher */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => handleScenarioChange("cluster")}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              scenario === "cluster"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Cluster
          </button>
          <button
            type="button"
            onClick={() => handleScenarioChange("editor")}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              scenario === "editor"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => handleScenarioChange("billing")}
            className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
              scenario === "billing"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            Billing
          </button>
        </div>

        {/* Alignment Selector */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800/80">
          {(["full", "start", "center", "end"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlignment(a)}
              className={`rounded-lg px-2 py-1 text-[11px] transition-all cursor-pointer ${
                alignment === a
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {a === "full" ? "Full" : a === "start" ? "Left" : a === "center" ? "Center" : "Right"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Tabs switcher */}
        <div className={`flex w-full items-center ${getAlignmentClass()}`}>
          <MorphTabs
            tabs={scenarioTabs[scenario]}
            activeTab={activeTab}
            onChange={setActiveTab}
            fullWidth={alignment === "full"}
            layoutIdPrefix={`demo-tabs-${scenario}`}
          />
        </div>

        {/* Content panel with animated switch */}
        <div className="min-h-[105px] rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenario}-${activeTab}`}
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

              {activeTab === "files" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <FileCode size={13} className="text-cyan-500" />
                    <span>Workspace File Explorer</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    42 modules indexed. TypeScript strict mode enabled with zero lint warnings across the workspace.
                  </p>
                </div>
              )}
              {activeTab === "diff" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <GitPullRequest size={13} className="text-purple-500" />
                    <span>3 Modified Files</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    +142 insertions, -18 deletions ready for commit in branch <code className="font-mono text-zinc-800 dark:text-zinc-200">feature/motion-springs</code>.
                  </p>
                </div>
              )}
              {activeTab === "terminal" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Terminal size={13} className="text-emerald-500" />
                    <span>Background Daemon Output</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-mono text-[11px]">
                    [vite] hmr update /src/demo/examples/MorphTabsExample.tsx (ready in 48ms)
                  </p>
                </div>
              )}

              {activeTab === "monthly" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard size={13} className="text-zinc-700 dark:text-zinc-300" />
                    <span>Standard Monthly Billing</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Pay-as-you-go at $29/seat/month. Cancel or change seat quotas anytime from your team settings.
                  </p>
                </div>
              )}
              {activeTab === "annual" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Annual Subscription (Save 20%)</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Billed annually at $23/seat/month ($276/yr). Includes dedicated customer success engineer.
                  </p>
                </div>
              )}
              {activeTab === "enterprise" && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Building size={13} className="text-blue-500" />
                    <span>Enterprise Custom Contract</span>
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Custom volume pricing, 99.99% uptime SLA, SOC2 Type II compliance reports, and invoicing via wire transfer.
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
