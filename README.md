# @gonza/ui-components (Sway UI)

Librería de componentes UI animados para React 19 y Tailwind CSS, creada y desarrollada por **Gonza**.
Impulsada por el motor propio **Sway (Motion Euler-Newton springs)** para animaciones elásticas y componentes interactivos, con variantes de modales teatrales que toman como inspiración y referencia el estilo FLIP de [pretty-modal](https://github.com/srdavo/pretty-modal) de [srdavo](https://github.com/srdavo).

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

> 📦 **¿Querés usar o instalar únicamente el modal original de Davo?**  
> Si solo te interesa el modal original creado por Davo (pretty-modal) de forma independiente y sin los demás componentes de Sway UI, instalalo o clonalo directamente desde su repositorio oficial:
> ```bash
> pnpm add github:srdavo/pretty-modal
> # o clonar directamente su código fuente:
> git clone https://github.com/srdavo/pretty-modal.git
> ```

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

> ℹ️ **¿Sway UI usa GSAP? No.** Todos los componentes originales de **Sway UI están construidos al 100% con Motion (`motion/react`)**. **NO usan GSAP**. La dependencia de GSAP (`gsap/Flip`, `gsap/CustomEase`) se utiliza única y exclusivamente dentro del módulo adaptado de Davo (`DavoModal` / `pretty-modal`), incorporado con fines comparativos y de referencia técnica.

| Motor | Física y Primitiva Central | Regla de Oro |
| :--- | :--- | :--- |
| **Sway (Gonza)** | `SwayModal`, `SwayCard`, `MorphTabs`, `SideSheet`<br>Euler-Newton Springs con **Motion** (`stiffness: 400`, `damping: 30`, `mass: 0.8`). **Cero GSAP.** | Si usás `layoutId`, el botón disparador (`SwayModalTrigger`) **SIEMPRE debe compartir el mismo `layoutId`** que el modal. Prohibido duplicar `scale` e `y` en el `initial`. |
| **Davo (Referencia)** | `DavoModal`, `DavoDatePicker`, `DavoActionSheet`<br>Elemento nativo `<dialog>` + GSAP FLIP (`duration: 0.7s`, `PRETTY_EASE`) | El diálogo nativo se ancla al nodo físico del botón mediante `triggerRef`. Inspirado en `srdavo/pretty-modal`. |
| **Family (Morph)** | `FamilyDialog`, `FamilyStepperDialog`<br>Inspirado en **Family.co** y **Emil Kowalski** | Morphing botón-a-diálogo con **View Transition API** o resortes **Motion**. **No es de Davo ni usa GSAP.** |
| **Dual / Benchmark** | `MorphingStepDialog`, `ProfileModal`, `ConfirmDialog`<br>Comparativa interactiva | Permite conmutar en vivo entre el motor Sway (Motion) y el motor Davo (GSAP FLIP) para evaluar su comportamiento. |

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
> **Crédito de autoría**: El motor FLIP y el servicio de animación provienen del repositorio público [pretty-modal](https://github.com/srdavo/pretty-modal) de [srdavo](https://github.com/srdavo). Para instalar únicamente su implementación original de forma aislada, utilizá su repositorio: `github:srdavo/pretty-modal`.

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
> **Inspiración de diseño**: Este componente está inspirado en el patrón de interacción de la app **[Family](https://family.co)** y las técnicas de morphing compartidas por **[Emil Kowalski](https://emilkowal.ski)** (*Animations on the Web*). **No es de Davo ni usa GSAP**: funciona con la View Transition API (`document.startViewTransition`) o físicas de resortes con Motion (`layoutId`).

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
