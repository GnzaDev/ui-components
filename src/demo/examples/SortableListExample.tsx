import { useState } from "react";
import { SortableSpringList } from "../../SortableSpringList";
import type { SortableItem } from "../../SortableSpringList";
import {
  ListFilter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode,
  RotateCcw,
} from "lucide-react";

const INITIAL_TASKS: SortableItem[] = [
  {
    id: "1",
    title: "Implementar gestos Pointer Events",
    subtitle: "DavoActionSheet con drag-to-dismiss y snap-back",
    icon: <CheckCircle2 size={16} className="text-emerald-500" />,
    badge: "Completado",
  },
  {
    id: "2",
    title: "Diseñar MorphingStepDialog",
    subtitle: "Wizard con redimensión elástica con Motion layout",
    icon: <Clock size={16} className="text-amber-500" />,
    badge: "En progreso",
  },
  {
    id: "3",
    title: "Optimizar bundle con Code Splitting",
    subtitle: "Reducir chunk inicial debajo de 500kb en Vite",
    icon: <AlertCircle size={16} className="text-blue-500" />,
    badge: "Pendiente",
  },
  {
    id: "4",
    title: "Exportar tipos y documentación",
    subtitle: "TypeScript definition files para consumo externo",
    icon: <FileCode size={16} className="text-purple-500" />,
    badge: "Próximo",
  },
];

export function SortableListExample() {
  const [tasks, setTasks] = useState<SortableItem[]>(INITIAL_TASKS);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <ListFilter size={20} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          SortableSpringList
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Fluid drag-and-drop sortable list powered by Motion spring physics. Neighboring items gracefully part ways.
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
              Drag & Drop
            </span>
            <span>•</span>
            <span>Spring FLIP</span>
          </div>

          <button
            type="button"
            onClick={() => setTasks(INITIAL_TASKS)}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-5">
        <SortableSpringList items={tasks} onReorder={setTasks} />
      </div>
    </div>
  );
}
