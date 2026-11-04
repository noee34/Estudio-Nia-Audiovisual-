# Anuncio de automoción con IA
**Guía de producción paso a paso · Eneia Estudio · v1 · noviembre 2026**

Es un anuncio original de 15–20 s, en 9:16 y 16:9, para un taller de reprogramación de centralitas, hecho a partir de fotos y vídeos reales de sus coches.

> **Estado de las comprobaciones.** Desde este entorno no se pudieron abrir higgsfield.ai ni YouTube: la red bloquea ambos dominios.
> - Lo que sigue se ha contrastado con la documentación oficial de Higgsfield indexada en buscadores (Help Center, blog y docs), además de guías de terceros.
> - Los nombres de botones marcados con **[comprobar]** y los precios de terceros pueden haber cambiado. Confírmalos en pantalla antes de pagar.
> - No se ha podido ver el vídeo de referencia (`youtu.be/ka9cwRkP4uY`). Por eso el desglose de la FASE 2 es una plantilla que se completa viéndolo, y las escenas de la FASE 5 son una propuesta original de estética automovilística de gama alta.

---

## 1. Herramientas
| Uso | Herramienta | Por qué |
|---|---|---|
| Animar fotos de los coches (imagen a vídeo) | **Higgsfield → Create Video** con **Kling 3.0** (o el Kling más reciente disponible) | Admite foto inicial y final (*start/end frame*) y tiene buen control de cámara. Es la vía más fiel cuando solo hay fotos. |
| Cambiar entorno o estilo de un clip real **sin tocar el coche** | **Higgsfield Genjutsu**, modo **Object Swap** | Cambia solo lo que se selecciona (fondo, cielo, asfalto mojado) y mantiene el resto del plano. |
| Copiar el movimiento de un clip propio a otra escena | **Higgsfield Genjutsu**, modo **Motion Transfer** | Conserva el movimiento del clip y reconstruye lo demás con las fotos de referencia. Úsalo con clips **propios**. |
| Retocar el estilo de un clip completo | **Higgsfield Video to Video** | Cambio de *look* a partir de un prompt. Solo para pruebas de estilo, no para los coches. |
| Automatizar ediciones desde Claude | **Katana** (opcional) | Necesita plan de pago y conectar Higgsfield a Claude. No aporta nada imprescindible en este proyecto. |
| Montaje, música, textos y exportación | **CapCut** (escritorio o móvil) | Gratuito, en español, con plantillas 9:16 y 16:9 y exportación 1080p. |

**Alternativa mejor en un punto: grabar.** Para la **fidelidad absoluta** de los coches (color, llantas OZ, proporciones), lo más fiable es **grabar 6–8 clips reales con el iPhone** y usar la IA solo para entorno, luz y efectos con Genjutsu Object Swap. La imagen-a-vídeo a partir de fotos puede alterar detalles (radios de las llantas, logotipos, pilotos). Recomendación: **combinar las dos vías**. Lo que haya en vídeo real, se mejora con IA; lo que no se pueda grabar, se genera desde la foto.

## 2. Enlaces
- Higgsfield: https://higgsfield.ai/
- Genjutsu (producto): https://higgsfield.ai/genjutsu
- Genjutsu (ayuda oficial): https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-genjutsu
- Video to Video: https://higgsfield.ai/video-to-video
- Image to Video: https://higgsfield.ai/image-to-video-ai
- Katana (ayuda oficial): https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-use-katana
- Guía oficial de Kling con foto inicial y final: https://higgsfield.ai/blog/A-Guide-to-Kling-Turbo-Start-End-Frame
- Guía oficial de prompts de Kling 3.0/4.0: https://higgsfield.ai/blog/Kling-3.0-is-on-Higgsfield-User-Guide-AI-Video-Generation
- Precios: https://higgsfield.ai/pricing
- CapCut: https://www.capcut.com/

