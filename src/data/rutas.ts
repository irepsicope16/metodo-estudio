// Biblioteca inicial de rutas y herramientas (Documento Maestro, tabla 18).
// Alcance de esta versión: catálogo compacto para vincular al Plan; la
// Biblioteca completa con ficha por actividad (Anexo A) queda en el backlog.

import type { Ruta } from '@/types'

export const RUTAS: Ruta[] = [
  {
    id: 'organizar',
    nombre: 'Organizar para empezar',
    dimensiones: ['B', 'C'],
    herramientas: [
      'Agenda única',
      'Vaciado de pendientes',
      'Dividir tareas',
      'Estimación real de tiempos',
      'Rutina de inicio',
      'Preparación de materiales',
      'Cierre diario',
    ],
  },
  {
    id: 'sostener_atencion',
    nombre: 'Sostener la atención',
    dimensiones: ['C', 'H'],
    herramientas: [
      'Diseño del ambiente',
      'Acuerdos con el celular',
      'Bloques flexibles',
      'Registro de distractores',
      'Pausas',
      'Señal de retorno',
      'Ajuste gradual',
    ],
  },
  {
    id: 'comprender',
    nombre: 'Comprender consignas y textos',
    dimensiones: ['D'],
    herramientas: [
      'Verbo de la consigna',
      'Identificar condiciones',
      'Lectura por capas',
      'Preguntas al texto',
      'Idea principal',
      'Inferencias',
      'Glosario',
      'Verificación',
    ],
  },
  {
    id: 'escribir',
    nombre: 'Escribir para comunicar',
    dimensiones: ['E'],
    herramientas: [
      'Plan previo',
      'Respuesta en tres momentos',
      'Cohesión',
      'Resumen',
      'Toma de apuntes',
      'Lista de revisión',
      'Edición por etapas',
    ],
  },
  {
    id: 'aprender_recordar',
    nombre: 'Aprender y recordar',
    dimensiones: ['F'],
    herramientas: [
      'Recuperación activa',
      'Práctica espaciada',
      'Intercalado',
      'Explicación con propias palabras',
      'Preguntas',
      'Ejemplos propios',
      'Flashcards bien diseñadas',
      'Autoevaluación',
      'Mapas conceptuales',
    ],
  },
  {
    id: 'prepararse_evaluar',
    nombre: 'Prepararse para evaluar',
    dimensiones: ['B', 'F', 'G'],
    herramientas: [
      'Calendario regresivo',
      'Simulación',
      'Priorización',
      'Práctica sin apoyo',
      'Análisis de errores',
      'Plan para el día previo',
    ],
  },
  {
    id: 'regular_persistir',
    nombre: 'Regular emociones y persistir',
    dimensiones: ['A', 'C', 'G'],
    herramientas: [
      'Meta pequeña',
      'Anticipación de obstáculos',
      'Autoinstrucciones',
      'Tolerancia al error',
      'Pausa reguladora',
      'Exposición gradual',
      'Pedido de ayuda',
    ],
  },
  {
    id: 'construir_autonomia',
    nombre: 'Construir autonomía',
    dimensiones: ['A'],
    herramientas: [
      'Elección consciente de estrategias',
      'Registro de eficacia',
      'Transferencia',
      'Plan personal',
      'Reducción progresiva de ayudas',
    ],
  },
]
