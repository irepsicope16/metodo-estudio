// Ítems del Perfil Inicial de Estudio (Documento Maestro, tablas 4-11).
// 8 dimensiones × 7 ítems = 56 ítems. Contenido versionado en código: forma
// parte del método profesional y se cambia con revisión, no desde la UI.

import type { DimensionId, ItemDefinition } from '@/types'

export const VERSION_CUESTIONARIO = 'v1'

export const DIMENSIONES: Record<DimensionId, { nombre: string }> = {
  A: { nombre: 'Identidad y autoconocimiento como estudiante' },
  B: { nombre: 'Organización y planificación' },
  C: { nombre: 'Inicio, atención y persistencia' },
  D: { nombre: 'Lectura académica y consignas' },
  E: { nombre: 'Escritura y producción académica' },
  F: { nombre: 'Estrategias de aprendizaje y memoria' },
  G: { nombre: 'Autorregulación emocional y evaluaciones' },
  H: { nombre: 'Contexto, hábitos y apoyos' },
}

export const ITEMS: ItemDefinition[] = [
  // A — Identidad y autoconocimiento como estudiante
  { codigo: 'A1', dimension: 'A', clave: 'recurso', enunciado: 'Puedo reconocer qué cosas hago bien cuando estudio.' },
  { codigo: 'A2', dimension: 'A', clave: 'recurso', enunciado: 'Sé explicar qué me ayuda a aprender.' },
  { codigo: 'A3', dimension: 'A', clave: 'dificultad', enunciado: 'Aunque me esfuerce, siento que mis resultados nunca reflejan lo que hice.' },
  { codigo: 'A4', dimension: 'A', clave: 'dificultad', enunciado: 'Cuando algo me cuesta, pienso que no soy capaz de aprenderlo.' },
  { codigo: 'A5', dimension: 'A', clave: 'recurso', enunciado: 'Puedo pedir ayuda de una manera concreta.' },
  { codigo: 'A6', dimension: 'A', clave: 'recurso', enunciado: 'Después de una evaluación, puedo reconocer qué debería cambiar.' },
  { codigo: 'A7', dimension: 'A', clave: 'recurso', enunciado: 'Tengo al menos una meta académica que me importa.' },

  // B — Organización y planificación
  { codigo: 'B1', dimension: 'B', clave: 'recurso', enunciado: 'Registro fechas de evaluaciones y entregas en un mismo lugar.' },
  { codigo: 'B2', dimension: 'B', clave: 'dificultad', enunciado: 'Suelo comenzar a estudiar cuando falta muy poco tiempo.' },
  { codigo: 'B3', dimension: 'B', clave: 'recurso', enunciado: 'Puedo dividir una tarea grande en pasos pequeños.' },
  { codigo: 'B4', dimension: 'B', clave: 'dificultad', enunciado: 'Pierdo materiales, apuntes o archivos que necesito.' },
  { codigo: 'B5', dimension: 'B', clave: 'recurso', enunciado: 'Calculo de manera realista cuánto tiempo me llevará una tarea.' },
  { codigo: 'B6', dimension: 'B', clave: 'dificultad', enunciado: 'Entrego trabajos fuera de término aunque haya tenido tiempo.' },
  { codigo: 'B7', dimension: 'B', clave: 'recurso', enunciado: 'Antes de empezar, preparo lo que voy a necesitar.' },

  // C — Inicio, atención y persistencia
  { codigo: 'C1', dimension: 'C', clave: 'dificultad', enunciado: 'Me cuesta empezar incluso cuando sé qué tengo que hacer.' },
  { codigo: 'C2', dimension: 'C', clave: 'dificultad', enunciado: 'Interrumpo el estudio para mirar el celular o cambiar de actividad.' },
  { codigo: 'C3', dimension: 'C', clave: 'recurso', enunciado: 'Puedo sostener una tarea aunque no me resulte interesante.' },
  { codigo: 'C4', dimension: 'C', clave: 'dificultad', enunciado: 'Necesito que otra persona me recuerde repetidamente que empiece.' },
  { codigo: 'C5', dimension: 'C', clave: 'recurso', enunciado: 'Cuando me distraigo, puedo volver a la tarea.' },
  { codigo: 'C6', dimension: 'C', clave: 'dificultad', enunciado: 'Abandono cuando no me sale rápido.' },
  { codigo: 'C7', dimension: 'C', clave: 'recurso', enunciado: 'Reconozco cuándo necesito una pausa y puedo retomarla después.' },

  // D — Lectura académica y consignas
  { codigo: 'D1', dimension: 'D', clave: 'recurso', enunciado: 'Comprendo qué me pide una consigna antes de responder.' },
  { codigo: 'D2', dimension: 'D', clave: 'dificultad', enunciado: 'Necesito releer muchas veces para entender.' },
  { codigo: 'D3', dimension: 'D', clave: 'dificultad', enunciado: 'Pierdo la línea o salteo palabras cuando leo.' },
  { codigo: 'D4', dimension: 'D', clave: 'recurso', enunciado: 'Puedo identificar la idea principal de un texto.' },
  { codigo: 'D5', dimension: 'D', clave: 'dificultad', enunciado: 'Evito leer en voz alta porque temo equivocarme.' },
  { codigo: 'D6', dimension: 'D', clave: 'dificultad', enunciado: 'Los textos largos me demandan un esfuerzo desproporcionado.' },
  { codigo: 'D7', dimension: 'D', clave: 'recurso', enunciado: 'Puedo diferenciar información central y ejemplos.' },

  // E — Escritura y producción académica
  { codigo: 'E1', dimension: 'E', clave: 'recurso', enunciado: 'Antes de escribir, organizo las ideas que quiero comunicar.' },
  { codigo: 'E2', dimension: 'E', clave: 'dificultad', enunciado: 'Sé cómo empezar, pero mis respuestas quedan desordenadas.' },
  { codigo: 'E3', dimension: 'E', clave: 'dificultad', enunciado: 'Cometo errores ortográficos persistentes aun cuando reviso.' },
  { codigo: 'E4', dimension: 'E', clave: 'recurso', enunciado: 'Puedo responder con oraciones completas y comprensibles.' },
  { codigo: 'E5', dimension: 'E', clave: 'dificultad', enunciado: 'Me cuesta tomar apuntes y seguir una explicación al mismo tiempo.' },
  { codigo: 'E6', dimension: 'E', clave: 'recurso', enunciado: 'Puedo resumir sin copiar casi todo el texto.' },
  { codigo: 'E7', dimension: 'E', clave: 'recurso', enunciado: 'Reviso si mi respuesta realmente contesta la consigna.' },

  // F — Estrategias de aprendizaje y memoria
  { codigo: 'F1', dimension: 'F', clave: 'dificultad', enunciado: 'Para estudiar, principalmente leo o subrayo varias veces.' },
  { codigo: 'F2', dimension: 'F', clave: 'recurso', enunciado: 'Intento recordar sin mirar el material y luego verifico.' },
  { codigo: 'F3', dimension: 'F', clave: 'recurso', enunciado: 'Distribuyo el repaso en varios días.' },
  { codigo: 'F4', dimension: 'F', clave: 'recurso', enunciado: 'Puedo explicar un tema con mis propias palabras.' },
  { codigo: 'F5', dimension: 'F', clave: 'recurso', enunciado: 'Relaciono la información nueva con algo que ya sé.' },
  { codigo: 'F6', dimension: 'F', clave: 'dificultad', enunciado: 'Elijo la misma técnica para todas las materias.' },
  { codigo: 'F7', dimension: 'F', clave: 'recurso', enunciado: 'Compruebo qué sé y qué todavía no sé.' },

  // G — Autorregulación emocional y evaluaciones
  { codigo: 'G1', dimension: 'G', clave: 'dificultad', enunciado: 'La ansiedad me impide mostrar lo que sé.' },
  { codigo: 'G2', dimension: 'G', clave: 'recurso', enunciado: 'Si me equivoco, puedo analizar el error sin abandonar.' },
  { codigo: 'G3', dimension: 'G', clave: 'dificultad', enunciado: 'Evito tareas porque temo hacerlas mal.' },
  { codigo: 'G4', dimension: 'G', clave: 'recurso', enunciado: 'Puedo ajustar mi plan si surge un imprevisto.' },
  { codigo: 'G5', dimension: 'G', clave: 'dificultad', enunciado: 'Antes de rendir, mi sueño o mi alimentación cambian mucho.' },
  { codigo: 'G6', dimension: 'G', clave: 'recurso', enunciado: 'Puedo usar una estrategia para calmarme y continuar.' },
  { codigo: 'G7', dimension: 'G', clave: 'recurso', enunciado: 'Puedo aceptar una corrección sin sentir que define mi capacidad.' },

  // H — Contexto, hábitos y apoyos
  { codigo: 'H1', dimension: 'H', clave: 'recurso', enunciado: 'Tengo un lugar posible para estudiar con pocas interrupciones.' },
  { codigo: 'H2', dimension: 'H', clave: 'recurso', enunciado: 'Duermo lo suficiente para sostener mis actividades.' },
  { codigo: 'H3', dimension: 'H', clave: 'dificultad', enunciado: 'Mis horarios cambian tanto que no logro construir una rutina.' },
  { codigo: 'H4', dimension: 'H', clave: 'recurso', enunciado: 'Sé a quién recurrir cuando no comprendo un tema.' },
  { codigo: 'H5', dimension: 'H', clave: 'dificultad', enunciado: 'Las responsabilidades familiares o laborales interfieren con frecuencia.' },
  { codigo: 'H6', dimension: 'H', clave: 'recurso', enunciado: 'Puedo acceder a los materiales o recursos que necesito.' },
  { codigo: 'H7', dimension: 'H', clave: 'recurso', enunciado: 'Mi familia o entorno me acompaña sin hacer las tareas por mí.' },
]

export function itemsDeDimension(dimension: DimensionId): ItemDefinition[] {
  return ITEMS.filter((i) => i.dimension === dimension)
}
