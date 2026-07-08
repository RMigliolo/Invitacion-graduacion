# Fase 3.3 - Stickers en dinámica y aviso importante

## Cambios realizados

1. Se agregó la cuarta opción de la dinámica: **Atrevido**.
2. La dinámica ahora contiene cuatro opciones:
   - Divertido
   - Fiestero
   - Aburrido
   - Atrevido
3. Se sustituyeron los emojis por stickers optimizados dentro de tarjetas responsivas:
   - `sticker-divertido.png` para Divertido.
   - `sticker-fiestero.png` para Fiestero.
   - `sticker-aburrido.png` para Aburrido.
   - `sticker-atrevido.png` para Atrevido.
4. Se agregó el sticker de aviso importante junto al bloque **Aviso Importante**.
5. Se ajustaron tamaños, proporciones, sombras y distribución visual para versión web y móvil.
6. Se mantuvo la estructura existente de la invitación y los ajustes móviles previos.
7. El mensaje de WhatsApp seguirá enviando la respuesta elegida en la dinámica, incluyendo ahora la opción **Atrevido**.

## Archivos modificados

- `index.html`
- `style.css`

## Archivos agregados

- `assets/stickers/sticker-divertido.png`
- `assets/stickers/sticker-fiestero.png`
- `assets/stickers/sticker-aburrido.png`
- `assets/stickers/sticker-atrevido.png`
- `assets/stickers/sticker-aviso.png`

## Comando sugerido para Git

```bash
git add index.html style.css assets/stickers FASE_3_3_STICKERS_DINAMICA.md COMMIT_PUSH.txt
git commit -m "Agrega stickers a dinamica y aviso importante"
git push
```