## 3. Archivos necesarios
- **Fotos de cada coche:** 12 por coche, descritas en el apartado 5.
- **Vídeos reales con iPhone (recomendado):** 6–8 clips de 5–10 s, descritos en el apartado 5.
- **Fotos del servicio:** el portátil o equipo de reprogramación conectado a la toma OBD, el vano motor y el banco de potencia si lo hay.
- **Identidad del taller:**
  - Logotipo en PNG transparente o SVG.
  - Nombre, teléfono, web o Instagram.
  - Colores corporativos.
- **Música con licencia comercial:** ver el apartado 8.

## 4. Vídeo de referencia (FASE 1 y 2)
### 4.1 ¿Se puede pegar la URL de YouTube en Higgsfield?
**No.** Según la ayuda oficial, Genjutsu trabaja con **un clip subido** de **4 a 30 segundos** (o con uno de su *Motion Library*). Ninguna fuente oficial menciona que acepte enlaces de YouTube.

### 4.2 ¿Se puede descargar el anuncio de YouTube y subirlo?
- **No lo recomiendo.** Las condiciones de YouTube no permiten descargar vídeos fuera de sus funciones oficiales, salvo que el titular lo autorice.
- La propia ayuda de Higgsfield (Katana) pide **usar solo referencias propias o con permiso**.
- Además, transferir el movimiento del anuncio de otra marca a un anuncio comercial puede considerarse obra derivada.

**Vía autorizada:**
- **(a)** usar el anuncio **solo como referencia visual**, viéndolo y tomando notas (4.3);
- **(b)** si queréis subirlo, pedir permiso por escrito al titular del canal;
- **(c)** como fuente de movimiento, usar **vuestros propios clips** o el *Motion Library* de Higgsfield.

### 4.3 Analizar el anuncio sin descargarlo
**En el ordenador:**
1. Abre el enlace en YouTube. En ⚙️ elige **Calidad 1080p**.
2. Usa las teclas **,** y **.** (con el vídeo en pausa) para avanzar fotograma a fotograma, y **K** para pausar.
3. Anota cada cambio de plano en la tabla de abajo. Las capturas de pantalla, para uso interno de análisis, ayudan a montar el *moodboard*.

**En el iPhone:**
1. Abre el vídeo en la app de YouTube.
2. Toca dos veces a los lados para saltar 10 s, o arrastra la barra con el dedo para ir plano a plano.
3. Anota los planos en la app Notas.

**Plantilla de desglose (rellenar al verlo):**
| # | Inicio–fin (s) | Tipo de plano (general, medio, detalle, macro) | Movimiento (fijo, *push-in*, *travelling*, órbita, dron, cámara car) | Luz (día, noche, nave, contraluz) | Transición (corte, *whip*, *flash*, fundido) | Qué equivale en nuestro anuncio |
|---|---|---|---|---|---|---|
| 1 | | | | | | |

**Qué medir:**
- **Duración media de los planos.** En los anuncios de automoción suele estar entre 0,5 y 1,5 s.
- **Golpes de música.** Dónde cae cada corte.
- **Momento del logotipo.**
- **Proporción de planos de detalle frente a dinámicos.**

## 5. Fotos y vídeos propios (FASE 3)
### 5.1 Fotos (por coche: 12)
**Condiciones:**
- Coche **limpio** y sin matrícula visible: tapada o difuminada.
- Al **atardecer** o en día nublado, con un fondo despejado: nave, polígono vacío o explanada.
- iPhone en **modo Foto 1×**, sin el 0,5× (deforma la carrocería), en **HEIF Máxima o JPG**, sin filtros.
- Cámara a la **altura de los faros**, salvo que se indique otra cosa.

| N.º | Foto | Para qué escena |
|---|---|---|
| 01 | Frontal completa | Presentación |
| 02 | 3/4 frontal izquierda | Presentación y dinámicas |
| 03 | 3/4 frontal derecha | Presentación |
| 04 | Lateral completo izquierdo | *Travelling* y conducción |
| 05 | 3/4 trasera izquierda | Aceleración |
| 06 | Trasera completa | Aceleración |
| 07 | Llanta delantera, de cerca y perpendicular | Llantas |
| 08 | Llanta trasera, de cerca y perpendicular | Llantas |
| 09 | Faro delantero (encendido, si es posible) | Apertura |
| 10 | Piloto trasero encendido | Aceleración |
| 11 | Vano motor abierto | Mecánica |
| 12 | Interior: volante y cuadro | Conducción |

