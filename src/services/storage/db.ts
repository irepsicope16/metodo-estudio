import { LocalStorageDriver } from './driver'
import { Repository } from './repository'
import type {
  ActividadProbada,
  DimensionSnapshot,
  EntradaMetacognicion,
  EventoAgenda,
  Ficha,
  MapaConceptual,
  OpenAnswer,
  QuestionnaireResponse,
  SesionEstudio,
  TextoGuia,
} from '@/types'

// ------------------------------------------------------------
// Punto único de acceso a datos (LocalStorage, sin cuentas ni backend).
// Cada colección vive namespaced bajo el estudiante activo (ver
// stores/estudiantesStore.ts y driver.ts) — varios estudiantes pueden
// convivir en el mismo dispositivo sin mezclar sus datos.
// ------------------------------------------------------------

const driver = new LocalStorageDriver()

export const db = {
  responses: new Repository<QuestionnaireResponse>(driver, 'questionnaire_responses'),
  openAnswers: new Repository<OpenAnswer>(driver, 'open_answers'),
  snapshots: new Repository<DimensionSnapshot>(driver, 'dimension_snapshots'),
  actividades: new Repository<ActividadProbada>(driver, 'actividades_probadas'),
  sesionesEstudio: new Repository<SesionEstudio>(driver, 'sesiones_estudio'),
  mapas: new Repository<MapaConceptual>(driver, 'mapas_conceptuales'),
  fichas: new Repository<Ficha>(driver, 'fichas'),
  diario: new Repository<EntradaMetacognicion>(driver, 'diario_metacognicion'),
  agenda: new Repository<EventoAgenda>(driver, 'agenda_eventos'),
  planificadorPrincipiante: new Repository<EventoAgenda>(driver, 'planificador_principiante'),
  planificadorSecundaria: new Repository<EventoAgenda>(driver, 'planificador_secundaria'),
  planificadorSuperior: new Repository<EventoAgenda>(driver, 'planificador_superior'),
  textosGuia: new Repository<TextoGuia>(driver, 'textos_guia'),
  clearAll: () => driver.clearAll(),
}

/** Borra todos los datos del estudiante activo (no afecta a otros estudiantes del mismo dispositivo). */
export async function resetAllData(): Promise<void> {
  await db.clearAll()
}

/** Borra permanentemente todos los datos de un estudiante por id (usado al eliminarlo de la lista). */
export async function wipeEstudiante(id: string): Promise<void> {
  const base = `me:p:${id}:`
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(base)) keys.push(k)
  }
  keys.forEach((k) => localStorage.removeItem(k))
}
