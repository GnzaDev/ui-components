import { useState } from "react";
import { FloatingActionBar } from "../../FloatingActionBar";
import type { FloatingAction } from "../../FloatingActionBar";
import {
  Sliders,
  Copy,
  Trash2,
  Archive,
  Star,
  CheckSquare,
  Square,
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  category: string;
}

const SAMPLE_ITEMS: Item[] = [
  { id: "1", name: "DavoActionSheet.tsx", category: "Componentes" },
  { id: "2", name: "MorphingStepDialog.tsx", category: "Modales" },
  { id: "3", name: "SortableSpringList.tsx", category: "Listas" },
  { id: "4", name: "FloatingActionBar.tsx", category: "Toolbars" },
];

export function FloatingActionBarExample() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "2"]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === SAMPLE_ITEMS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(SAMPLE_ITEMS.map((i) => i.id));
    }
  };

  const actions: FloatingAction[] = [
    {
      id: "star",
      label: "Destacar",
      icon: <Star size={13} />,
      onClick: () => alert(`Destacaste ${selectedIds.length} elementos`),
    },
    {
      id: "copy",
      label: "Duplicar",
      icon: <Copy size={13} />,
      onClick: () => alert(`Duplicaste ${selectedIds.length} elementos`),
    },
    {
      id: "archive",
      label: "Archivar",
      icon: <Archive size={13} />,
      onClick: () => {
        alert(`Archivaste ${selectedIds.length} elementos`);
        setSelectedIds([]);
      },
    },
    {
      id: "delete",
      label: "Eliminar",
      variant: "danger",
      icon: <Trash2 size={13} />,
      onClick: () => {
        alert(`Eliminaste ${selectedIds.length} elementos`);
        setSelectedIds([]);
      },
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
          <Sliders size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          FloatingActionBar
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Contextual floating toolbar appearing elastically when items are selected. Perfect for bulk actions or rich selection.
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="rounded-md bg-cyan-50 px-2 py-0.5 font-medium text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
              Contextual Bar
            </span>
            <span>•</span>
            <span>Spring Entry</span>
          </div>

          <button
            type="button"
            onClick={handleSelectAll}
            className="text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
          >
            {selectedIds.length === SAMPLE_ITEMS.length ? "Deseleccionar todo" : "Seleccionar todo"}
          </button>
        </div>
      </div>

      {/* Selectable Items */}
      <div className="mt-5 space-y-1.5">
        {SAMPLE_ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800/80"
                  : "border-zinc-100 bg-zinc-50/40 hover:bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-800/20 dark:hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-500">
                  {isSelected ? (
                    <CheckSquare size={15} className="text-zinc-900 dark:text-white" />
                  ) : (
                    <Square size={15} />
                  )}
                </span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {item.name}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">{item.category}</span>
            </div>
          );
        })}
      </div>

      <FloatingActionBar
        open={selectedIds.length > 0}
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        actions={actions}
      />
    </div>
  );
}
