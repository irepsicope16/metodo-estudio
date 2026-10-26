// ============================================================
// Método Estudio — Modelo de dominio (app de autoayuda, un solo usuario local)
// Basado en el Documento Maestro V1 (Lic. Irene Morbidelli, set. 2026),
// adaptado a uso individual: sin roles profesional/estudiante, sin cuentas.
// IDs uuid y timestamps ISO-8601.
// ============================================================

// ---------- Autoperfil (8 dimensiones / 56 ítems) ----------

export type DimensionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

export type ItemKey = 'recurso' | 'dificultad'

export interface ItemDefinition {
  codigo: string // A1..H7
  dimension: DimensionId
  enunciado: string
  clave: ItemKey
}

/** Escala 0-3: 0 Nunca o casi nunca · 1 A veces · 2 Frecuentemente · 3 Casi siempre. null = No aplica. */
export interface QuestionnaireResponse {
  id: string
  versionId: string // p. ej. 'v1'
  itemId: string // código del ítem
  valor: 0 | 1 | 2 | 3 | null
  fecha: string
  createdAt: string
  updatedAt: string
}

export interface OpenAnswer {
  id: string
  preguntaId: string
  texto: string
  createdAt: string
  updatedAt: string
}

// ---------- Resultados por dimensión ----------

export type BandaNecesidad = 'baja' | 'leve' | 'moderada' | 'alta'

export interface DimensionSnapshot {
  id: string
  dimension: DimensionId
  versionId: string
  promedioNecesidad: number | null // null si completitud < 70%
  completitud: number // 0..1
  banda: BandaNecesidad | null
  generadoEl: string
  createdAt: string
  updatedAt: string
}

// ---------- Rutas y herramientas (biblioteca, tabla 18) ----------

export interface Ruta {
  id: string
  nombre: string
  dimensiones: DimensionId[]
  herramientas: string[]
}

// ---------- Actividades (catálogo por ruta/nivel + las que fue probando) ----------

export type NivelActividad = 1 | 2 | 3
export type EstadoActividad = 'pendiente' | 'en_curso' | 'completada'

/** Ficha del catálogo estático (`data/actividades.ts`), una por ruta/nivel. */
export interface ActividadCatalogo {
  id: string
  rutaId: string
  nivel: NivelActividad
  titulo: string
  descripcion: string
  ejemplo?: string // caso concreto resuelto, para entender la técnica antes de probarla
  ejercicio?: string // consigna de práctica fija, igual para todos
  fuente?: string // referencia interna de dónde se tomó la idea (no se muestra en la UI)
  /** Para nivel 1: ícono propio, mostrado en la tarjeta del catálogo. */
  icon?: import('lucide-react').LucideIcon
}

/**
 * Instancia que la persona eligió probar, nace de una ActividadCatalogo
 * (`actividadId`). Al completarla puede calificarla — esto arma su propio
 * "qué método le funcionó mejor".
 */
export interface ActividadProbada {
  id: string
  actividadId: string
  rutaId: string
  nivel: NivelActividad
  titulo: string
  descripcion: string
  estado: EstadoActividad
  fechaInicio: string
  fechaCompletada?: string
  calificacion?: 1 | 2 | 3 | 4 | 5
  nota?: string
  aplicacionPropia?: string // cómo la persona la usó con su propio tema de estudio
  createdAt: string
  updatedAt: string
}

// ---------- Videos sugeridos por ruta (catálogo estático, `data/videos.ts`) ----------

export interface RecursoVideo {
  id: string
  rutaId: string
  titulo: string
  descripcion: string
  url: string
  duracion: string
}

// ---------- Cronómetro de estudio ----------

export type TecnicaCronometro = 'pomodoro' | 'libre'

export interface SesionEstudio {
  id: string
  tecnica: TecnicaCronometro
  duracionMin: number
  fecha: string
  createdAt: string
  updatedAt: string
}

// ---------- Mapas conceptuales ----------

export interface NodoMapa {
  id: string
  texto: string
  x: number
  y: number
  color?: string
}

export interface ConexionMapa {
  id: string
  desdeId: string
  hastaId: string
}

export interface MapaConceptual {
  id: string
  titulo: string
  nodos: NodoMapa[]
  conexiones: ConexionMapa[]
  createdAt: string
  updatedAt: string
}

