// Preguntas abiertas obligatorias del Perfil Inicial de Estudio (§4).

export interface PreguntaAbierta {
  id: string
  texto: string
}

export const PREGUNTAS_ABIERTAS: PreguntaAbierta[] = [
  { id: 'q1', texto: '¿Qué situación te gustaría que cambiara primero?' },
  { id: 'q2', texto: '¿En qué materia o tipo de tarea aparece con mayor intensidad?' },
  { id: 'q3', texto: '¿Qué estrategia ya probaste y qué ocurrió?' },
  { id: 'q4', texto: '¿Cuándo sentís que aprendés mejor?' },
  { id: 'q5', texto: '¿Qué tipo de ayuda te gustaría encontrar en esta app?' },
  { id: 'q6', texto: 'Si este proceso funcionara, ¿qué notarías diferente dentro de un mes?' },
]
