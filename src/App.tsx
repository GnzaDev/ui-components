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
    <div className="min-h-screen bg-zinc-50 transition-colors dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-100">
      {/* Header bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-white" />
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Sway & Davo
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
            / UI Components
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
            v1.0.0
          </span>
          <div className="hidden sm:block h-3.5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <button
            onClick={() => setDark(!dark)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* Main showcase */}
      <main className="w-full">
        <ShowcaseDemo />
      </main>
    </div>
  );
}

export default App;
