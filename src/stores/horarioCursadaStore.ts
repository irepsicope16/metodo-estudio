import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { crearStorageEstudiante } from './estudianteStorage'

// Horario fijo semanal de cursada (distinto de la Agenda, que registra eventos
// puntuales): una grilla simple día × horario que la persona completa una vez
// y consulta. Vive en este dispositivo, como el resto de los datos de la app.

export const DIAS_CURSADA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const

export const BLOQUES_CURSADA = Array.from({ length: 12 }, (_, i) => {
  const inicio = 7 + i
  return `${inicio}:00 a ${inicio + 1}:00`
})

interface HorarioCursadaState {
  celdas: Record<string, string>
  notas: string
  setCelda: (dia: number, bloque: number, valor: string) => void
  setNotas: (notas: string) => void
}

export const useHorarioCursadaStore = create<HorarioCursadaState>()(
  persist(
    (set) => ({
      celdas: {},
      notas: '',
      setCelda: (dia, bloque, valor) =>
        set((s) => ({ celdas: { ...s.celdas, [`${dia}-${bloque}`]: valor } })),
      setNotas: (notas) => set({ notas }),
    }),
    { name: 'horario_cursada', storage: crearStorageEstudiante() },
  ),
)
