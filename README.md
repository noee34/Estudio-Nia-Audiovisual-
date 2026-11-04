# Eneia Estudio · Estudio audiovisual

**Mirada de cine. Oficio de empresa.**

Marca completa de Eneia Estudio, un estudio de vídeo corporativo y publicidad en Galicia. El repositorio incluye la estrategia, el naming, la identidad visual, el manual, las aplicaciones, la web, los vídeos y la presentación comercial.

## Entregables principales
| Qué | Dónde |
|---|---|
| Manual de identidad (PDF, 23 págs.) | `MARCA/06_MANUAL_CORPORATIVO/ENEIA_manual-de-identidad_v1.pdf` |
| Presentación de empresa (PDF 16:9) | `MARCA/11_ENTREGABLES_FINALES/ENEIA_presentacion-empresa_v1.pdf` |
| Logotipos (SVG · PNG · PDF) | `MARCA/04_LOGOTIPOS/` |
| Vídeos de marca (ident y manifiesto, 16:9 y 9:16) | `MARCA/10_AUDIOVISUAL/video/` |
| Web funcional | `web/` |
| Estrategia, naming, plataforma de marca, marketing, web, guía audiovisual y auditoría (MD + PDF) | `MARCA/01…11` |

## Estructura
```
MARCA/
  01_ESTRATEGIA          estudio de mercado y dirección estratégica
  02_NAMING              proceso y comprobaciones del nombre
  03_BRANDING            plataforma de marca
  04_LOGOTIPOS           conceptos, svg/, png/, pdf/ (7 piezas × 6 variantes + favicon y avatar)
  05_IDENTIDAD_VISUAL    color/, tipografias/ (OFL), patrones/, iconos/
  06_MANUAL_CORPORATIVO  manual en PDF
  07_MOCKUPS             aplicaciones (PNG) y firma de correo (HTML)
  08_MARKETING           plan de marketing y lanzamiento
  09_WEB                 documentación y capturas de la web
  10_AUDIOVISUAL         vídeos, storyboard, guía y guiones
  11_ENTREGABLES_FINALES presentación y auditoría de calidad
web/                     sitio estático listo para Vercel o GitHub Pages
herramientas/            código que regenera todo el sistema
```

## Publicar la web gratis
En Vercel: **Add New → Project**, importa este repositorio y elige **Root Directory = `web`**. Los pasos completos están en `MARCA/09_WEB/ENEIA_web_v1.md`.

## Regenerar los archivos
Requisitos: Python 3 con `fonttools`, `uharfbuzz`, `shapely` y `markdown`; Node con Playwright; ffmpeg.
```
python3 herramientas/marca.py && node herramientas/exportar-logos.js   # logotipos
python3 herramientas/recursos.py                                       # paleta, patrones, iconos
node herramientas/video.js                                             # vídeos
node herramientas/mockups.js                                           # aplicaciones
python3 herramientas/documentos.py && node herramientas/pdf.js         # manual, presentación y PDF
```

## Pendiente de la propiedad
- Sustituir los datos de contacto y del titular legal: `web/assets/js/config.js`, `web/legal.html` y la firma de correo.
- Configurar Formspree para el formulario (gratis).
- Cuando el proyecto se valide: dominios eneiaestudio.com y .es, la cuenta @eneiaestudio y la marca mixta en la OEPM.
