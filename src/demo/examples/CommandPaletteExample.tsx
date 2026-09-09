import { useEffect, useState } from "react";
import { CommandPalette, type CommandItem } from "../../CommandPalette";
import {
  Command,
  FilePlus,
  UserPlus,
  Download,
  LayoutDashboard,
  Settings,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export function CommandPaletteExample() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Global listener for Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const triggerAction = (name: string) => {
    setLastAction(name);
    setTimeout(() => setLastAction(null), 2500);
  };

  const items: CommandItem[] = [
    {
      id: "new-project",
      title: "Create New Project",
      category: "Actions",
      shortcut: "⌘N",
      icon: <FilePlus size={15} />,
      onSelect: () => triggerAction("Created New Project"),
    },
    {
      id: "invite-member",
      title: "Invite Team Member",
      category: "Actions",
      shortcut: "⌘I",
      icon: <UserPlus size={15} />,
      onSelect: () => triggerAction("Opened Invite Modal"),
    },
    {
      id: "export-data",
      title: "Export Metrics Report",
      category: "Actions",
      shortcut: "⌘E",
      icon: <Download size={15} />,
      onSelect: () => triggerAction("Downloaded Metrics PDF"),
    },
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      category: "Navigation",
      shortcut: "G D",
      icon: <LayoutDashboard size={15} />,
      onSelect: () => triggerAction("Navigated to Dashboard"),
    },
    {
      id: "nav-settings",
      title: "Go to Preferences & Security",
      category: "Navigation",
      shortcut: "G S",
      icon: <Settings size={15} />,
      onSelect: () => triggerAction("Navigated to Settings"),
    },
    {
      id: "nav-billing",
      title: "Go to Invoices & Plans",
      category: "Navigation",
      shortcut: "G B",
      icon: <CreditCard size={15} />,
      onSelect: () => triggerAction("Navigated to Billing"),
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <Command size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          CommandPalette (⌘K)
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Raycast/Linear style spotlight menu with fuzzy filtering, keyboard shortcuts, and arrow navigation.
        </p>

        {lastAction && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 size={13} />
            <span>Executed: {lastAction}</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-full items-center justify-between rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Command size={14} className="text-zinc-400" />
            <span>Open Command Palette...</span>
          </span>
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            ⌘K
          </span>
        </button>
      </div>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        placeholder="Type to search actions, pages, or commands..."
      />
    </div>
  );
}
