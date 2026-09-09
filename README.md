# @gonza/ui-components

Production-grade, dual-engine animated UI component library for React and Tailwind CSS. Combines **Sway Motion Euler-Newton springs** with **Davo GSAP FLIP theatrical dialogs** (based on [pretty-modal](https://github.com/srdavo/pretty-modal) by [srdavo](https://github.com/srdavo)) in a unified, typed architecture.

---

## 🚀 Instalación directa desde GitHub

Cualquier persona puede instalar esta librería en su proyecto React sin necesidad de que esté publicada en npm.

### Paso 1: Instalar la librería y sus dependencias peer

Ejecutá uno de los siguientes comandos en la raíz de tu proyecto:

```bash
# Con pnpm (recomendado)
pnpm add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge

# Con npm
npm install github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge

# Con yarn
yarn add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge

# Con bun
bun add github:GnzaDev/ui-components motion gsap lucide-react clsx tailwind-merge
```

> **¿Cómo funciona por detrás?** El gestor de paquetes clona el repositorio y ejecuta el ciclo `prepare` que compila automáticamente el bundle ESM, CJS y las definiciones de TypeScript (`dist/`) usando Vite en tu entorno local.

---

### Paso 2: Importar los estilos de animación

En el punto de entrada de tu aplicación (`main.tsx`, `App.tsx`, o `layout.tsx` en Next.js), importá el archivo CSS compilado:

```tsx
import "@gonza/ui-components/styles.css";
```

Este archivo contiene los keyframes de apertura, desenfoque cinemático, estados de backdrop blur para `<dialog>` y las animaciones de View Transition.

---

### Paso 3: Configurar Tailwind CSS (Si usás Tailwind v3 o v4)

Para que Tailwind procese las clases de utilidad de los componentes, asegurate de incluir la librería en tu configuración:

#### En Tailwind CSS v4 (`src/index.css` o `globals.css`):
```css
@import "tailwindcss";
@source "../node_modules/@gonza/ui-components";
```

#### En Tailwind CSS v3 (`tailwind.config.js` / `tailwind.config.ts`):
```ts
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

## ⚡ Reglas de los 2 Motores de Animación

| Motor | Física y Primitiva Central | Regla de Oro |
| :--- | :--- | :--- |
| **Sway** | `SwayModal`, `SwayCard`, `MorphTabs`<br>Euler-Newton Springs (`stiffness: 400`, `damping: 30`, `mass: 0.8`) | Si usás `layoutId`, el botón disparador (`SwayModalTrigger`) **SIEMPRE debe compartir el mismo `layoutId`** que el modal. Prohibido duplicar `scale` e `y` en el `initial`. |
| **Davo** | `DavoModal`, `DavoDatePicker`, `DavoActionSheet`<br>Elemento nativo `<dialog>` + GSAP FLIP (`duration: 0.7s`, `PRETTY_EASE`) | El diálogo nativo se ancla al nodo físico del botón mediante `triggerRef`. El cierre se delega al lifecycle del diálogo con backdrop cinemático. |
| **Dual** | `FamilyDialog`, `FamilyStepperDialog`, `MorphingStepDialog`<br>Soporta ambos motores | Seleccionable mediante la prop `engine="sway" \| "davo"` o `engine="spring" \| "view-transition"`. |

---

## 💻 Ejemplos prácticos de uso

### 1. Modal con Motor Sway (Resortes Motion y `layoutId`)

El modal se expande físicamente desde las coordenadas del botón:

```tsx
import { useState } from "react";
import { SwayModal, SwayModalTrigger } from "@gonza/ui-components";
import { Plus } from "lucide-react";

export function MiVistaSway() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* El botón disparador comparte el mismo layoutId */}
      <SwayModalTrigger
        layoutId="nuevo-proyecto-modal"
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
        <span>Crear Proyecto</span>
      </SwayModalTrigger>

      {/* El modal hereda la geometría del botón al expandirse */}
      <SwayModal
        open={open}
        onClose={() => setOpen(false)}
        layoutId="nuevo-proyecto-modal"
        title="Crear Proyecto"
        maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)}>Cancelar</button>
            <button className="bg-zinc-900 text-white px-4 py-2 rounded-xl">Guardar</button>
          </div>
        }
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Modal con física de resortes Euler-Newton calibrada.
        </p>
      </SwayModal>
    </div>
  );
}
```

---

### 2. Modal con Motor Davo (GSAP FLIP + `<dialog>` Nativo)
> **Crédito de autoría**: El motor FLIP y el servicio de animación provienen del repositorio público [pretty-modal](https://github.com/srdavo/pretty-modal) de [srdavo](https://github.com/srdavo).

Top-layer nativo del navegador con desenfoque de fondo y morphing teatral:

```tsx
import { useRef, useState } from "react";
import { DavoModal } from "@gonza/ui-components";

