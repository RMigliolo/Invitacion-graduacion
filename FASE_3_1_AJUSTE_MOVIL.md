# Fase 3.1 - Ajuste móvil automático

Se corrigió la visualización en teléfonos celulares para evitar que la invitación aparezca descentrada o con desplazamiento horizontal.

## Cambios aplicados

- Se eliminó un `<section>` duplicado en el bloque de cuenta regresiva que podía generar anidamientos incorrectos de secciones.
- Se agregaron reglas globales para impedir overflow horizontal en `html`, `body`, fondo dinámico, partículas, hero, carrusel, mapa y tarjetas.
- Se centró el bloque principal del hero en celulares.
- Se ajustaron automáticamente título, descripción, fecha, botones, tarjetas y formulario al ancho real del teléfono.
- Se redujo el comportamiento de elementos decorativos que podían provocar ancho extra en Chrome móvil.
- Se mantuvo el diseño web y la versión Gala Premium+.
- Se conservó el campo de canción dentro del RSVP.
- Se cambió la opción afirmativa de asistencia a `Chi`.

## Archivos que debes sustituir

Copia estos archivos dentro de la carpeta de tu repositorio y reemplaza los existentes:

- `index.html`
- `style.css`
- `script.js`
- `FASE_3_1_AJUSTE_MOVIL.md`

No borres la carpeta `assets`.

## Commit sugerido

```bash
git add index.html style.css script.js FASE_3_1_AJUSTE_MOVIL.md
git commit -m "Corrige adaptación móvil y centrado de invitación"
git push
```
