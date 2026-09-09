import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, Command, ArrowRight } from "lucide-react";
import { cn } from "../utils/cn";
import { useScrollLock } from "../utils/useScrollLock";

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  maxWidth?: string;
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command or search...",
  maxWidth = "max-w-xl",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items
  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
      return;
    }

    inputRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? (filtered.length ? filtered.length - 1 : 0) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].onSelect();
          onClose();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, filtered, selectedIndex, onClose]);

  useScrollLock(open);

  // Group by category
  const categories = Array.from(new Set(filtered.map((item) => item.category)));

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md dark:bg-black/70"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.8 }}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900",
              maxWidth
            )}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <Search size={18} className="text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={placeholder}
                className="w-full bg-transparent px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white"
              />
              <span className="flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
                <Command size={10} /> K
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 [scrollbar-color:rgba(150,150,150,0.25)_transparent] [scrollbar-width:thin]">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No commands found matching &quot;{query}&quot;
                </div>
              ) : (
                categories.map((category) => {
                  const categoryItems = filtered.filter(
                    (item) => item.category === category
                  );
                  return (
                    <div key={category} className="mb-2">
                      <span className="px-3 py-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {category}
                      </span>
                      {categoryItems.map((item) => {
                        const globalIndex = filtered.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              item.onSelect();
                              onClose();
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              isSelected
                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              {item.icon && (
                                <span className={cn(isSelected ? "text-white dark:text-zinc-900" : "text-zinc-400")}>
                                  {item.icon}
                                </span>
                              )}
                              <span>{item.title}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.shortcut && (
                                <span
                                  className={cn(
                                    "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                                    isSelected
                                      ? "bg-white/20 text-white dark:bg-black/10 dark:text-zinc-900"
                                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                  )}
                                >
                                  {item.shortcut}
                                </span>
                              )}
                              {isSelected && <ArrowRight size={13} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer tips */}
            <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-2.5 text-[11px] text-zinc-400 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="font-mono text-[10px]">{filtered.length} actions</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
