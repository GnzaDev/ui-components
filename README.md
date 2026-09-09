# @gonza/ui-components

Production-grade, dual-engine animated UI components for React and Tailwind CSS. Combines **Sway Motion Euler-Newton springs** with **Davo GSAP FLIP theatrical dialogs** in a unified, typed architecture.

---

## 🚀 Installation

```bash
# Using pnpm
pnpm add @gonza/ui-components motion gsap lucide-react clsx tailwind-merge

# Using npm
npm install @gonza/ui-components motion gsap lucide-react clsx tailwind-merge

# Using yarn
yarn add @gonza/ui-components motion gsap lucide-react clsx tailwind-merge
```

### 🎨 Stylesheet Setup

Import the compiled animations stylesheet once in your application root (`main.tsx`, `App.tsx`, or `layout.tsx`):

```tsx
import "@gonza/ui-components/styles.css";
```

Ensure your Tailwind CSS configuration scans the package if you customize utility classes:

```ts
// tailwind.config.js or tailwind.config.ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@gonza/ui-components/**/*.{js,cjs,mjs}",
  ],
  // ...
};
```

---

## ⚡ Animation Engines & Rules

This library exposes two distinct physical models with predictable constraints:

| Engine | Primary Primitive | Physics / Math | Golden Rule |
| :--- | :--- | :--- | :--- |
| **Sway** | `SwayModal`, `SwayCard`, `MorphTabs` | Euler-Newton springs (`stiffness: 400`, `damping: 30`, `mass: 0.8`) | When using `layoutId`, trigger and target MUST share the identical `layoutId`. Never duplicate `scale` and `y` in `initial`. |
| **Davo** | `DavoModal`, `DavoDatePicker`, `FlipLightbox` | GSAP FLIP + `PRETTY_EASE` curve (`duration: 0.7s`) | Native `<dialog>` top-layer with physical DOM node origin passed via `triggerRef`. Close strictly through `prettyModalService.close()`. |
| **Dual** | `FamilyDialog`, `FamilyStepperDialog`, `MorphingStepDialog` | Motion Springs OR View Transitions / GSAP | Unified `engine?: "sway" \| "davo"` or `engine?: "spring" \| "view-transition"` prop. |

---

## 💻 Quickstart Examples

### 1. SwayModal (Motion Spring Morphing with `layoutId`)

```tsx
import { useState } from "react";
import { SwayModal, SwayModalTrigger } from "@gonza/ui-components";
import { Plus } from "lucide-react";

export function SwayExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button sharing the layoutId */}
      <SwayModalTrigger
        layoutId="create-project-modal"
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
        <span>Create Project</span>
      </SwayModalTrigger>

      {/* Modal expanding physically from the trigger */}
      <SwayModal
        open={open}
        onClose={() => setOpen(false)}
        layoutId="create-project-modal"
        title="New Project"
        footer={
          <button onClick={() => setOpen(false)}>Done</button>
        }
      >
        <p>Modal content with calibrated Euler-Newton spring physics.</p>
      </SwayModal>
    </>
  );
}
```

---

### 2. DavoModal (Native `<dialog>` + GSAP FLIP)

```tsx
import { useRef, useState } from "react";
import { DavoModal } from "@gonza/ui-components";

export function DavoExample() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* Physical DOM trigger ref */}
      <button ref={triggerRef} onClick={() => setOpen(true)}>
        Open Theatrical Modal
      </button>

      {/* Native HTML5 <dialog> with GSAP Flip morphing */}
      <DavoModal
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        title="Cinematic Modal"
      >
        <p>Native top-layer isolation with PRETTY_EASE and backdrop blur.</p>
      </DavoModal>
    </>
  );
}
```

---

### 3. FamilyDialog (Dual-Engine Morphing Confirmation)

```tsx
import { useState } from "react";
import { FamilyDialog } from "@gonza/ui-components";

export function FamilyExample() {
  const [open, setOpen] = useState(false);

  return (
    <FamilyDialog
      open={open}
      onOpenChange={setOpen}
      title="Transfer Assets"
      description="Are you sure you want to transfer $2,500 to Vault?"
      actionLabel="Send Transfer"
      variant="mint"
      engine="spring" // or "view-transition"
      onConfirm={() => console.log("Confirmed")}
    />
  );
}
```

---

### 4. DavoDatePicker (FLIP Morphing Calendar)

```tsx
import { useState } from "react";
import { DavoDatePicker } from "@gonza/ui-components";

export function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <DavoDatePicker
      selected={selectedDate}
      onSelect={setSelectedDate}
      placeholder="Select departure date"
    />
  );
}
```

---

## 📦 Exported Primitives

- **Modals & Dialogs**: `SwayModal`, `SwayModalTrigger`, `DavoModal`, `FamilyDialog`, `FamilyStepperDialog`, `MorphingStepDialog`
- **Drawers & Sheets**: `SideSheet`, `DavoActionSheet`
- **Cards & Popovers**: `SwayCard`, `SwayPopover`, `DavoPopover`
- **Controls & Navigation**: `CommandPalette`, `MorphTabs`, `DavoDatePicker`, `SortableSpringList`
- **Actions & Feedback**: `MorphFab`, `FlipToast`, `FlipLightbox`, `FloatingActionBar`
- **Animation Tokens & Utilities**: `SWAY_SPRINGS`, `SWAY_RADIUS`, `DAVO_TIMINGS`, `PRETTY_EASE`, `useScrollLock`, `lockBodyScroll`, `unlockBodyScroll`, `cn`

---

## 🛠️ Scripts in Repository

- `pnpm dev`: Start the interactive showcase documentation application (`http://localhost:5174`).
- `pnpm build:lib`: Compile the standalone installable npm package into `dist/` with ESM, CJS, `.d.ts` types, and `styles.css`.
- `pnpm build:app`: Build the static showcase web SPA.
- `pnpm typecheck`: Run strict TypeScript checks across the entire codebase.

---

## 📄 License

MIT © Gonzalo
