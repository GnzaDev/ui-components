import { useState } from "react";
import { DavoDatePicker } from "../../DavoDatePicker";
import { Calendar, Clock, Zap } from "lucide-react";

export function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showTime, setShowTime] = useState(true);
  const [isInline, setIsInline] = useState(false);
  const [engine, setEngine] = useState<"sway" | "davo">("sway");

  const setPreset = (type: "now" | "tomorrow" | "week" | "month") => {
    const d = new Date();
    if (type === "now") {
      setSelectedDate(new Date());
    } else if (type === "tomorrow") {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      setSelectedDate(d);
    } else if (type === "week") {
      d.setDate(d.getDate() + 7);
      d.setHours(14, 30, 0, 0);
      setSelectedDate(d);
    } else if (type === "month") {
      d.setMonth(d.getMonth() + 1);
      d.setDate(1);
      d.setHours(10, 0, 0, 0);
      setSelectedDate(d);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Calendar size={20} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Display Mode Toggle (Popover vs Inline) */}
            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setIsInline(false)}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  !isInline
                    ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Popover
              </button>
              <button
                type="button"
                onClick={() => setIsInline(true)}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  isInline
                    ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Inline
              </button>
            </div>

            {/* Engine Selector Pills */}
            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 text-[11px] font-semibold dark:border-zinc-800 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setEngine("sway")}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  engine === "sway"
                    ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Motion (Sway)
              </button>
              <button
                type="button"
                onClick={() => setEngine("davo")}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  engine === "davo"
                    ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                GSAP Flip (Davo)
              </button>
            </div>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
          DavoDatePicker
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Interactive calendar with fluid sliding month transitions, day selection, and integrated time wheel picker.
        </p>

        {/* Quick presets buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
            <Zap size={11} /> Shortcuts:
          </span>
          <button
            type="button"
            onClick={() => setPreset("now")}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setPreset("tomorrow")}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          >
            Tomorrow 09:00
          </button>
          <button
            type="button"
            onClick={() => setPreset("week")}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          >
            In 1 Week
          </button>
          <button
            type="button"
            onClick={() => setPreset("month")}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          >
            Next Month
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3 relative">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {isInline ? "Interactive Calendar View:" : "Pick Date & Time:"}
          </label>
          <button
            type="button"
            onClick={() => setShowTime(!showTime)}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <Clock size={12} />
            <span>{showTime ? "Hide Time" : "Include Time"}</span>
          </button>
        </div>

        <div className="relative">
          <DavoDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            showTime={showTime}
            inline={isInline}
            engine={engine}
          />
        </div>

        {selectedDate && (
          <div className="pt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Selected timestamp:{" "}
            <strong className="font-mono text-zinc-900 dark:text-white">
              {selectedDate.toLocaleString("es-AR")}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
