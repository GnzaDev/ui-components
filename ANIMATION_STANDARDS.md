# Estándar de Animaciones: Gonza Engine vs Davo Engine

Este documento establece la especificación técnica, las constantes de física, las reglas de arquitectura y los errores prohibidos para los dos motores de animación de `@gonza/ui-components`.

---

## 🟠 1. Gonza Engine (Motion Spring Physics & Layout Projection)

### Filosofía
- **Física Newtoniana Real**: Basado en masas, resortes y amortiguación (`stiffness`, `damping`, `mass`).
- **Preservación de Momentum**: Las interrupciones gestuales y cambios de estado no cortan curvas, conservan la velocidad residual.
- **Layout Projection**: Morphing continuo entre la posición/tamaño del botón trigger y el modal mediante `layoutId`.

### Parámetros Canónicos (Tokens de Resortes)

| Tipo de Componente | `stiffness` | `damping` | `mass` | Uso |
|---|---|---|---|---|
| **Modal / Dialog** | `400` | `30` | `0.8` | `GonzaModal`, `MorphingStepDialog` |
| **Drawer / SideSheet** | `350` | `32` | `1.0` | `SideSheet` |
| **Popover / Dropdown** | `450` | `28` | `0.8` | `GonzaPopover`, `DavoDatePicker` |
| **Pills / Tabs** | `500` | `35` | `0.7` | `MorphTabs` |
| **Step Carousel / Slider** | `350` | `32` | `0.8` | `MorphingStepDialog` (Track) |
| **Sortable / Drag List** | `450` | `35` | `1.0` | `SortableSpringList` |
| **Floating Action Bar** | `450` | `30` | `0.8` | `FloatingActionBar` |

### Reglas Críticas de Implementación (OBLIGATORIAS)

1. **La regla de oro de `layoutId`**:
   - Si el modal usa `layoutId="mi-id"`, el botón disparador **DEBE** ser un componente Motion (ej: `<GonzaModalTrigger>` o `<motion.button layoutId="mi-id">`) con el **MISMO `layoutId`**.
   - **NUNCA** pongas un `layoutId` en un modal si el trigger es un `<button>` HTML común, porque Motion buscará el snapshot del trigger, no lo encontrará y cancelará la animación de entrada y salida en seco.

2. **Prohibido duplicar `scale` e `y` con `layoutId`**:
   ```tsx
   // ❌ ERROR GRAVE: Colisiona con el delta de layoutId
   <motion.div
     layoutId="modal-id"
     initial={{ opacity: 0, scale: 0.9, y: 16 }}
     animate={{ opacity: 1, scale: 1, y: 0 }}
   />

   // ✅ FORMA CORRECTA: Si hay layoutId, Motion se encarga de escala y posición
   <motion.div
     layoutId={layoutId}
     layout
     transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
     initial={layoutId ? undefined : { opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }}
     animate={layoutId ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
     exit={layoutId ? { opacity: 0, filter: "blur(6px)", transition: { duration: 0.2 } } : { opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }}
   />
   ```

3. **Interpolación de Curvatura (`borderRadius`)**:
   - Trigger: `style={{ borderRadius: 16 }}`
   - Modal: `style={{ borderRadius: 24 }}` (o `32`)
   - Motion necesita el valor numérico en el atributo `style` para hacer la transición fluida del radio de esquinas durante el morphing.

4. **Montaje de `AnimatePresence`**:
   - `createPortal` debe envolver a `<AnimatePresence>{open && ...}</AnimatePresence>`. Si desmontás `AnimatePresence` junto con el booleano `open`, las animaciones de salida (`exit`) **NUNCA** se disparan.

---

## 🟣 2. Davo Engine (GSAP FLIP Matrix Projection)

### Filosofía
- **Matemática Matricial FLIP**: First-Last-Invert-Play directo sobre el DOM.
- **Diálogo Nativo HTML5**: Opera sobre `<dialog class="pretty-modal-dialog">` proyectando las coordenadas exactas del botón disparador (`origin`).
- **Filtros Ópticos y Bloom**: Transición cinematográfica con desenfoque (`blur`), contracción de radio a círculo (`borderRadius: 400px`) y desvanecimiento de backdrop.

### Parámetros Canónicos

- **Curva Bézier de Davo (`PRETTY_EASE`)**:
  ```ts
  export const PRETTY_EASE = "M0,0 C0.305,0.206 0.116,0.567 0.3,0.8 0.394,0.921 0.491,1 1,1";
  ```
- **Duración de apertura**: `0.7s` (para modales) / `0.6s` (para elementos/popovers)
- **Duración de cierre**: `0.7s` (para modales) / `0.5s` (para elementos/popovers)
- **Scale**: `scale: true` en la configuración de Flip.
- **Toggle Classes**:
  - Apertura: `pretty-modal-opening` (blur 8px ➔ 0px en 500ms)
  - Cierre: `pretty-modal-closing` (blur 0px ➔ 32px + borderRadius 400px en 500ms/700ms)

### Reglas Críticas de Implementación (OBLIGATORIAS)

1. **Permanencia en el DOM**:
   - A diferencia de Motion que monta/desmonta con `AnimatePresence`, el `<dialog>` de Davo **DEBE estar siempre montado en el DOM**.
   - El navegador oculta nativamente el `<dialog>` cuando `dialog.open` es falso. GSAP Flip necesita que el elemento exista para calcular las coordenadas iniciales de `origin`.

2. **Trigger por Referencia (`triggerRef`)**:
   - Davo requiere la referencia física al nodo HTML disparador:
     ```tsx
     const triggerRef = useRef<HTMLButtonElement>(null);
     <button ref={triggerRef} onClick={() => setOpen(true)} />
     ```
   - El servicio obtiene el rectángulo inicial con `Flip.getState(origin)` y proyecta el diálogo desde allí.

3. **Ciclo de Vida de Cierre y Limpieza**:
   - Al cerrar con Davo, **NUNCA** pongas `setOpen(false)` de forma inmediata.
   - Tenés que llamar a `prettyModalService.close(dialog, onClosed)` y recién en el callback `onClosed` ejecutar `onClose()` y limpiar los atributos inline (`dialog.setAttribute("style", "")`).

4. **Para elementos no `<dialog>` (Popovers / Toolbars)**:
   - Usar `prettyModalService.openElement(target, origin)` y `prettyModalService.closeElement(target, origin, onClosed)`.

---

## 📋 Resumen Rápido: ¿Cómo pedir un componente?

| Frase que me digas | Lo que significa para el código |
|---|---|
| *"Hacelo con parámetros de Gonza"* | Usa `motion/react`, resortes `stiffness: 400, damping: 30`, trigger con `layoutId` idéntico al modal, y `AnimatePresence` persistente. |
| *"Hacelo con parámetros de Davo"* | Usa `<dialog class="pretty-modal-dialog">`, GSAP Flip, `prettyModalService.open/close`, `triggerRef` en el botón y curva `PRETTY_EASE`. |
| *"Hacelo Dual-Engine"* | El componente acepta prop `engine?: "gonza" | "davo"` y `triggerRef`. Soporta ambos comportamientos limpiamente con selector en vivo. |
