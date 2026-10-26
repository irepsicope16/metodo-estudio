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
  acceso_activo: boolean
  created_at: string
}

function mapearPerfil(fila: FilaPerfil): PerfilCuenta {
  return {
    id: fila.id,
    email: fila.email,
    rol: fila.rol,
    esMenor: fila.es_menor,
    nombre: fila.nombre,
    accesoActivo: fila.acceso_activo,
    createdAt: fila.created_at,
  }
}

const MENSAJES_ERROR: Record<string, string> = {
  'Invalid login credentials': 'Mail o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese mail — probá ingresar en vez de registrarte.',
  'Password should be at least 6 characters': 'La contraseña tiene que tener al menos 6 caracteres.',
  'Email not confirmed': 'Todavía no confirmaste el mail — revisá tu casilla de entrada.',
}

function traducirError(mensaje: string): string {
  return MENSAJES_ERROR[mensaje] ?? mensaje
}

interface AuthState {
  cargando: boolean
  session: Session | null
  perfil: PerfilCuenta | null
  error: string | null
  modoRecuperacion: boolean
  inicializar: () => void
  registrarse: (data: { email: string; password: string; rol: RolCuenta; esMenor: boolean; nombre: string }) => Promise<void>
  iniciarSesion: (data: { email: string; password: string }) => Promise<void>
  cerrarSesion: () => Promise<void>
  pedirRecuperacion: (email: string) => Promise<void>
  actualizarPassword: (nuevaPassword: string) => Promise<void>
  cancelarRecuperacion: () => void
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
  modoRecuperacion: false,

  inicializar: () => {
    // Si volvimos acá desde el link de "restablecer contraseña" que manda
    // Supabase por mail, la URL trae ?code=... — hay que canjearlo por una
    // sesión antes de nada más.
    const codigo = new URLSearchParams(window.location.search).get('code')
    if (codigo) {
      supabase.auth.exchangeCodeForSession(window.location.href).then(() => {
        window.history.replaceState({}, '', window.location.pathname + window.location.hash)
      })
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      const perfil = session ? await cargarPerfil(session.user.id) : null
      set({ session, perfil, cargando: false })
    })
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        set({ modoRecuperacion: true, session, cargando: false })
        return
      }
      const perfil = session ? await cargarPerfil(session.user.id) : null
      set({ session, perfil, cargando: false })
    })
  },

  registrarse: async ({ email, password, rol, esMenor, nombre }) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: traducirError(error.message) })
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
      set({ error: traducirError(errorPerfil.message) })
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
      set({ error: traducirError(error.message) })
      throw error
    }
    const perfil = await cargarPerfil(data.user.id)
    set({ session: data.session, perfil })
  },

  cerrarSesion: async () => {
    await supabase.auth.signOut()
    set({ session: null, perfil: null })
  },

  pedirRecuperacion: async (email) => {
    set({ error: null })
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    })
    if (error) {
      set({ error: traducirError(error.message) })
      throw error
    }
  },

  actualizarPassword: async (nuevaPassword) => {
    set({ error: null })
    const { error } = await supabase.auth.updateUser({ password: nuevaPassword })
    if (error) {
      set({ error: traducirError(error.message) })
      throw error
    }
    set({ modoRecuperacion: false })
  },

  cancelarRecuperacion: () => set({ modoRecuperacion: false }),
}))
