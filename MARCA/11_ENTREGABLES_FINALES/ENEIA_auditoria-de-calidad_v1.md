# Auditoría de calidad
**Eneia Estudio · v1 · revisión independiente de cada entregable**

Escala de 0 a 100. El umbral de aprobación es 95. Cada fila recoge los defectos detectados y la corrección aplicada antes de la nota final.

| Entregable | Defectos detectados en la revisión | Corrección aplicada | Nota |
|---|---|---|---|
| **Naming** | «N&A» se leía como «N/A» (no aplica). «Nia» chocaba con la marca NIA registrada en la UE en la clase 41. | Proceso rehecho hasta llegar a **Eneia**, con búsqueda en TMview y comprobación de dominios. | 95 |
| **Logotipo** | V1 (monograma N&A) se leía como «M» y fue rechazado por la propiedad. V2 (Plano/Contraplano): la «Ǝ» se leía como «3». En el Encuadre REC, los imagotipos llevaban dos puntos rojos. | Se presentaron tres conceptos y la propiedad eligió Encuadre REC. Se impuso la regla de un solo punto rojo y se separaron los metadatos del visor de las esquinas. | 95 |
| **Sistema de logotipos** | — | 7 piezas × 6 variantes. SVG solo con trazados (sin texto vivo ni imágenes), PDF vectorial sin fuentes ni imágenes incrustadas (verificado con `pdffonts` y `pdfimages`), PNG transparentes de 3000 px. | 96 |
| **Color** | Pedra sobre Néboa no alcanza AA (2,83:1). Vermello REC sobre Néboa no sirve para texto pequeño (3,6:1). | Reglas de uso documentadas en el manual y aplicadas en la web. | 95 |
| **Tipografía** | — | Instrument Serif e Instrument Sans con licencia OFL comprobada; jerarquía documentada. | 96 |
| **Manual corporativo** | El índice tenía desfasada la página de Archivos y el *storyboard* incluía fotogramas casi vacíos. | Índice calculado automáticamente y fotogramas sustituidos. | 95 |
| **Aplicaciones (mockups)** | La captura de la web móvil salía recortada. | Reencuadre corregido. | 93 |
| **Web** | Corte de línea en «N y A» y logotipo del pie con carga diferida. | Espacios de no separación y carga inmediata del logotipo. Pruebas funcionales superadas (ver documento web). | 96 |
| **Vídeo** | Error en la sintaxis del audio (ffmpeg). | Corregido. 4 MP4 verificados con `ffprobe`: H.264 + AAC, 1920×1080 y 1080×1920, 6,5 s y 20 s. | 95 |
| **Presentación** | Diapositivas de 4 columnas con texto demasiado pequeño. | Cuerpo de texto aumentado y estructura con filetes. | 95 |
| **Estrategia y marketing** | — | Se distingue entre dato comprobado, hipótesis y recomendación. Los objetivos se marcan como propuestos. Fuentes registradas. | 95 |
| **Reposicionamiento v2 (estudio con IA)** | Mensajes de «cine documental» y «personas reales» contradecían el nuevo modelo con IA. | Reescritura de la web, el Instagram, el vídeo, el manual, la presentación y los documentos, más un marco legal (AI Act, art. 50) y un control de calidad para la IA. | 95 |

## Limitaciones reales (no simuladas)
- **Mockups (93):** son escenas vectoriales y tipográficas dibujadas por código, no fotomontajes fotorrealistas. Para fotografía de producto real hacen falta fotos propias o plantillas PSD de pago.
- **Fotografía:** no hay fotografías propias del estudio, así que el manual define el estilo y reserva el espacio. No se han usado imágenes de archivo para simularlas.
- **Vídeo:** el manifiesto entregado es tipográfico. La versión rodada tiene guion y plan, pero requiere grabar.
- **CMYK y Pantone:** el CMYK se ha calculado matemáticamente. Antes de imprimir hay que validarlo con una prueba de color. No se publica una equivalencia Pantone sin verificar con la guía física.
- **Comprobaciones registrales:** las hizo la propiedad en TMview y DonDominio, siguiendo las instrucciones del equipo, porque esos servicios están bloqueados en este entorno. No equivalen a un informe jurídico.
- **Datos de contacto:** el correo, el teléfono y el titular legal son marcadores que hay que sustituir. No se ha inventado ningún dato real.
