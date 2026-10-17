import { createJSONStorage, type PersistStorage } from 'zustand/middleware'
import { useEstudiantesStore } from './estudiantesStore'

// Adaptador de storage para stores de Zustand que son "datos de un
// estudiante" (horario de cursada, distribución de actividades): en vez de
// guardar bajo una clave fija, prefijan con el estudiante activo — igual
// que services/storage/driver.ts hace para el Repository genérico.

function prefijoActivo(): string {
  const id = useEstudiantesStore.getState().activoId
  return `me:p:${id ?? '_sin_estudiante'}:`
}

export function crearStorageEstudiante<S>(): PersistStorage<S> {
  return createJSONStorage<S>(() => ({
    getItem: (name) => localStorage.getItem(prefijoActivo() + name),
    setItem: (name, value) => localStorage.setItem(prefijoActivo() + name, value),
    removeItem: (name) => localStorage.removeItem(prefijoActivo() + name),
  }))!
}
