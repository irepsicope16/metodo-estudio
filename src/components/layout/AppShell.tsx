import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useUIStore } from '@/stores/uiStore'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import { useHorarioCursadaStore } from '@/stores/horarioCursadaStore'
import { useDistribucionActividadesStore } from '@/stores/distribucionActividadesStore'
import { Bienvenida } from '@/features/estudiantes/SeleccionarEstudiantePage'
import { useAuthStore } from '@/stores/authStore'
import { useRolStore } from '@/stores/rolStore'
import { AccesoSuspendidoGate, AuthGate, NuevaPasswordGate } from '@/features/auth/AuthGate'

export function AppShell() {
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const location = useLocation()
  const activoId = useEstudiantesStore((s) => s.activoId)
  const hayActivo = useEstudiantesStore((s) => s.estudiantes.some((e) => e.id === s.activoId))
  const qc = useQueryClient()
  const cargandoAuth = useAuthStore((s) => s.cargando)
  const session = useAuthStore((s) => s.session)
  const perfil = useAuthStore((s) => s.perfil)
  const modoRecuperacion = useAuthStore((s) => s.modoRecuperacion)
  const rolActual = useRolStore((s) => s.rol)
  const elegirRol = useRolStore((s) => s.elegirRol)

  // El rol ya quedó elegido al registrarse (Supabase) — se refleja acá para
  // que la app no vuelva a preguntarlo localmente.
  useEffect(() => {
    if (!perfil || rolActual) return
    elegirRol(perfil.rol === 'profesional' ? 'profesional' : 'familia')
  }, [perfil, rolActual, elegirRol])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname, setMobileNavOpen])

  // Al cambiar (o elegir por primera vez) el estudiante activo, todo lo que
  // esté cacheado o ya hidratado desde localStorage corresponde al estudiante
  // anterior — hay que refrescarlo desde el nuevo namespace.
  useEffect(() => {
    if (!activoId) return
    qc.invalidateQueries()
    useHorarioCursadaStore.persist.rehydrate()
    useDistribucionActividadesStore.persist.rehydrate()
    setMobileNavOpen(false)
  }, [activoId, qc, setMobileNavOpen])

  if (cargandoAuth) return null

  if (modoRecuperacion) return <NuevaPasswordGate />

  if (!session) return <AuthGate />

  if (perfil && !perfil.accesoActivo) return <AccesoSuspendidoGate />

  if (!hayActivo) {
    return (
      <div className="flex h-screen w-full items-center justify-center overflow-y-auto bg-background p-4">
        <div className="w-full max-w-[640px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-8 shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:px-10">
          <Bienvenida />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border-2 bg-surface text-accent-strong"
              style={{ borderColor: 'var(--color-accent)', boxShadow: '0 4px 10px -4px var(--color-accent)' }}
              aria-label="Cerrar menú"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-y-auto bg-background p-3.5 sm:p-4 lg:p-5">
          <div className="mx-auto min-h-full w-full max-w-[1200px] rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-accent-soft px-6 py-6 shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
