import { Link, useLocation } from 'react-router-dom'
import { Flame, Menu, Moon, Sun, Timer } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import { useCronometroStore } from '@/stores/cronometroStore'
import { useActividadesProbadas, useDiario, useFichas, useSesionesEstudio } from '@/hooks/queries'
import { calcularRacha } from '@/lib/progreso'

export function Navbar() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const nombre = useEstudiantesStore((s) => s.estudiantes.find((e) => e.id === s.activoId)?.nombre ?? '')

  const { data: actividades = [] } = useActividadesProbadas()
  const { data: sesiones = [] } = useSesionesEstudio()
  const { data: diario = [] } = useDiario()
  const { data: fichas = [] } = useFichas()

  const fechasActividad = [
    ...actividades.filter((a) => a.fechaCompletada).map((a) => a.fechaCompletada!),
    ...sesiones.map((s) => s.fecha),
    ...diario.map((d) => d.fecha),
    ...fichas.filter((f) => f.ultimoRepaso).map((f) => f.ultimoRepaso!),
  ]
  const racha = calcularRacha(fechasActividad)

  const corriendo = useCronometroStore((s) => s.corriendo)
  const tecnica = useCronometroStore((s) => s.tecnica)
  const enDescanso = useCronometroStore((s) => s.enDescanso)
  const segundosRestantes = useCronometroStore((s) => s.segundosRestantes)
  const segundosLibres = useCronometroStore((s) => s.segundosLibres)
  const location = useLocation()
  const enCronometro = location.pathname === '/herramientas/cronometro'
  const mostrarSegundos = tecnica === 'libre' ? segundosLibres : segundosRestantes
  const mmCron = String(Math.floor(mostrarSegundos / 60)).padStart(2, '0')
  const ssCron = String(mostrarSegundos % 60).padStart(2, '0')

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-gradient-to-r from-surface to-surface-2 px-4 lg:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 text-secondary transition-colors hover:bg-secondary/10 lg:hidden"
        style={{ borderColor: 'var(--color-secondary)', boxShadow: '0 4px 10px -4px var(--color-secondary)' }}
        aria-label="Abrir menú"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        {corriendo && !enCronometro && (
          <Link
            to="/herramientas/cronometro"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13.5px] font-semibold tabular-nums transition-colors hover:opacity-80"
            style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-strong)' }}
          >
            <Timer className="h-3.5 w-3.5 animate-pulse" />
            {mmCron}:{ssCron}
            {tecnica === 'pomodoro' && <span className="hidden sm:inline">· {enDescanso ? 'descanso' : 'foco'}</span>}
          </Link>
        )}
        {racha > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[13.5px] font-semibold text-accent-strong">
            <Flame className="h-3.5 w-3.5" />
            {racha} {racha === 1 ? 'día' : 'días'}
          </span>
        )}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 text-warning transition-colors hover:bg-warning/10"
          style={{ borderColor: 'var(--color-warning)', boxShadow: '0 4px 10px -4px var(--color-warning)' }}
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {nombre && <span className="hidden text-[14.5px] font-medium sm:block">{nombre}</span>}
      </div>
    </header>
  )
}