**Servicio (3 fotos):**
- **S1:** portátil con el software de reprogramación abierto (sin datos de clientes).
- **S2:** el cable conectado a la toma OBD.
- **S3:** banco de potencia o gráfica de potencia, si existe.

### 5.2 Vídeos con iPhone (recomendado, 6–8 clips)
**Ajustes:** **Ajustes → Cámara → Grabar vídeo → 4K a 25 fps** (o 30). Actívalo también en «Formatos → Más compatible» (H.264) y bloquea la exposición manteniendo el dedo pulsado sobre el coche.

**Clips:**
1. **Travelling lateral:** caminando junto al coche parado, a la altura de las llantas, 8 s.
2. **Órbita lenta:** alrededor del frontal, 10 s.
3. **Llanta en macro:** desplazamiento lateral muy lento, 6 s.
4. **Coche en marcha:** el coche pasa por delante a 20–30 km/h en un lugar privado o sin tráfico y la cámara lo sigue (*paneo*), 6 s.
5. **Arrancada desde atrás:** trípode en el suelo, con seguridad, 6 s.
6. **Portátil y OBD:** *push-in* lento hacia la pantalla, 6 s.

### 5.3 Preparar e identificar los archivos
- **Nombres:** renombra cada archivo así: `XSARA-ROJO_02_3-4-frontal-izq.jpg`, `206-NEGRO_07_llanta-del.jpg`, `SERVICIO_S1_portatil.jpg`.
- **Carpetas:** una por coche, en el ordenador o en iCloud. **Nunca subas fotos de dos coches distintos en la misma generación.**
- **Encuadre:** recorta en 9:16 una copia de las fotos 02, 04, 05 y 09 (Fotos → Editar → Recortar → 9:16), dejando el coche entero y aire alrededor.
- **Cuántas subir por generación:** en imagen a vídeo, **1 foto inicial** (y opcionalmente 1 final del mismo coche). En Genjutsu, **3–6 fotos de referencia del mismo coche**: la ayuda oficial admite hasta 30 y basta 1 para cambios simples.

## 6. Procedimiento exacto en Higgsfield (FASE 4)
### 6.0 Cuenta y plan
1. Entra en https://higgsfield.ai/ → **Sign up**. Puedes registrarte con Google.
2. Haz primero una prueba en el plan gratuito, si está disponible. **Según guías de terceros, las generaciones gratuitas llevan marca de agua**, así que para el anuncio final hace falta plan de pago (precios en el apartado 10).

### 6.1 Imagen a vídeo (escenas desde foto)
1. Menú **Video → Create Video** (ruta indicada en la ayuda oficial).
2. En el **selector de modelo** (*Model picker*), elige **Kling 3.0** o el Kling más reciente. Si quieres más realismo de cine y la escena solo necesita foto inicial, prueba **Veo 3.1**.
3. Sube la **foto inicial** (*Start frame*) **[comprobar]**: la foto del coche que indica la escena.
4. Si la escena lo pide, sube la **foto final** (*End frame*) **[comprobar]**, del **mismo coche**.
5. Ajustes:
   - **Duración:** 5 s.
   - **Formato:** **9:16** (genera después otra versión en 16:9 o recorta en el montaje).
   - **Calidad:** **1080p** para las tomas finales; **720p** para las pruebas (gasta menos créditos).
6. Pega el **prompt de la escena** (apartado 7).
7. Pulsa **Generate** **[comprobar]**. Genera **2–3 variantes** y quédate con la más fiel.
8. Descarga el clip (icono de descarga) y renómbralo `E03_206_v1.mp4`.

