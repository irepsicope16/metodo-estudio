import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addDays, format, isWithinInterval, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { BookOpen, CalendarDays, Clock, Compass, Flame, Lightbulb, ListChecks, Sparkles, Timer, Trophy } from 'lucide-react'
import { useEstudiantesStore } from '@/stores/estudiantesStore'
import { useUIStore } from '@/stores/uiStore'
import {
  useActividadesProbadas,
  useDiario,
  useEventosAgenda,
  useFichas,
  useMapas,
  useResponses,
  useSesionesEstudio,
  useSnapshots,
} from '@/hooks/queries'
import { ITEMS } from '@/data/items'
import { RUTAS } from '@/data/rutas'
import { calcularRacha } from '@/lib/progreso'
import { notificarRachaEnRiesgo } from '@/lib/recordatorios'
import { calcularGamificacion } from '@/lib/gamificacion'
import { fechaLocal } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AvisoOrientativo, EmptyState, FadeIn, IconBadge, InsigniasRow, StatCard } from '@/components/shared'
import { EscritorioEstudio } from '@/components/illustrations/EscritorioEstudio'

const RAZONES_METODO = [
  'Aprendés más en menos tiempo, en vez de repetir sin entender.',
  'Lo que estudiás se queda en la memoria a largo plazo, no solo hasta el día del examen.',
  'Estudiar se vuelve menos abrumador — cuando sabés cómo organizarte, baja el estrés.',
  'Ganás autonomía: vas a poder aplicar estas estrategias en cualquier materia, en cualquier etapa.',
  'Descubrís cómo aprendés mejor vos, en vez de seguir una fórmula genérica para todos.',
]

