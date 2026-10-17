// Técnicas visuales: un segundo grupo de herramientas de estudio, pensadas
// para mostrarse con un ejemplo gráfico además del texto (a diferencia de las
// fichas de biblioteca.ts, que son solo texto). Contenido redactado de forma
// propia — no son transcripciones de ningún material de terceros.

export interface TecnicaVisual {
  id: string
  titulo: string
  resumen: string
  pasos: string[]
}

export const TECNICAS_VISUALES: TecnicaVisual[] = [
  {
    id: 'subrayado-colores',
    titulo: 'Subrayado con colores',
    resumen:
      'Asignarle un color fijo a cada tipo de información (títulos, ideas importantes, definiciones...) para que, con solo mirar la página, se distinga qué es cada cosa sin tener que releer todo.',
    pasos: [
      'Elegí de antemano qué significa cada color y no lo cambies de un texto a otro.',
      'Usá pocos colores — 4 o 5 como máximo. Con más, se pierde el sistema.',
      'Subrayá solo lo esencial de cada categoría, no párrafos enteros.',
    ],
  },
  {
    id: 'anotaciones-margen',
    titulo: 'Anotaciones en los márgenes',
    resumen:
      'Escribir comentarios breves al costado del texto mientras se lee — un resumen de una línea, una duda, una conexión con algo que ya se sabe — en vez de solo subrayar.',
    pasos: [
      'Después de cada párrafo, escribí al margen de qué se trata en una frase corta.',
      'Marcá con un signo propio lo que no entendiste, para volver después.',
      'Anotá también tus propias conexiones: "esto se parece a...".',
    ],
  },
  {
    id: 'mapa-mental',
    titulo: 'Mapa mental',
    resumen:
      'Un esquema con una idea central y ramas que se abren hacia los subtemas. A diferencia del mapa conceptual, no busca mostrar relaciones lógicas precisas sino generar y organizar ideas con libertad.',
    pasos: [
      'Escribí el tema central en el medio de la hoja.',
      'Tirá ramas hacia afuera con los subtemas principales.',
      'De cada rama, sacá ramas más chicas con detalles o ejemplos.',
      'Usá colores y dibujos simples — ayudan a recordar.',
    ],
  },
  {
    id: 'cuadro-comparativo',
    titulo: 'Cuadro comparativo',
    resumen:
      'Una tabla para poner uno al lado del otro dos o más elementos y ver de un vistazo en qué se parecen y en qué se diferencian.',
    pasos: [
      'Elegí qué vas a comparar (personajes, teorías, países, autores...).',
      'Armá una tabla: una columna por elemento, una fila por criterio.',
      'Completá cada celda con el mismo tipo de información, para poder comparar de verdad.',
    ],
  },
  {
    id: 'linea-tiempo',
    titulo: 'Línea de tiempo',
    resumen:
      'Una representación visual de eventos ordenados cronológicamente, para entender cuándo pasó cada cosa y cómo se relacionan entre sí en el tiempo.',
    pasos: [
      'Trazá una línea y marcá sobre ella los años o fechas clave.',
      'Ubicá cada evento en el lugar que le corresponde.',
      'Agregá una frase corta por evento, no el párrafo completo.',
    ],
  },
  {
    id: 'esquema-llaves',
    titulo: 'Esquema de llaves',
    resumen:
      'Una forma de mostrar jerarquía: un tema general que se abre en llaves hacia subtemas, y esos subtemas se abren en más llaves hacia los detalles de cada uno.',
    pasos: [
      'Escribí el tema general a la izquierda de la hoja.',
      'Abrí una llave hacia cada subtema.',
      'De cada subtema, abrí otra llave hacia sus detalles.',
    ],
  },
]
