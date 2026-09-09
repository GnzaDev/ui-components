import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface MorphTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutIdPrefix?: string;
  fullWidth?: boolean;
  className?: string;
  tabClassName?: string;
  pillClassName?: string;
}

export function MorphTabs({
  tabs,
  activeTab,
  onChange,
  layoutIdPrefix = "morph-tabs",
  fullWidth = false,
  className,
  tabClassName,
  pillClassName,
}: MorphTabsProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1 rounded-2xl border border-zinc-200/80 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900/80",
        fullWidth && "w-full flex",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-w-0",
              fullWidth && "flex-1",
              isActive
                ? "text-zinc-950 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`${layoutIdPrefix}-pill`}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                  mass: 0.8,
                }}
                className={cn(
                  "absolute inset-0 z-[-1] rounded-xl bg-white shadow-xs dark:bg-zinc-800",
                  pillClassName
                )}
              />
            )}

            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.2 text-[10px] font-bold leading-tight",
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
