# Identidad digital y web
**Eneia Estudio · v1**

El código está en la carpeta `/web` del repositorio. Es una web estática (HTML, CSS y JavaScript sin dependencias) y está lista para publicarse **gratis**.

## 1. Arquitectura
Una sola página con anclas, más dos páginas auxiliares:

| Sección | Objetivo |
|---|---|
| Portada con visor (REC, 4K · 25P, GALICIA, código de tiempo en vivo) | Posicionamiento en 5 segundos y dos llamadas a la acción |
| Manifiesto (vídeo de 20 s, botón «Ver con sonido») | Demostrar la mirada sin necesidad de portafolio |
| Método (4 tiempos) | Reducir la incertidumbre del cliente |
| Formatos con precio «desde» | Filtrar contactos y transmitir claridad |
| Para quién (sectores) | Que el cliente se identifique |
| El estudio (Noe, Arya) | Humanizar la marca |
| Contacto (formulario) | Conversión |
| `legal.html` | Aviso legal, privacidad (RGPD) y cookies |
| `404.html` | Error «Fuera de plano» |

## 2. Experiencia de usuario y conversión
- **Llamada a la acción principal**, en rojo y siempre visible en la cabecera: «Hablemos».
- **Formulario breve:** 4 campos obligatorios. Valida en el propio navegador, marca los errores y los anuncia a los lectores de pantalla.
- **Bilingüe ES/GL:** el idioma se detecta automáticamente según el navegador y se puede cambiar con un botón. La preferencia se guarda solo en el navegador del visitante.
- **Vídeo:** se reproduce sin sonido solo cuando está en pantalla. La versión con audio se carga únicamente si el visitante la pide.

## 3. Diseño responsive y móvil
- Funciona desde 320 px de ancho, con menú desplegable en móvil y tipografía fluida (`clamp`).
- **Comprobado:** en iPhone 13 la página no tiene desplazamiento horizontal.

## 4. SEO básico
- Título y descripción con las palabras clave «fotos y vídeos publicitarios», «IA», «empresas» y «Galicia».
- `canonical`, Open Graph (con imagen `og.png` de 1200×630), `robots.txt`, `sitemap.xml` y datos estructurados JSON-LD (`ProfessionalService`, `areaServed: Galicia`).
- Encabezados jerárquicos (un único H1) y texto real, no imágenes de texto.
- **Pendiente** cuando haya dominio propio: sustituir `https://eneiaestudio.com/` en `index.html`, `robots.txt` y `sitemap.xml` y darlo de alta en Google Search Console.

## 5. Rendimiento
- Peso total de la portada inferior a 1 MB:
  - Fuentes en WOFF2 con subconjunto latino: 128 KB.
  - Vídeo de 380 KB sin audio.
  - SVG vectoriales para los logotipos.
- Sin frameworks ni rastreadores. La fuente principal se precarga y el vídeo usa `preload=metadata`.

## 6. Accesibilidad
- Enlace «Saltar al contenido», foco visible en rojo y botón de menú con `aria-expanded`.
- Mensajes del formulario anunciados con `aria-live`.
- Contraste AA en todos los textos.
- Respeta `prefers-reduced-motion`: sin animaciones ni código de tiempo en movimiento si el visitante lo tiene activado.

## 7. Seguridad (cabeceras en `vercel.json`)
- **Content-Security-Policy restrictiva:** solo recursos propios, más `formspree.io` para el formulario.
- Además: `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`.
- **Antispam:** campo trampa (*honeypot*) en el formulario.
- Sin cookies ni datos personales guardados en el servidor.

## 8. Formulario de contacto (gratuito)
1. **Modo actual, sin configurar:** al enviar, se abre el programa de correo del visitante con el mensaje ya redactado y dirigido a `CONTACT_EMAIL`.
2. **Modo recomendado:**
   - Crea una cuenta gratuita en https://formspree.io y un formulario nuevo.
   - Copia su URL y pégala en `web/assets/js/config.js` → `FORM_ENDPOINT`.
   - Los mensajes llegarán a tu correo sin servidor propio.
3. En `config.js`, cambia también `CONTACT_EMAIL` por el correo real del estudio.

## 9. Publicar gratis (Vercel)
1. Entra en https://vercel.com con tu cuenta de GitHub. Ya la usas para LS DESIGN.
2. Pulsa **Add New… → Project** e importa `noee34/Estudio-Nia-Audiovisual-`.
3. En **Root Directory**, elige `web`. En **Framework Preset**, elige `Other`. Pulsa **Deploy**.
4. La web quedará publicada en una dirección gratuita del tipo `https://estudio-nia-audiovisual.vercel.app`.
5. Cada cambio que se suba a la rama principal se publicará solo.
6. **Cuando compres el dominio:** en Vercel, ve a **Settings → Domains → Add** y escribe `eneiaestudio.com`. Copia los registros DNS que te indique en DonDominio.

## 10. Verificación realizada
| Prueba | Resultado |
|---|---|
| Carga sin errores de consola ni recursos 404 | ✔ |
| Envío vacío: marca 4 campos y muestra el mensaje de error | ✔ |
| Cambio de idioma ES → GL (`<html lang="gl">`, textos traducidos) | ✔ |
| Envío válido en modo correo (genera `mailto:` con asunto y cuerpo) | ✔ |
| Móvil (iPhone 13) sin desbordamiento horizontal y menú operativo | ✔ |
| `vercel.json` válido | ✔ |
