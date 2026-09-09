import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Check,
} from "lucide-react";
import { cn } from "../utils/cn";
import { prettyModalService } from "../DavoModal/pretty-modal";
import "../DavoModal/davo-modal.css";

export interface DavoDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  showTime?: boolean;
  inline?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  engine?: "gonza" | "davo";
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEK_DAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

export function DavoDatePicker({
  value,
  onChange,
  showTime = false,
  inline = false,
  minDate,
  maxDate,
  placeholder = "Seleccionar fecha...",
  className,
  engine = "gonza",
}: DavoDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [viewDate, setViewDate] = useState<Date>(value ?? new Date());
  const [direction, setDirection] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(inline);
  const [timeState, setTimeState] = useState<{ hours: number; minutes: number }>({
    hours: value ? value.getHours() : 12,
    minutes: value ? value.getMinutes() : 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isClosingRef = useRef(false);


  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setViewDate(value);
      setTimeState({
        hours: value.getHours(),
        minutes: value.getMinutes(),
      });
    }
  }, [value]);

  const handleRequestClose = () => {
    if (engine === "davo") {
      const panel = panelRef.current;
      const origin = triggerRef.current;
      if (panel && origin && !isClosingRef.current) {
        isClosingRef.current = true;
        prettyModalService.closeElement(panel, origin, () => {
          panel.style.display = "none";
          isClosingRef.current = false;
          setIsOpen(false);
        });
        return;
      }
    }
    setIsOpen(false);
  };

  // Davo Engine: GSAP FLIP morphing from trigger button to calendar
  useEffect(() => {
    if (inline || engine !== "davo") return;
    const panel = panelRef.current;
    const origin = triggerRef.current;
    if (!panel || !origin) return;

    if (isOpen) {
      isClosingRef.current = false;
      panel.style.display = "block";
      prettyModalService.openElement(panel, origin);
    } else if (panel.style.display !== "none" && !isClosingRef.current) {
      isClosingRef.current = true;
      prettyModalService.closeElement(panel, origin, () => {
        panel.style.display = "none";
        isClosingRef.current = false;
      });
    }
  }, [isOpen, engine, inline]);

  // Click outside to close popover
  useEffect(() => {
    if (inline) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleRequestClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, inline, engine]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setDirection(-1);
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setViewDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Days array
  const calendarDays: Array<{ day: number; currentMonth: boolean; date: Date }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthLastDay - i,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - i),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      currentMonth: true,
      date: new Date(year, month, d),
    });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    calendarDays.push({
      day: n,
      currentMonth: false,
      date: new Date(year, month + 1, n),
    });
  }

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const isDateDisabled = (d: Date) => {
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const handleSelectDay = (date: Date) => {
    if (isDateDisabled(date)) return;
    const finalDate = new Date(date);
    if (showTime) {
      finalDate.setHours(timeState.hours);
      finalDate.setMinutes(timeState.minutes);
    }
    setSelectedDate(finalDate);
    onChange?.(finalDate);
    if (!inline && !showTime) {
      handleRequestClose();
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    setTimeState({ hours, minutes });
    if (selectedDate) {
      const updated = new Date(selectedDate);
      updated.setHours(hours);
      updated.setMinutes(minutes);
      setSelectedDate(updated);
      onChange?.(updated);
    }
  };

  const handleTodayShortcut = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewDate(now);
    setTimeState({ hours: now.getHours(), minutes: now.getMinutes() });
    onChange?.(now);
    if (!inline && !showTime) handleRequestClose();
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange?.(null);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  const formatDisplay = (d: Date | null) => {
    if (!d) return placeholder;
    const dateStr = d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    if (showTime) {
      const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
      return `${dateStr}, ${timeStr}`;
    }
    return dateStr;
  };

  const calendarContent = (
    <div className="w-[320px] rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 select-none">
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-xs font-bold text-zinc-900 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
        {WEEK_DAYS.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Animated Days Grid */}
      <div className="relative mt-1 min-h-[210px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-7 gap-1"
          >
            {calendarDays.map((item, idx) => {
              const selected = isSameDay(item.date, selectedDate);
              const today = isToday(item.date);
              const disabled = isDateDisabled(item.date);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(item.date)}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center mx-auto rounded-xl text-xs font-medium transition-all cursor-pointer",
                    disabled && "opacity-30 cursor-not-allowed pointer-events-none",
                    !item.currentMonth && !disabled && "text-zinc-300 dark:text-zinc-600",
                    item.currentMonth && !selected && !disabled && "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                    today && !selected && !disabled && "border border-zinc-300 dark:border-zinc-700 font-bold",
                    selected && "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-950 font-bold scale-105"
                  )}
                >
                  {item.day}
                  {today && !selected && !disabled && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-teal-500" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Optional Time Picker Section */}
      {showTime && (
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Clock size={13} className="text-zinc-400" />
              <span>Hora</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="23"
                value={String(timeState.hours).padStart(2, "0")}
                onChange={(e) => {
                  const h = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
                  handleTimeChange(h, timeState.minutes);
                }}
                className="w-10 rounded-lg border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-center text-xs font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-zinc-400 font-bold">:</span>
              <input
                type="number"
                min="0"
                max="59"
                step="5"
                value={String(timeState.minutes).padStart(2, "0")}
                onChange={(e) => {
                  const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  handleTimeChange(timeState.hours, m);
                }}
                className="w-10 rounded-lg border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-center text-xs font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Footer Shortcuts */}
      <div className="mt-3 flex items-center justify-between pt-3 border-t border-zinc-100 text-xs dark:border-zinc-800">
        <button
          type="button"
          onClick={handleTodayShortcut}
          className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
        >
          Hoy
        </button>

        {selectedDate && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-zinc-400 hover:text-rose-500 cursor-pointer transition-colors"
          >
            <RotateCcw size={11} />
            <span>Limpiar</span>
          </button>
        )}

        {!inline && (
          <button
            type="button"
            onClick={handleRequestClose}
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1 font-semibold text-white dark:bg-white dark:text-zinc-900 cursor-pointer"
          >
            <Check size={12} />
            <span>Listo</span>
          </button>
        )}
      </div>
    </div>
  );

  if (inline) {
    return <div className={cn("inline-block", className)}>{calendarContent}</div>;
  }

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (isOpen) handleRequestClose();
          else setIsOpen(true);
        }}
        className={cn(
          "inline-flex h-10 items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-white px-3.5 text-xs font-medium text-zinc-800 shadow-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80 cursor-pointer",
          isOpen && "ring-2 ring-zinc-900/10 dark:ring-white/10"
        )}
      >
        <CalendarIcon size={14} className="text-zinc-400" />
        <span className={!selectedDate ? "text-zinc-400" : "font-semibold"}>
          {formatDisplay(selectedDate)}
        </span>
      </button>

      {/* Engine 1: Davo (GSAP FLIP Matrix Projection on element) */}
      {engine === "davo" && (
        <div
          ref={panelRef}
          style={{ display: "none" }}
          className="absolute left-0 z-50 mt-2"
        >
          {calendarContent}
        </div>
      )}

      {/* Engine 2: Gonza (Motion Spring Physics) */}
      {engine === "gonza" && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 z-50 mt-2"
            >
              {calendarContent}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