### 6.2 Genjutsu Object Swap (clips reales grabados)
1. **Video → Create Video** → selector de modelo → **Higgsfield Genjutsu**.
2. Modo **Objects swap** (nombre según la ayuda oficial).
3. Sube el clip propio (**4–30 s**).
4. Añade como referencias **3–6 fotos del mismo coche** (02, 04, 07…).
5. En el texto, describe **una sola cosa que cambia**. Ejemplo: «Replace only the background with an empty concrete industrial hall at night with cinematic rim lights. Do not change the car.»
6. En **Quality**, elige 720p para la prueba y 1080p para el final. Pulsa **Generate**.

### 6.3 Genjutsu Motion Transfer (opcional)
Sirve para aplicar el movimiento de un clip propio (por ejemplo, la órbita del Xsara) al 206.
1. Selecciona **Higgsfield Genjutsu** y el modo **Motion transfer**.
2. Sube el clip con el movimiento.
3. Añade las referencias del **otro coche**: 5–10 fotos de todos los ángulos.
4. Pulsa **Generate**.

**Aviso:** Motion Transfer reconstruye todo menos el movimiento. Es más arriesgado para la fidelidad, así que revísalo plano a plano.

### 6.4 Si la IA cambia el coche
1. **Rechaza el clip.** No lo arregles en el montaje.
2. Añade al prompt la frase de fidelidad (7.0) y **reduce el movimiento**: *slow*, *subtle*.
3. Usa una **foto más cercana al encuadre final** y, si el modelo lo permite, **la misma foto como inicial y final**.
4. Acorta a **5 s**. Los fallos aparecen sobre todo al final del clip.
5. Si persiste: **graba ese plano con el iPhone** y aplica Object Swap (6.2).
6. **Control final (siempre):**
   - Color de la carrocería.
   - Número y forma de los radios de las llantas.
   - Faros y pilotos.
   - Proporciones.
   - Ningún logotipo ni texto inventado.

## 7. Prompts de cada escena (FASE 5)
Los prompts van en inglés porque los modelos responden mejor en ese idioma. Copia el bloque entero.

### 7.0 Frase de fidelidad (ya incluida en cada prompt)
`Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.`

### Guion (18 s, 9:16)
| # | s | Escena | Foto o clip de origen |
|---|---|---|---|
| E01 | 0,0–1,2 | Faro del Xsara se enciende en la oscuridad | XSARA 09 |
| E02 | 1,2–2,6 | Llanta OZ blanca en macro, luz rasante | XSARA 07 |
| E03 | 2,6–4,2 | Peugeot 206 negro, 3/4 frontal, *push-in* en una nave | 206 02 |
| E04 | 4,2–5,4 | Llanta plateada del 206, reflejo que barre | 206 07 |
| E05 | 5,4–7,0 | Vano motor, macro, polvo en suspensión a contraluz | XSARA 11 o 206 11 |
| E06 | 7,0–8,8 | Portátil conectado al OBD, gráfica de potencia en pantalla | SERVICIO S1/S2 |
| E07 | 8,8–10,8 | Xsara rojo en carretera, *tracking* lateral | XSARA 04 o clip 4 |
| E08 | 10,8–12,4 | 206 acelera, cámara baja trasera | 206 05/06 o clip 5 |
| E09 | 12,4–14,2 | Los dos coches juntos, plano general nocturno | Composición de 02 + 02 (ver nota) |
| E10 | 14,2–18,0 | Cierre: logotipo del taller y llamada a la acción | Montaje en CapCut |

**E01 · Faro**
```
Cinematic automotive commercial, extreme close-up of the headlight of the car in the reference photo, total darkness, the headlight slowly turns on and a soft beam cuts through light haze, subtle slow push-in, anamorphic lens flare, deep blacks, premium car advert look, shot on cinema camera, 24fps. Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.
```

