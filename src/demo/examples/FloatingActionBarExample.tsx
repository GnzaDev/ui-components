import { useState } from "react";
import { FloatingActionBar } from "../../FloatingActionBar";
import type { FloatingAction } from "../../FloatingActionBar";
import {
  Copy,
  Trash2,
  Archive,
  Star,
  CheckSquare,
  Square,
  CheckCircle2,
  Ban,
  ShieldCheck,
  Mail,
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  category: string;
}

type ActionPreset = "files" | "moderation";

const FILE_ITEMS: Item[] = [
  { id: "1", name: "DavoActionSheet.tsx", category: "Primitives" },
  { id: "2", name: "MorphingStepDialog.tsx", category: "Dialogs" },
  { id: "3", name: "SortableSpringList.tsx", category: "Lists" },
  { id: "4", name: "FloatingActionBar.tsx", category: "Toolbars" },
];

const USER_ITEMS: Item[] = [
  { id: "u1", name: "alex.doe@example.com", category: "Pending Review" },
  { id: "u2", name: "sara.smith@workspace.io", category: "Flagged Content" },
  { id: "u3", name: "dev.gonza@github.com", category: "Contributor" },
  { id: "u4", name: "maria.dev@cloud.sh", category: "Pending Review" },
];

export function FloatingActionBarExample() {
  const [preset, setPreset] = useState<ActionPreset>("files");
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "2"]);

  const currentItems = preset === "files" ? FILE_ITEMS : USER_ITEMS;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map((i) => i.id));
    }
  };

  const fileActions: FloatingAction[] = [
    {
      id: "star",
      label: "Star",
      icon: <Star size={13} />,
      onClick: () => {
        alert(`Starred ${selectedIds.length} items`);
      },
    },
    {
      id: "copy",
      label: "Duplicate",
      icon: <Copy size={13} />,
      onClick: () => {
        alert(`Duplicated ${selectedIds.length} items`);
      },
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive size={13} />,
      onClick: () => {
        alert(`Archived ${selectedIds.length} items`);
        setSelectedIds([]);
      },
    },
    {
      id: "delete",
      label: "Delete",
      variant: "danger",
      icon: <Trash2 size={13} />,
      onClick: () => {
        alert(`Deleted ${selectedIds.length} items`);
        setSelectedIds([]);
      },
    },
  ];

  const moderationActions: FloatingAction[] = [
    {
      id: "approve",
      label: "Approve User",
      icon: <CheckCircle2 size={13} />,
      variant: "primary",
      onClick: () => {
        alert(`Approved ${selectedIds.length} accounts`);
        setSelectedIds([]);
      },
    },
    {
      id: "message",
      label: "Send Warning",
      icon: <Mail size={13} />,
      onClick: () => {
        alert(`Notified ${selectedIds.length} accounts`);
      },
    },
    {
      id: "verify",
      label: "Mark Verified",
      icon: <ShieldCheck size={13} />,
      onClick: () => {
        alert(`Marked ${selectedIds.length} accounts verified`);
      },
    },
    {
      id: "ban",
      label: "Suspend",
      variant: "danger",
      icon: <Ban size={13} />,
      onClick: () => {
        alert(`Suspended ${selectedIds.length} accounts`);
        setSelectedIds([]);
      },
    },
  ];

  const actions = preset === "files" ? fileActions : moderationActions;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 w-full space-y-6">
      <div className="space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              FloatingActionBar (Elastic Toolbar)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Bulk action dock animated with calibrated spring entry and exit.
            </p>
          </div>

          {/* Position Selector */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setPosition("bottom")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                position === "bottom"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Bottom Dock
            </button>
            <button
              type="button"
              onClick={() => setPosition("top")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                position === "top"
                  ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Top Dock
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setPreset("files");
                setSelectedIds(["1", "2"]);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                preset === "files"
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 font-medium"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              Files Preset
            </button>
            <button
              type="button"
              onClick={() => {
                setPreset("moderation");
                setSelectedIds(["u1"]);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                preset === "moderation"
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 font-medium"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              Moderation Preset
            </button>
          </div>

          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
          >
            {selectedIds.length === currentItems.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        {/* Selectable Items */}
        <div className="space-y-1.5">
          {currentItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800/80"
                    : "border-zinc-200/80 bg-zinc-50/40 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-zinc-400">
                    {isSelected ? (
                      <CheckSquare size={15} className="text-zinc-950 dark:text-white" />
                    ) : (
                      <Square size={15} />
                    )}
                  </span>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{item.category}</span>
              </div>
            );
          })}
        </div>
      </div>

      <FloatingActionBar
        open={selectedIds.length > 0}
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        actions={actions}
        position={position}
      />
    </div>
  );
}
