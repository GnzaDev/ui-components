import type { ReactNode } from "react";
import { Reorder, useDragControls } from "motion/react";
import { GripVertical } from "lucide-react";
import { cn } from "../utils/cn";

export interface SortableItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
}

export interface SortableSpringListProps<T extends SortableItem> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem?: (item: T, isDragging: boolean) => ReactNode;
  className?: string;
  itemClassName?: string;
}

function SortableRow<T extends SortableItem>({
  item,
  renderItem,
  itemClassName,
}: {
  item: T;
  renderItem?: (item: T, isDragging: boolean) => ReactNode;
  itemClassName?: string;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.025,
        boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
        zIndex: 50,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 35,
      }}
      className={cn(
        "relative flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900 select-none",
        itemClassName
      )}
    >
      {renderItem ? (
        renderItem(item, false)
      ) : (
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Dedicated Drag Handle */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex h-8 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing touch-none transition-colors"
            >
              <GripVertical size={16} />
            </div>

            {item.icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {item.icon}
              </div>
            )}

            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>

          {item.badge && (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Reorder.Item>
  );
}

export function SortableSpringList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
}: SortableSpringListProps<T>) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={cn("flex flex-col gap-2.5", className)}
    >
      {items.map((item) => (
        <SortableRow
          key={item.id}
          item={item}
          renderItem={renderItem}
          itemClassName={itemClassName}
        />
      ))}
    </Reorder.Group>
  );
}
