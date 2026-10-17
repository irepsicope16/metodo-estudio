import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Varios estudiantes pueden usar la app en el mismo dispositivo, cada uno con
// su propio espacio de datos (autoperfil, actividades, progreso, etc.) — sin
// cuentas ni backend, solo una lista local de "con quién estoy trabajando
// ahora". El namespacing real de los datos vive en services/storage/driver.ts
// y en stores/estudianteStorage.ts, que leen `activoId` de este store.

export interface Estudiante {
  id: string
  nombre: string
  creadoEl: string
}

interface EstudiantesState {
  estudiantes: Estudiante[]
  activoId: string | null
  crear: (nombre: string) => string
  seleccionar: (id: string) => void
  cambiarDeEstudiante: () => void
  renombrar: (id: string, nombre: string) => void
  eliminar: (id: string) => void
}

const LEGACY_DATA_PREFIX = 'me:data:'
const LEGACY_SINGLE_KEYS = ['me:horario_cursada', 'me:distribucion_actividades']

/**
 * Migración de una sola vez: si este dispositivo ya tenía datos del modelo
 * anterior ("un dispositivo = una persona", antes de sumar estudiantes),
 * los movemos a un primer estudiante en vez de perderlos. Corre antes de que
 * se cree el store de Zustand, leyendo/escribiendo localStorage directamente.
 */
function migrarDatosLegacySiCorresponde() {
  if (localStorage.getItem('me:estudiantes')) return

  const keysLegacy: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && (k.startsWith(LEGACY_DATA_PREFIX) || LEGACY_SINGLE_KEYS.includes(k))) keysLegacy.push(k)
  }
  if (keysLegacy.length === 0) return

  const id = crypto.randomUUID()
  let nombre = 'Estudiante 1'
  try {
    const perfilRaw = localStorage.getItem('me:perfil')
    if (perfilRaw) {
      const parsed = JSON.parse(perfilRaw) as { state?: { nombre?: string } }
      if (parsed.state?.nombre) nombre = parsed.state.nombre
    }
  } catch {
    // seguimos con el nombre por defecto
  }

  for (const k of keysLegacy) {
    const value = localStorage.getItem(k)
    if (value === null) continue
    const nuevaClave = k.startsWith(LEGACY_DATA_PREFIX)
      ? `me:p:${id}:data:${k.slice(LEGACY_DATA_PREFIX.length)}`
      : `me:p:${id}:${k.slice('me:'.length)}`
    localStorage.setItem(nuevaClave, value)
    localStorage.removeItem(k)
  }

  localStorage.setItem(
    'me:estudiantes',
    JSON.stringify({
      state: { estudiantes: [{ id, nombre, creadoEl: new Date().toISOString() }], activoId: id },
      version: 0,
    }),
  )
}

migrarDatosLegacySiCorresponde()

export const useEstudiantesStore = create<EstudiantesState>()(
  persist(
    (set) => ({
      estudiantes: [],
      activoId: null,
      crear: (nombre) => {
        const id = crypto.randomUUID()
        set((s) => ({
          estudiantes: [...s.estudiantes, { id, nombre, creadoEl: new Date().toISOString() }],
          activoId: id,
        }))
        return id
      },
      seleccionar: (id) => set({ activoId: id }),
      cambiarDeEstudiante: () => set({ activoId: null }),
      renombrar: (id, nombre) =>
        set((s) => ({ estudiantes: s.estudiantes.map((e) => (e.id === id ? { ...e, nombre } : e)) })),
      eliminar: (id) =>
        set((s) => ({
          estudiantes: s.estudiantes.filter((e) => e.id !== id),
          activoId: s.activoId === id ? null : s.activoId,
        })),
    }),
    { name: 'me:estudiantes' },
  ),
)
