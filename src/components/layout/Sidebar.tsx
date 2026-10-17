import { NavLink, useNavigate } from 'react-router-dom'
import { BarChart3, BookOpen, CalendarDays, CalendarRange, Home, ListChecks, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Isotipo } from '@/branding/Logo'
import { useEstudiantesStore } from '@/stores/estudiantesStore'

const nav = [
  { to: '/', icon: Home, label: 'Inicio', end: true, color: 'var(--color-primary)', soft: 'var(--color-primary-soft)' },
  { to: '/autoperfil', icon: Sparkles, label: 'Mi autoperfil', color: 'var(--color-accent)', soft: 'var(--color-accent-soft)' },
  { to: '/biblioteca', icon: BookOpen, label: 'Biblioteca', color: 'var(--color-mod-escribir)', soft: 'var(--color-mod-escribir-soft)' },
  { to: '/actividades', icon: ListChecks, label: 'Actividades', color: 'var(--color-mod-atencion)', soft: 'var(--color-mod-atencion-soft)' },
  { to: '/agenda', icon: CalendarDays, label: 'Agenda', color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)' },
  { to: '/planificadores', icon: CalendarRange, label: 'Planificadores', color: 'var(--color-mod-regular)', soft: 'var(--color-mod-regular-soft)' },
  { to: '/herramientas', icon: Sparkles, label: 'Herramientas', color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)' },
  { to: '/progreso', icon: BarChart3, label: 'Mi progreso', color: 'var(--color-secondary)', soft: 'var(--color-secondary-soft)' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const activo = useEstudiantesStore((s) => s.estudiantes.find((e) => e.id === s.activoId))
  const cambiarDeEstudiante = useEstudiantesStore((s) => s.cambiarDeEstudiante)

  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r bg-surface">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <button onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-2" aria-label="Ir al inicio">
          <Isotipo size={28} />
          <span className="font-display text-[14.5px] font-semibold tracking-tight">Método Estudio</span>
        </button>
      </div>

      {activo && (
        <button
          type="button"
          onClick={cambiarDeEstudiante}
          className="flex w-full cursor-pointer items-center gap-2 border-b px-4 py-2.5 text-left transition-colors hover:bg-surface-2"
        >
          <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-muted-foreground">
            <span className="font-medium text-foreground">{activo.nombre}</span> · cambiar
          </span>
        </button>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1.5">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg border-l-[3px] px-2.5 py-1.5 text-[13px] font-medium transition-all',
                    isActive ? 'font-semibold shadow-[0_1px_2px_rgba(16,24,32,0.03)]' : 'text-muted-foreground hover:bg-surface-2',
                  )
                }
                style={({ isActive }) => ({
                  borderLeftColor: item.color,
                  backgroundColor: isActive ? item.soft : undefined,
                  color: isActive ? item.color : undefined,
                })}
              >
                <item.icon className="h-4 w-4 shrink-0" style={{ color: item.color }} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-2">
        <NavLink
          to="/ajustes"
          className={({ isActive }) =>
            cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
              isActive ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
            )
          }
        >
          Ajustes
        </NavLink>
      </div>
    </aside>
  )
}
