import { db } from './db'
import { useEstudiantesStore } from '@/stores/estudiantesStore'

// Export/import de los datos del estudiante activo como JSON versionado.
// Mientras la persistencia sea LocalStorage, esta es la copia de seguridad
// del estudio (y la forma de mover a un estudiante entre dispositivos).

const BACKUP_VERSION = 1

const COLLECTIONS = [
  'responses',
  'openAnswers',
  'snapshots',
  'actividades',
  'sesionesEstudio',
  'mapas',
  'fichas',
  'evaluaciones',
  'cuadrosComparativos',
  'lineasTiempo',
  'diario',
  'aprendizajesSesion',
  'agenda',
  'planificadorPrincipiante',
  'planificadorSecundaria',
  'planificadorSuperior',
  'textosGuia',
] as const

type CollectionName = (typeof COLLECTIONS)[number]

interface BackupFile {
  app: 'metodo-estudio'
  version: number
  exportadoEl: string
  estudianteNombre?: string
  data: Record<CollectionName, unknown[]>
}

export interface PreparedBackup {
  url: string
  filename: string
}

function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function prepareBackup(): Promise<PreparedBackup> {
  const data = {} as BackupFile['data']
  for (const name of COLLECTIONS) {
    data[name] = await db[name].list()
  }
  const activo = useEstudiantesStore.getState()
  const estudianteNombre = activo.estudiantes.find((e) => e.id === activo.activoId)?.nombre
  const payload: BackupFile = {
    app: 'metodo-estudio',
    version: BACKUP_VERSION,
    exportadoEl: new Date().toISOString(),
    estudianteNombre,
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const sufijoNombre = estudianteNombre ? `-${slug(estudianteNombre)}` : ''
  return {
    url: URL.createObjectURL(blob),
    filename: `metodo-estudio-backup${sufijoNombre}-${new Date().toISOString().slice(0, 10)}.json`,
  }
}

/** Importa una copia de seguridad DENTRO del estudiante activo (reemplaza sus datos, no crea uno nuevo). */
export async function importBackup(file: File): Promise<{ ok: boolean; error?: string }> {
  try {
    const parsed = JSON.parse(await file.text()) as BackupFile
    if (parsed.app !== 'metodo-estudio' || !parsed.data) {
      return { ok: false, error: 'El archivo no es una copia de seguridad de Método Estudio.' }
    }
    if (parsed.version > BACKUP_VERSION) {
      return { ok: false, error: 'La copia fue creada con una versión más nueva de la plataforma.' }
    }
    for (const name of COLLECTIONS) {
      const rows = parsed.data[name]
      if (Array.isArray(rows)) {
        // El archivo es JSON externo (sin tipar) validado solo a nivel estructural arriba;
        // cada colección sabe convertir sus propias filas al tipo correcto.
        await (db[name].replaceAll as (rows: unknown[]) => Promise<void>)(rows)
      }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo leer el archivo. ¿Es un JSON válido?' }
  }
}