// ---------- Fichas de repaso (flashcards, repetición espaciada tipo Leitner) ----------

/** Caja 1 (recién creada o fallada) a 5 (bien afianzada) — a más caja, más espacio entre repasos. */
export type CajaLeitner = 1 | 2 | 3 | 4 | 5

export interface Ficha {
  id: string
  tema: string
  pregunta: string
  respuesta: string
  vecesRepasada: number
  ultimoRepaso?: string
  caja: CajaLeitner
  proximoRepaso: string // ISO — hoy o antes = "para repasar hoy"
  createdAt: string
  updatedAt: string
}

// ---------- Autoevaluación (modo examen con las propias fichas) ----------

export interface EvaluacionFichas {
  id: string
  tema: string // tema elegido, o 'todos'
  totalPreguntas: number
  correctas: number
  duracionSegundos: number
  fecha: string // ISO, momento en que se rindió
  createdAt: string
  updatedAt: string
}

// ---------- Cuadro comparativo ----------

export interface CuadroComparativo {
  id: string
  titulo: string
  columnas: string[]
  filas: { criterio: string; valores: string[] }[] // valores.length === columnas.length
  createdAt: string
  updatedAt: string
}

// ---------- Línea de tiempo ----------

export interface LineaTiempoItem {
  id: string
  titulo: string
  eventos: { fecha: string; texto: string }[]
  createdAt: string
  updatedAt: string
}

// ---------- Guía de textos (seguimiento de lecturas: leído/subrayado/resumido) ----------

export interface TextoGuia {
  id: string
  titulo: string
  leido: boolean
  subrayado: boolean
  resumido: boolean
  createdAt: string
  updatedAt: string
}

// ---------- Agenda (eventos semanales) ----------

export type TipoEvento =
  | 'evaluacion'
  | 'extraescolar'
  | 'material'
  | 'cumpleanos'
  | 'nota'
  | 'tarea' // Planificadores por nivel
  | 'tp'
  | 'parcial'
  | 'final'
  | 'trabajo_grupo'

export interface EventoAgenda {
  id: string
  tipo: TipoEvento
  titulo: string
  fecha: string // ISO, solo la parte de fecha importa (yyyy-mm-dd)
  nota?: string
  completado: boolean
  createdAt: string
  updatedAt: string
}

// ---------- Planificadores por nivel (principiante / secundaria / superior) ----------
// Misma forma que un EventoAgenda, pero en 3 colecciones separadas: cada nivel
// es una herramienta propia, con sus propios datos (no comparten eventos entre sí
// ni con la Agenda semanal — a diferencia de la Agenda Anual, que sí reusa esa).
export type NivelPlanificador = 'principiante' | 'secundaria' | 'superior'

// ---------- Diario de metacognición ----------

export interface EntradaMetacognicion {
  id: string
  fecha: string
  metodoUsado: string
  efectividad: 1 | 2 | 3 | 4 | 5
  queCambiaria?: string
  createdAt: string
  updatedAt: string
}

// ---------- Aprendizajes de la sesión ----------
// Tarjeta de recuperación activa donde la respuesta la escribe el profesional
// (lo que se trabajó en la sesión), no el estudiante: éste piensa/dice su
// respuesta en voz alta, da vuelta la tarjeta para verificarla contra la que
// escribió el profesional, y se autoevalúa con estrellas — sin escribir nada.

export interface AprendizajeSesion {
  id: string
  pregunta: string
  respuesta: string
  createdAt: string
  updatedAt: string
  ultimaRevision?: { fecha: string; estrellas: 1 | 2 | 3 | 4 | 5 }
}

// ---------- Cuenta (Supabase) ----------
// Único dato que vive fuera del dispositivo: el mail, el rol y si quien se
// registra es menor (en cuyo caso el mail es el de un adulto responsable).
// Los datos de estudio en sí siguen 100% locales — esto es solo la cuenta.

export type RolCuenta = 'profesional' | 'estudiante_familia'

export interface PerfilCuenta {
  id: string // = auth.users.id
  email: string
  rol: RolCuenta
  esMenor: boolean
  nombre: string
  accesoActivo: boolean
  createdAt: string
}
