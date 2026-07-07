# Fase 3: Versión Gala Premium+

## Cambios integrados

### 1. Efectos de partículas avanzados
- Partículas con variantes visuales: puntos, destellos, líneas luminosas y mini birretes.
- Límite de partículas activas para evitar saturación del navegador.
- Menor densidad de partículas en móvil.
- Pausa automática cuando la pestaña queda en segundo plano.

### 2. Animación de birrete
- Se agregó un birrete SVG en el hero principal.
- El birrete se anima al abrir la invitación.
- También se activa una animación breve al confirmar asistencia.

### 3. Transiciones más elegantes
- Entrada suave de hero y secciones.
- Efecto premium de brillo sobre tarjetas tipo glass.
- Transiciones optimizadas con `transform` y `opacity`.
- Respeto a `prefers-reduced-motion` para accesibilidad.

### 4. Fondo dinámico mejorado
- Capas decorativas con orbes luminosos.
- Luces diagonales tipo gala.
- Fondo con movimiento lento y mejor profundidad visual.

### 5. Confirmación RSVP más profesional
- Se añadieron etiquetas visibles para los campos.
- Se integró un bloque de estado visual para confirmar o marcar errores.
- El campo de canción se conserva cerca del RSVP.
- El mensaje de WhatsApp incluye nombre, asistencia, dinámica, canción y mensaje.
- El botón muestra estado de carga breve al preparar WhatsApp.

### 6. Optimización de rendimiento
- `requestAnimationFrame` para transición del carrusel.
- `requestIdleCallback` para precarga ligera de imágenes.
- Control de timers para evitar intervalos duplicados.
- Pausa de partículas y carrusel cuando la pestaña no está visible.
- Imágenes conservan `loading="lazy"` y `decoding="async"`.

## Archivos modificados

- `index.html`
- `style.css`
- `script.js`

## Validaciones realizadas

- `script.js` validado con `node --check`.
- Balance de llaves CSS correcto.
- Revisión básica de estructura HTML sin etiquetas abiertas o cierres críticos pendientes.

## Nota importante sobre assets

Este paquete mantiene las rutas actuales:

- `assets/img/graduacion1.jpg`
- `assets/img/graduacion2.jpg`
- `assets/img/graduacion3.jpg`
- `assets/img/graduacion4.jpg`
- `assets/img/graduacion5.jpg`
- `assets/audio/graduacion.mp3`

Si tu repositorio de GitHub ya tiene esa carpeta `assets`, conserva esos archivos y reemplaza únicamente `index.html`, `style.css` y `script.js`.