**E02 · Llanta OZ blanca**
```
Macro shot of the white multi-spoke wheel of the red car in the reference photo, very slow lateral camera slide, low raking golden light revealing texture, shallow depth of field, dust particles in the air, high-end car commercial, realistic reflections. Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.
```

**E03 · Peugeot 206 negro, presentación**
```
Three-quarter front view of the black hatchback from the reference photo parked in an empty dark concrete industrial hall, cinematic rim lighting outlining the bodywork, wet floor reflections, slow dolly push-in, moody premium automotive commercial, photorealistic. Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.
```

**E04 · Llanta plateada**
```
Close-up of the silver wheel of the black car in the reference photo, a strip of light sweeps slowly across the rim and tyre, static camera, high contrast, crisp metallic reflections, luxury car advert style, photorealistic. Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.
```

**E05 · Mecánica**
```
Macro shot inside the engine bay from the reference photo, slow crane movement across the engine cover and components, backlight with fine dust in the air, warm workshop light, shallow depth of field, precise and technical mood, photorealistic automotive commercial. Keep every component exactly as in the reference photo, do not add parts, no text, no logos.
```

**E06 · Reprogramación de centralitas**
```
Close-up of a laptop connected by cable to the car's OBD port as in the reference photo, slow push-in towards the screen showing a smooth rising power and torque curve, dark workshop, screen glow on the technician's hands, clean high-tech atmosphere, realistic, premium automotive commercial. No readable brand names, no real customer data, no text other than the graph.
```

**E07 · Conducción dinámica (Xsara)**
```
Tracking shot alongside the red car from the reference photo driving on an empty coastal road at sunset, camera car at wheel height moving in parallel, motion blur on the road and background, wheels spinning realistically, cinematic automotive commercial, photorealistic. Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.
```

**E08 · Aceleración (206)**
```
Low rear three-quarter shot of the black car from the reference photo accelerating away on an empty road at dusk, tail lights glowing, slight camera shake, heat haze behind the exhaust, powerful and fast mood, cinematic car commercial, photorealistic. Keep the car exactly as in the reference photo: identical paint color, identical wheels and spoke design, identical body shape, lights and proportions. No modifications, no body kit, no new badges, no text, no license plate.
```

**E09 · Los dos coches**
```
Wide cinematic shot of two cars parked side by side in an empty industrial hall at night, the red car on the left and the black car on the right exactly as in the reference photos, slow push-in, rim lights, wet floor reflections, premium automotive commercial, photorealistic. Keep both cars exactly as in their reference photos: identical paint colors, identical wheels, identical body shapes. No modifications, no text, no license plates.
```
*Nota E09:* mezclar dos coches en una sola generación es la escena más difícil. Si cambia algún detalle, **sustitúyela** por un corte rápido: Xsara (E03 en rojo) → 206, a 0,7 s cada uno.

**E10 · Cierre (se hace en CapCut, sin IA)**
- Fondo negro, logotipo del taller en el centro y debajo «REPROGRAMACIÓN DE CENTRALITAS».
- En la segunda línea: «Más potencia. Más precisión.»
- Teléfono, Instagram o web, y la mención «Imágenes creadas con IA», que exige el AI Act (art. 50) cuando el contenido pueda parecer real.

> **Aviso legal del copy:** no anunciéis la anulación del FAP, la EGR o el AdBlue ni la supresión de sistemas anticontaminación: es ilegal en vías públicas. Si el aumento de potencia requiere legalización (reforma) o ITV, indicadlo o hablad de «optimización».

## 8. Montaje (FASE 6) con CapCut
1. Descarga CapCut en https://www.capcut.com/ (escritorio o App Store) e inicia sesión.
2. **Nuevo proyecto** → importa los clips E01–E09 **en orden**.
3. Formato: **Relación de aspecto 9:16** **[comprobar]**.
4. **Duración de los planos:** recorta cada clip a lo indicado en la tabla (1,2–2 s). Quédate con la parte central del clip, que es la más estable.
5. **Música:**
   - Importa una pista **con licencia comercial**. Valen bibliotecas como Artlist o Epidemic Sound (comprueba el precio vigente) o una pista creada para el taller. La música de TikTok o Instagram **no** sirve para anuncios pagados.
   - Coloca los cortes sobre los golpes de la música: en CapCut, **Beats / Ritmo** marca los tiempos **[comprobar]**.
