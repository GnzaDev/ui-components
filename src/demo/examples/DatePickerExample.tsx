import { useState } from "react";
import { DavoDatePicker } from "../../DavoDatePicker";
import { Calendar, Clock } from "lucide-react";


export function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showTime, setShowTime] = useState(true);
  const [engine, setEngine] = useState<"gonza" | "davo">("gonza");

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Calendar size={20} />
          </div>

          {/* Engine Selector Pills */}
          <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 text-[11px] font-semibold dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setEngine("gonza")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                engine === "gonza"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Motion Spring
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
              GSAP Flip
            </button>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
          DavoDatePicker
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Interactive calendar with fluid sliding month transitions, day selection, and integrated time wheel picker.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            Dual Engine: {engine === "gonza" ? "Motion Springs" : "GSAP FLIP"}
          </span>
          <span>•</span>
          <span>Time Picker</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Pick Date & Time:
          </label>
          <button
            type="button"
            onClick={() => setShowTime(!showTime)}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <Clock size={12} />
            <span>{showTime ? "Ocultar hora" : "Incluir hora"}</span>
          </button>
        </div>

        <DavoDatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          showTime={showTime}
          engine={engine}
          className="w-full"
        />

        {selectedDate && (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-2.5 text-center text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
            Seleccionado: <strong className="text-zinc-900 dark:text-white">{selectedDate.toLocaleString("es-AR")}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
