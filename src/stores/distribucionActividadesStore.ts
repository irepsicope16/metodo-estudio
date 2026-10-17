import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { crearStorageEstudiante } from './estudianteStorage'

export const CATEGORIAS_DISTRIBUCION = [
  { key: 'estudio', label: 'Estudio', color: 'var(--color-mod-regular)' },
  { key: 'descanso', label: 'Descanso', color: 'var(--color-mod-atencion)' },
  { key: 'pendientes', label: 'Pendientes', color: 'var(--color-accent)' },
  { key: 'recreacion', label: 'Recreación', color: 'var(--color-mod-aprender)' },
] as const

export type CategoriaDistribucion = (typeof CATEGORIAS_DISTRIBUCION)[number]['key']

interface DistribucionState {
  valores: Record<CategoriaDistribucion, number>
  setValor: (categoria: CategoriaDistribucion, valor: number) => void
}

export const useDistribucionActividadesStore = create<DistribucionState>()(
  persist(
    (set) => ({
      valores: { estudio: 0, descanso: 0, pendientes: 0, recreacion: 0 },
      setValor: (categoria, valor) => set((s) => ({ valores: { ...s.valores, [categoria]: valor } })),
    }),
    { name: 'distribucion_actividades', storage: crearStorageEstudiante() },
  ),
)
