import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src"],
      exclude: ["src/demo", "src/main.tsx", "src/App.tsx"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(process.cwd(), "src/index.ts"),
      name: "GonzaUiComponents",
      cssFileName: "styles",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "motion",
        "motion/react",
        "gsap",
        "gsap/Flip",
        "gsap/CustomEase",
        "lucide-react",
        "clsx",
        "tailwind-merge",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          motion: "motion",
          "motion/react": "motionReact",
          gsap: "gsap",
          "gsap/Flip": "Flip",
          "gsap/CustomEase": "CustomEase",
          "lucide-react": "lucideReact",
          clsx: "clsx",
          "tailwind-merge": "tailwindMerge",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