export default function InicioPage() {
  const nombre = useEstudiantesStore((s) => s.estudiantes.find((e) => e.id === s.activoId)?.nombre ?? '')
  const avisosNavegadorActivos = useUIStore((s) => s.avisosNavegadorActivos)
  const { data: responses = [] } = useResponses()
  const { data: snapshots = [] } = useSnapshots()
  const { data: actividades = [] } = useActividadesProbadas()
  const { data: sesiones = [] } = useSesionesEstudio()
  const { data: diario = [] } = useDiario()
  const { data: fichas = [] } = useFichas()
  const { data: mapas = [] } = useMapas()
  const { data: eventosAgenda = [] } = useEventosAgenda()

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const autoperfilCompleto = respondidos >= ITEMS.length && snapshots.length > 0

  const fechasActividad = [
    ...actividades.filter((a) => a.fechaCompletada).map((a) => a.fechaCompletada!),
    ...sesiones.map((s) => s.fecha),
    ...diario.map((d) => d.fecha),
  ]
  const racha = calcularRacha(fechasActividad)
  const hoyISO = new Date().toISOString().slice(0, 10)
  const hizoAlgoHoy = fechasActividad.some((f) => f.slice(0, 10) === hoyISO)
  const rachaEnRiesgo = racha > 0 && !hizoAlgoHoy

  useEffect(() => {
    if (rachaEnRiesgo && avisosNavegadorActivos) notificarRachaEnRiesgo(racha)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rachaEnRiesgo, avisosNavegadorActivos])

  const completadas = actividades.filter((a) => a.estado === 'completada')
  const minutosEstudiados = sesiones.reduce((acc, s) => acc + s.duracionMin, 0)

  const { puntos, insignias } = calcularGamificacion({
    actividadesCompletadas: completadas.length,
    rutasDistintasProbadas: new Set(actividades.map((a) => a.rutaId)).size,
    racha,
    sesionesCronometro: sesiones.length,
    fichasCreadas: fichas.length,
    repasosFichas: fichas.reduce((acc, f) => acc + f.vecesRepasada, 0),
    mapasCreados: mapas.length,
    entradasDiario: diario.length,
  })
  const insigniasConseguidas = insignias.filter((i) => i.conseguida)

  const hoyInicio = startOfDay(new Date())
  const proximosEventos = eventosAgenda
    .filter((e) => !e.completado && isWithinInterval(fechaLocal(e.fecha), { start: hoyInicio, end: addDays(hoyInicio, 6) }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 4)

  const rutaPrioritaria = [...snapshots].sort((a, b) => {
    const orden: Record<string, number> = { alta: 0, moderada: 1, leve: 2, baja: 3 }
    return (orden[a.banda ?? 'baja'] ?? 4) - (orden[b.banda ?? 'baja'] ?? 4)
  })[0]
  const ruta = rutaPrioritaria ? RUTAS.find((r) => r.dimensiones.includes(rutaPrioritaria.dimension)) : undefined

  return (
    <FadeIn className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft via-surface to-accent-soft">
        <div className="relative z-10 flex flex-wrap items-center gap-4 px-5 py-6 sm:px-7">
          <div className="min-w-[220px] flex-1">
            <h1 className="font-display text-[33.5px] font-bold leading-tight tracking-tight sm:text-[36.5px]">Hola, {nombre}</h1>
            <p className="mt-1.5 text-[17px] leading-relaxed text-muted-foreground">Tu espacio para mejorar cómo estudiás.</p>
          </div>
          <EscritorioEstudio className="hidden h-[150px] w-[220px] shrink-0 sm:block" />
        </div>
      </div>

      <Link
        to="/guia"
        className="flex items-center gap-4 rounded-2xl p-5 text-left shadow-[0_10px_24px_-12px_var(--color-accent)] transition-transform hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Compass className="h-6 w-6 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[20.5px] font-bold leading-tight text-white">¿Cómo usar Método Estudio?</p>
          <p className="mt-0.5 text-[15px] leading-relaxed text-white/85">
            Por dónde empezar, qué hace cada herramienta, y la diferencia entre Agenda y Planificadores.
          </p>
        </div>
      </Link>

      <Card className="border-primary/15 bg-primary-soft/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[15.5px]">
            <IconBadge icon={Lightbulb} tone="primario" /> ¿Por qué aprender métodos de estudio?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-[15px] leading-relaxed">
            {RAZONES_METODO.map((razon, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{razon}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {rachaEnRiesgo && (
        <Card className="border-danger/30 bg-danger-soft/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 shrink-0 text-danger" />
              <div>
                <p className="text-[15px] font-medium">
                  Tu racha de {racha} {racha === 1 ? 'día' : 'días'} está en riesgo
                </p>
                <p className="text-[13.5px] text-muted-foreground">Todavía no hiciste nada hoy — repasá una ficha o abrí el cronómetro para mantenerla.</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas">Ver herramientas</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!autoperfilCompleto && (
        <Card className="border-accent/30 bg-accent-soft/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-accent-strong" />
              <div>
                <p className="text-[15px] font-medium">Empezá por tu autoperfil</p>
                <p className="text-[13.5px] text-muted-foreground">
                  {respondidos}/{ITEMS.length} preguntas respondidas — así te sugerimos por dónde arrancar.
                </p>
              </div>
            </div>
            <Button asChild size="sm">
              <Link to="/autoperfil">{respondidos > 0 ? 'Continuar' : 'Empezar'}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Racha" value={racha} hint={racha > 0 ? 'días seguidos' : 'empezá hoy'} tone="acento" />
        <StatCard icon={ListChecks} label="Actividades completadas" value={completadas.length} tone="primario" />
        <StatCard icon={Clock} label="Minutos de estudio" value={minutosEstudiados} tone="secundario" />
        <StatCard icon={Trophy} label="Puntos" value={puntos} hint={`${insigniasConseguidas.length}/${insignias.length} insignias`} tone="neutro" />
      </div>

      {insigniasConseguidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[15.5px]">
              <IconBadge icon={Trophy} tone="dorado" /> Tus insignias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InsigniasRow insignias={insignias} />
          </CardContent>
        </Card>
      )}

      {autoperfilCompleto && ruta && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBadge icon={Sparkles} tone="acento" /> Te conviene empezar por: {ruta.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            <Button asChild size="sm">
              <Link to="/actividades">Ver actividades de esta ruta</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/biblioteca">Ver en la Biblioteca</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-[15.5px]">
              <IconBadge icon={CalendarDays} tone="secundario" /> Agenda — próximos 7 días
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/agenda">Ver semana</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {proximosEventos.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Nada pendiente por ahora" description="Agregá evaluaciones, materiales o cumpleaños desde la Agenda." />
          ) : (
            <div className="space-y-1.5">
              {proximosEventos.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[14px]">
                  <span className="font-medium">{e.titulo}</span>
                  <span className="shrink-0 text-faint">{format(fechaLocal(e.fecha), "d 'de' MMM", { locale: es })}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[15.5px]">
              <IconBadge icon={Timer} tone="primario" /> Herramientas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/cronometro">Cronómetro</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/mapas">Mapas conceptuales</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/fichas">Fichas de repaso</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/diario">Diario</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[15.5px]">
              <IconBadge icon={BookOpen} tone="dorado" /> Biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {fichas.length === 0 && completadas.length === 0 ? (
              <EmptyState icon={ListChecks} title="Todavía no probaste ninguna técnica" description="Explorá la biblioteca de herramientas por área." />
            ) : (
              <p className="text-[14px] text-muted-foreground">
                Ya probaste {completadas.length} {completadas.length === 1 ? 'actividad' : 'actividades'} y armaste {fichas.length} {fichas.length === 1 ? 'ficha' : 'fichas'} de repaso.
              </p>
            )}
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/biblioteca">Explorar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}
