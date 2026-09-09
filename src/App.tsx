import { useState, useEffect } from "react";
import { ShowcaseDemo } from "./demo/ShowcaseDemo";
import { Moon, Sun } from "lucide-react";

export function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors dark:bg-zinc-950">
      {/* Header bar */}
      <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-950">
            UI
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            @gonza/ui-components
          </span>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-xs hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
          aria-label="Cambiar tema"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Main showcase */}
      <main className="py-8">
        <ShowcaseDemo />
      </main>
    </div>
  );
}

export default App;
