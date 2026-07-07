# Auditoría técnica – Fase 2

## Archivos revisados
- `index.html`
- `style.css`
- `script.js`

## Resultado general
La invitación tiene una base visual sólida y el JavaScript original no presenta errores de sintaxis. Sin embargo, sí había puntos que podían provocar problemas en consola, comportamiento irregular en WhatsApp, consumo excesivo de recursos en móvil y detalles de compatibilidad/accesibilidad.

## Correcciones aplicadas

### HTML
- Se agregó `theme-color`.
- Se agregó `type="button"` a botones que no envían formularios.
- Se agregaron `aria-label` y `aria-pressed` al botón de audio.
- Se agregaron `aria-label` a flechas del carrusel.
- Se agregaron textos `alt`, `loading="lazy"` y `decoding="async"` a imágenes.
- Se agregó `title` y `referrerpolicy` al iframe de Google Maps.
- Se agregó `rel="noopener noreferrer"` al enlace externo de Google Maps.
- Se limpió el `<textarea>` para evitar espacios invisibles como mensaje.
- Se agregaron `name` y `autocomplete` a campos del formulario.
- Se agregó `defer` al script.

### CSS
- Se agregaron estados `:focus-visible` para navegación con teclado.
- Se mejoró compatibilidad con Safari usando `-webkit-backdrop-filter`.
- Se agregó fallback para navegadores sin `backdrop-filter`.
- Se ajustaron botones, carrusel, countdown, mapa, cards y formulario para móviles.
- Se agregó soporte para `prefers-reduced-motion`.
- Se ajustó `100svh` para mejorar el alto de pantalla en navegadores móviles.
- Se definió clase `.particle` para no depender de tantos estilos inline en JS.

### JavaScript
- Se encapsuló la inicialización en `DOMContentLoaded`.
- Se agregaron validaciones para evitar errores si falta algún elemento del DOM.
- Se corrigió el enlace de WhatsApp usando `encodeURIComponent` sobre el mensaje completo.
- Se ajustó el número de WhatsApp al formato internacional para México: `52 + número`.
- Se corrigió el riesgo de confeti infinito al llegar la fecha del evento.
- Se agregó swipe táctil al carrusel para celular.
- Se limpian/reinician intervalos al cambiar visibilidad de la pestaña.
- Se reducen partículas y confeti en móvil.
- Se respeta la configuración del usuario de reducir movimiento.
- Se agregó fallback si `IntersectionObserver` no está disponible.

## Validaciones realizadas
- `node --check script.js`: sin errores de sintaxis.
- Parseo CSS con `tinycss2`: sin errores estructurales.
- Revisión de estructura HTML: sin cierre faltante crítico detectado.

## Nota importante
El número de WhatsApp quedó como `525570737497`. Si el número no corresponde a México o necesitas usar otro destinatario, modifica la constante `WHATSAPP_NUMBER` en `script.js`.


## Actualización solicitada: campo de canción para la fiesta

Se agregó un recuadro dentro de la sección de confirmación de asistencia para concentrar los campos de escritura en una sola zona del sitio.

Cambios realizados:

- Se añadió el texto: “Canción que no debe faltar para la fiesta!”.
- Se agregó el campo `songSuggestion` para que el invitado escriba una canción.
- Se integró la canción sugerida al mensaje automático de WhatsApp.
- Se añadieron estilos responsivos para que el recuadro funcione correctamente en versión web y móvil.
- Se mantuvo el campo como opcional para no bloquear la confirmación.