6. **Transiciones:** sobre todo corte seco. Algunas excepciones:
   - Un *flash* blanco de 2 fotogramas entre E06 y E07 (el «momento de potencia»).
   - Un *whip pan* entre E07 y E08.
   - Fundido a negro antes de E10.
7. **Color:** aplica el mismo ajuste a todos los clips (contraste +10, saturación −5, temperatura ligeramente fría) para unificarlos.
8. **Textos:**
   - Mayúsculas, tipografía sin remates, con tracking amplio.
   - Máximo 4 palabras por pantalla. Ejemplos: «PRECISIÓN» (E05), «MÁS POTENCIA» (E08).
   - Mantenlos dentro de la zona segura: fuera del 15 % inferior y del 10 % superior, donde Reels y TikTok ponen sus botones.
9. **Logotipo:** PNG transparente en E10, con una aparición suave de 0,3 s.
10. **Sonido:** añade el sonido de motor y escape propio (grabado con el iPhone, clip 5) bajo la música en E07–E08.

## 9. Exportación
| Destino | Formato | Ajustes de exportación |
|---|---|---|
| Reels, TikTok, historias de Facebook | 9:16 · 1080×1920 | 1080p · 25 o 30 fps · H.264 · velocidad de bits recomendada o alta |
| YouTube, web, Facebook *feed*, anuncios horizontales | 16:9 · 1920×1080 | Igual |

**Versión 16:9:**
1. Duplica el proyecto y cambia la relación de aspecto a 16:9.
2. Reencuadra cada plano: si el clip se generó en 9:16, **genera aparte las escenas clave en 16:9** en lugar de ampliarlas.
3. Revisa que los textos y el logotipo queden centrados.

**Nombres de archivo:** `TALLER_anuncio-reprogramacion_9x16_v1.mp4` y `TALLER_anuncio-reprogramacion_16x9_v1.mp4`.

## 10. Coste aproximado
| Concepto | Coste | Fuente |
|---|---|---|
| Higgsfield Starter | 19 $/mes, unos 270 créditos | Guías de terceros, octubre 2026: **comprobar en /pricing** |
| Higgsfield Plus | 59 $/mes (47 $/mes en pago anual), unos 1.200 créditos | Ídem |
| Genjutsu (por clip) | ~99–105 créditos por 10–15 s según resolución | Ayuda y blog oficiales de Higgsfield (las cifras varían) |
| Kling 3.0 (por clip) | ~7 créditos por 5 s a 720p (más a 1080p) | Guía de terceros |
| CapCut | Gratis; el plan Pro es opcional | — |
| Música con licencia | Desde unos 10–20 €/mes en bibliotecas | **comprobar** |

**Estimación para este anuncio:** unos 10 planos × 3 intentos, más 2–3 clips de Genjutsu. Con el **plan Plus durante 1 mes** debería bastar.

**Total orientativo:** 50–70 € de herramientas, más la música. **Sin verificar en la página oficial.**

---

## Lista de material para empezar
1. **Xsara rojo:** fotos 01–12 (apartado 5.1), sin matrícula visible.
2. **Peugeot 206 negro:** fotos 01–12.
3. **Servicio:** fotos S1, S2 y, si existe, S3.
4. **Vídeos con iPhone (recomendado):** clips 1–6 (apartado 5.2), en 4K a 25 fps.
5. **Taller:** logotipo en PNG transparente o SVG, nombre comercial, teléfono, Instagram o web, y colores.
6. **Notas del vídeo de referencia:** la plantilla del apartado 4.3 rellenada, o al menos el número de planos y las duraciones.
7. **Música:** la pista elegida, con su licencia comercial.
8. **Cuenta de Higgsfield** creada y plan elegido.
