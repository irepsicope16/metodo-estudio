import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackEvent } from '@/lib/analytics'

export type Rol = 'profesional' | 'familia'

interface RolState {
  rol: Rol | null
  elegirRol: (rol: Rol) => void
}

/** Un solo registro por dispositivo — quién lo está usando, no por estudiante. */
export const useRolStore = create<RolState>()(
  persist(
    (set) => ({
      rol: null,
      elegirRol: (rol) => {
        set({ rol })
        trackEvent('rol_seleccionado', { rol })
      },
    }),
    { name: 'me:rol' },
  ),
)
