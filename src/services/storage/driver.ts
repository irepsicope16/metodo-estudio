import { useEstudiantesStore } from '@/stores/estudiantesStore'

// StorageDriver: contrato mínimo de persistencia por colección.
// Hoy LocalStorage; migrable a un backend real con la misma interfaz.
// Cada colección queda namespaced bajo el estudiante activo, para que varios
// estudiantes puedan convivir en el mismo dispositivo sin mezclar datos.

export interface StorageDriver {
  read<T>(collection: string): Promise<T[]>
  write<T>(collection: string, rows: T[]): Promise<void>
  clearAll(): Promise<void>
}

function prefijoActivo(): string {
  const id = useEstudiantesStore.getState().activoId
  return `me:p:${id ?? '_sin_estudiante'}:`
}

export class LocalStorageDriver implements StorageDriver {
  async read<T>(collection: string): Promise<T[]> {
    try {
      const raw = localStorage.getItem(prefijoActivo() + 'data:' + collection)
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  }

  async write<T>(collection: string, rows: T[]): Promise<void> {
    localStorage.setItem(prefijoActivo() + 'data:' + collection, JSON.stringify(rows))
  }

  /** Borra todos los datos del estudiante activo (no toca otros estudiantes ni ajustes del dispositivo). */
  async clearAll(): Promise<void> {
    const base = prefijoActivo()
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(base)) keys.push(k)
    }
    keys.forEach((k) => localStorage.removeItem(k))
  }
}