export function MiVistaDavo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      {/* Referencia al nodo DOM físico para el cálculo de matrices FLIP */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="rounded-xl bg-zinc-900 px-4 py-2 text-white font-medium"
      >
        Abrir Modal Davo
      </button>

      {/* Diálogo nativo HTML5 renderizado en el top-layer */}
      <DavoModal
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        title="Detalles de Cluster"
      >
        <div className="p-2 space-y-2">
          <p className="text-sm">Animación cinematográfica calculada con GSAP Flip y curva PRETTY_EASE.</p>
        </div>
      </DavoModal>
    </div>
  );
}
```

---

### 3. Diálogo de confirmación Dual-Engine (`FamilyDialog`)

El botón de acción se transforma en el propio diálogo con animación continua:

```tsx
import { useState } from "react";
import { FamilyDialog } from "@gonza/ui-components";

export function ConfirmacionEjemplo() {
  const [open, setOpen] = useState(false);

  return (
    <FamilyDialog
      open={open}
      onOpenChange={setOpen}
      title="Transferir Fondos"
      description="¿Estás seguro de que deseás transferir $2,500 al Vault?"
      actionLabel="Confirmar y Enviar"
      variant="mint"
      engine="spring" // o "view-transition"
      onConfirm={() => alert("¡Transferencia realizada!")}
    />
  );
}
```

---

### 4. Selector de Fecha FLIP (`DavoDatePicker`)

Morphing 1:1 entre el input de fecha y el calendario flotante:

```tsx
import { useState } from "react";
import { DavoDatePicker } from "@gonza/ui-components";

export function FechaEjemplo() {
  const [fecha, setFecha] = useState<Date | null>(new Date());

  return (
    <DavoDatePicker
      selected={fecha}
      onSelect={setFecha}
      placeholder="Seleccionar fecha"
    />
  );
}
```

---

## 📦 Lista de Componentes Exportados

- **Modales y Diálogos**: `SwayModal`, `SwayModalTrigger`, `DavoModal`, `FamilyDialog`, `FamilyStepperDialog`, `MorphingStepDialog`, `MorphingStepDialogTrigger`
- **Drawers y Sheets**: `SideSheet`, `DavoActionSheet`
- **Cards y Popovers**: `SwayCard`, `SwayPopover`, `DavoPopover`
- **Navegación y Controles**: `CommandPalette`, `MorphTabs`, `DavoDatePicker`, `SortableSpringList`
- **Acciones Flotantes y Feedback**: `MorphFab`, `FlipToast`, `FlipLightbox`, `FloatingActionBar`
- **Tokens y Hooks**: `SWAY_SPRINGS`, `SWAY_RADIUS`, `DAVO_TIMINGS`, `PRETTY_EASE`, `useScrollLock`, `lockBodyScroll`, `unlockBodyScroll`, `cn`

---

## 🛠️ Comandos útiles para desarrollo local

Si clonás este repositorio para agregar nuevos componentes o probar el showcase:

- `pnpm dev`: Inicia el servidor de desarrollo local con la demo completa (`http://localhost:5174`).
- `pnpm build:lib`: Compila la librería distribuible a la carpeta `dist/` (ESM + CJS + `.d.ts`).
- `pnpm build:app`: Compila la SPA estática del showcase.
- `pnpm typecheck`: Verifica que no haya ningún error de tipos en TypeScript.

---

## 📄 Licencia

MIT © Gonzalo
