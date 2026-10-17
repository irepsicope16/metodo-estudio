// Videos sugeridos por ruta: links externos reales, verificados y aprobados
// por la usuaria (14/09/2026; Active Recall reemplazado el 17/10/2026). No se
// incrustan — se muestran como tarjeta con link externo, igual que en Método
// Brújula.

import type { RecursoVideo } from '@/types'

export const VIDEOS: RecursoVideo[] = [
  {
    id: 'v-pomodoro',
    rutaId: 'prepararse_evaluar',
    titulo: 'Aprende el DOBLE en MENOS TIEMPO: El Método POMODORO',
    descripcion: 'Explicación del método Pomodoro para organizar bloques de estudio y descanso.',
    url: 'https://www.youtube.com/watch?v=Bst-rikH-pw',
    duracion: '',
  },
  {
    id: 'v-active-recall',
    rutaId: 'aprender_recordar',
    titulo: 'Cómo funciona el Active Recall (Recuerdo Activo) para estudiar',
    descripcion: 'Explicación breve y directa de la técnica, para ir al grano.',
    url: 'https://www.youtube.com/shorts/DCFtTSdF6nI',
    duracion: '',
  },
  {
    id: 'v-mapas-conceptuales',
    rutaId: 'aprender_recordar',
    titulo: 'Cómo hacer un mapa conceptual en 5 pasos + ejemplo',
    descripcion: 'Cómo armar un mapa conceptual desde cero, con un ejemplo aplicado.',
    url: 'https://www.youtube.com/watch?v=Wr7hSSF2Z6o',
    duracion: '',
  },
]
