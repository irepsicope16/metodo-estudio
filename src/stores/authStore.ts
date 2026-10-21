import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { PerfilCuenta, RolCuenta } from '@/types'

interface FilaPerfil {
  id: string
  email: string
  rol: RolCuenta
  es_menor: boolean
  nombre: string
  created_at: string
}

function mapearPerfil(fila: FilaPerfil): PerfilCuenta {
  return { id: fila.id, email: fila.email, rol: fila.rol, esMenor: fila.es_menor, nombre: fila.nombre, createdAt: fila.created_at }
}

interface AuthState {
  cargando: boolean
  session: Session | null
  perfil: PerfilCuenta | null
  error: string | null
  inicializar: () => void
  registrarse: (data: { email: string; password: string; rol: RolCuenta; esMenor: boolean; nombre: string }) => Promise<void>
  iniciarSesion: (data: { email: string; password: string }) => Promise<void>
  cerrarSesion: () => Promise<void>
}

async function cargarPerfil(userId: string): Promise<PerfilCuenta | null> {
  const { data, error } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle()
  if (error || !data) return null
  return mapearPerfil(data as FilaPerfil)
}

export const useAuthStore = create<AuthState>((set) => ({
  cargando: true,
  session: null,
  perfil: null,
  error: null,

  inicializar: () => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      const perfil = session ? await cargarPerfil(session.user.id) : null
      set({ session, perfil, cargando: false })
    })
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const perfil = session ? await cargarPerfil(session.user.id) : null
      set({ session, perfil, cargando: false })
    })
  },

  registrarse: async ({ email, password, rol, esMenor, nombre }) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: error.message })
      throw error
    }
    const userId = data.user?.id
    if (!userId) {
      set({ error: 'No se pudo crear la cuenta. Probá de nuevo.' })
      throw new Error('sin userId')
    }
    const { error: errorPerfil } = await supabase
      .from('perfiles')
      .insert({ id: userId, email, rol, es_menor: esMenor, nombre })
    if (errorPerfil) {
      set({ error: errorPerfil.message })
      throw errorPerfil
    }
    if (data.session) {
      const perfil = await cargarPerfil(userId)
      set({ session: data.session, perfil })
    }
  },

  iniciarSesion: async ({ email, password }) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message })
      throw error
    }
    const perfil = await cargarPerfil(data.user.id)
    set({ session: data.session, perfil })
  },

  cerrarSesion: async () => {
    await supabase.auth.signOut()
    set({ session: null, perfil: null })
  },
}))
