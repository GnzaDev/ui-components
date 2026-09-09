# UI Components Showcase

Colección de componentes animados independientes para React y Tailwind CSS, listos para copiar y pegar o importar en tu portafolio / web de showcase.

---

## 📦 Componentes incluidos

1. **`GonzaModal`**: Modal elástico con morphing originado desde su botón trigger (`GonzaModal.Trigger`) utilizando resortes elásticos de **Motion** (`motion/react`), curvas de 32px y protección de recorte con `[isolation:isolate]`.
2. **`DavoModal`**: Modal morphing nativo basado en el elemento HTML `<dialog>` impulsado por **GSAP Flip** + **CustomEase**, con desenfoque cinematográfico y animación fluida al abrir y cerrar.
3. **`SideSheet`**: Drawer lateral flotante moderno con bordes redondeados (`rounded-[2.5rem]`), backdrop blur sutil y soporte para superponer modales internos.
4. **`GonzaCard`**: Card expandible interactiva que hace morphing fluido desde una tarjeta de feed / artículo hacia una vista de lectura modal completa con resortes de Motion.
5. **`DavoActionSheet`**: Bottom sheet / panel de acciones inferior estilo mobile con morphing cinemático impulsado por GSAP Flip sobre el elemento nativo `<dialog>`.
6. **`GonzaPopover`**: Menú flotante contextual con física de resortes, soporte para esquinas (`bottom-left`, `bottom-right`, `top-left`, etc.) y detección de click afuera.
7. **`CommandPalette`**: Buscador tipo Raycast/Linear (`Cmd+K` / `Ctrl+K`) con filtro difuso, categorías y navegación por teclado.
8. **`MorphTabs`**: Control segmentado de pestañas con píldora activa deslizante impulsada por `layoutId`.
9. **`MorphFab`**: Botón flotante de esquina (FAB) que hace morphing hacia un menú de acciones rápidas.
10. **`FlipToast`**: Sistema interactivo de notificaciones apilables con auto-descarte y salida suave.
11. **`FlipLightbox`**: Galería de imágenes con zoom cinemático por GSAP Flip directo a pantalla completa.
12. **`ShowcaseDemo`**: Showcase interactivo completo con pestañas de filtrado, primitivas centrales, casos de uso de producción y playground en vivo con matriz de esquinas.

---

## 🚀 Instalación de dependencias

En la web donde vayas a integrar estos componentes, ejecutá:

```bash
# Con pnpm
pnpm add motion lucide-react clsx tailwind-merge gsap

# O con npm
npm install motion lucide-react clsx tailwind-merge gsap
```

---

## 📁 Estructura de carpetas

```
ui-components/
├── README.md
├── package.json
└── src/
    ├── index.ts                 # Export central de toda la librería
    ├── utils/
    │   └── cn.ts                # Helper para mergear clases de Tailwind
    ├── GonzaModal/              # Modal elástico con Motion
    ├── DavoModal/               # Modal <dialog> con GSAP Flip
    ├── SideSheet/               # Drawer lateral flotante con Motion
    ├── GonzaCard/               # Card expandible con Motion layoutId
    ├── DavoActionSheet/         # Bottom action sheet con GSAP Flip
    ├── GonzaPopover/            # Popover flotante con resortes
    ├── CommandPalette/          # Buscador Cmd+K spotlight
    ├── MorphTabs/               # Segmented controls con píldora activa
    ├── MorphFab/                # FAB de esquina con morphing a toolbar
    ├── FlipToast/               # Toasts apilables con física de salida
    ├── FlipLightbox/            # Lightbox con zoom cinemático GSAP
    └── demo/
        ├── ShowcaseDemo.tsx     # Demo interactiva completa
        └── examples/            # 13 Casos de uso reales y playground
```

---

## 💻 Ejemplos de uso

### 1. `GonzaModal` (Motion Spring Morphing)

```tsx
import { useState } from "react";
import { GonzaModal, GonzaModalTrigger } from "./GonzaModal";
import { Plus } from "lucide-react";

export function MiVista() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 1. Botón con morphing y física de resorte */}
      <GonzaModalTrigger
        layoutId="mi-modal-id"
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
        <span>Abrir modal</span>
      </GonzaModalTrigger>

      {/* 2. El modal que se expande desde el botón */}
      <GonzaModal
        open={open}
        onClose={() => setOpen(false)}
        layoutId="mi-modal-id"
        title="Editar elemento"
        footer={
          <button onClick={() => setOpen(false)}>Listo</button>
        }
      >
        <p>Contenido con esquinas redondeadas y scroll limpio.</p>
      </GonzaModal>
    </>
  );
}
```

---

### 2. `DavoModal` (GSAP Flip)

```tsx
import { useRef, useState } from "react";
import { DavoModal } from "./DavoModal";

export function MiVistaDavo() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button ref={btnRef} onClick={() => setOpen(true)}>
        Abrir con Flip
      </button>

      <DavoModal
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={btnRef}
        title="Modal cinemático"
      >
        <p>Morphing fluido desde el botón usando GSAP Flip.</p>
      </DavoModal>
    </>
  );
}
```

---

### 3. `SideSheet` (Drawer lateral flotante)

```tsx
import { useState } from "react";
import { SideSheet } from "./SideSheet";

export function MiVistaSideSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Ver detalles</button>

      <SideSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Detalles del registro"
        maxWidth="max-w-2xl"
      >
        <p>Panel deslizante desde la derecha.</p>
      </SideSheet>
    </>
  );
}
```

---

### 4. Mostrar todo junto (`ShowcaseDemo`)

Para exhibirlos todos juntos en una sola página de tu web o portafolio:

```tsx
import { ShowcaseDemo } from "./demo/ShowcaseDemo";

export default function PaginaComponentes() {
  return <ShowcaseDemo />;
}
```
