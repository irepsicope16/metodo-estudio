import { BarChart3, CheckCircle2, Circle, Clock, Flame, ListChecks, Star, Trophy } from 'lucide-react'
import { useActividadesProbadas, useDiario, useFichas, useMapas, useSesionesEstudio, useSnapshots } from '@/hooks/queries'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState, FadeIn, InsigniasRow, PageHeader, StatCard } from '@/components/shared'
import { calcularRacha, diasActivosRecientes } from '@/lib/progreso'
import { calcularGamificacion } from '@/lib/gamificacion'
import { RUTAS } from '@/data/rutas'
import { DIMENSIONES } from '@/data/items'
import { ETIQUETA_BANDA } from '@/features/engine/estudioEngine'
import { RUTA_COLOR } from '@/lib/moduleColors'
import { fechaCorta } from '@/lib/utils'
import type { BandaNecesidad } from '@/types'

const BADGE_POR_BANDA: Record<BandaNecesidad, 'default' | 'secundario' | 'amber' | 'acento'> = {
  baja: 'default',
  leve: 'secundario',
  moderada: 'amber',
  alta: 'acento',
}

export default function ProgresoPage() {
  const { data: actividades = [] } = useActividadesProbadas()
  const { data: sesiones = [] } = useSesionesEstudio()
  const { data: diario = [] } = useDiario()
  const { data: fichas = [] } = useFichas()
  const { data: snapshots = [] } = useSnapshots()
  const { data: mapas = [] } = useMapas()

  const completadas = actividades.filter((a) => a.estado === 'completada')
  const fechasActividad = [
    ...completadas.filter((a) => a.fechaCompletada).map((a) => a.fechaCompletada!),
    ...sesiones.map((s) => s.fecha),
    ...diario.map((d) => d.fecha),
  ]
  const racha = calcularRacha(fechasActividad)
  const diasActivos = diasActivosRecientes(fechasActividad, 28)
  const minutosTotales = sesiones.reduce((acc, s) => acc + s.duracionMin, 0)

  const porRuta = new Map<string, number>()
  for (const a of completadas) porRuta.set(a.rutaId, (porRuta.get(a.rutaId) ?? 0) + 1)
  const maxPorRuta = Math.max(1, ...porRuta.values())

  const mejorCalificadas = [...completadas].filter((a) => a.calificacion).sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0)).slice(0, 5)

  const historialActividades = [...actividades].sort((a, b) => {
    const fechaA = a.fechaCompletada ?? a.fechaInicio
    const fechaB = b.fechaCompletada ?? b.fechaInicio
    return fechaB.localeCompare(fechaA)
  })

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

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Mi progreso" subtitle="Todo lo que fuiste construyendo, en un solo lugar." />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Racha actual" value={racha} hint={racha > 0 ? 'días seguidos' : 'empezá hoy'} tone="acento" />
        <StatCard icon={ListChecks} label="Completadas" value={completadas.length} tone="primario" />
        <StatCard icon={Clock} label="Minutos de estudio" value={minutosTotales} tone="secundario" />
        <StatCard icon={Trophy} label="Puntos" value={puntos} tone="neutro" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15.5px]">Qué fue haciendo</CardTitle>
          <CardDescription>Para repasar juntos, en familia, qué técnicas probó y cuándo.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {historialActividades.length === 0 ? (
            <EmptyState icon={ListChecks} title="Todavía no se probó ninguna actividad" description="Aparecen acá apenas se empieza una desde Actividades." />
          ) : (
            <div className="space-y-2">
              {historialActividades.map((a) => {
                const ruta = RUTAS.find((r) => r.id === a.rutaId)
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl border border-l-[3px] bg-surface p-3"
                    style={{ borderLeftColor: RUTA_COLOR[a.rutaId]?.color }}
                  >
                    {a.estado === 'completada' ? (
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 shrink-0 text-faint" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-medium">{a.titulo}</p>
                      <p className="text-[13px] text-faint">
                        {ruta?.nombre ?? a.rutaId} ·{' '}
                        {a.estado === 'completada' && a.fechaCompletada
                          ? `Completada el ${fechaCorta(a.fechaCompletada)}`
                          : `En curso desde el ${fechaCorta(a.fechaInicio)}`}
                        {a.calificacion && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 align-middle text-warning">
                            {Array.from({ length: a.calificacion }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </span>
                        )}
                      </p>
                      {a.nota && <p className="mt-0.5 text-[13px] text-muted-foreground">{a.nota}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15.5px]">Insignias</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <InsigniasRow insignias={insignias} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[15.5px]">Últimos 28 días</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CalendarioHabito diasActivos={diasActivos} />
        </CardContent>
      </Card>

      {snapshots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[15.5px]">Tu autoperfil, por área</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {[...snapshots]
              .sort((a, b) => a.dimension.localeCompare(b.dimension))
              .map((s) => (
                <div key={s.dimension} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                  <div>
                    <p className="text-[14px] font-medium">{s.dimension} · {DIMENSIONES[s.dimension].nombre}</p>
                    {s.banda && <p className="text-[12.5px] text-muted-foreground">{ETIQUETA_BANDA[s.banda]}</p>}
                  </div>
                  {s.banda && <Badge variant={BADGE_POR_BANDA[s.banda]}>{s.banda}</Badge>}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[15.5px]">Actividades completadas por ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {porRuta.size === 0 ? (
              <EmptyState icon={ListChecks} title="Todavía no completaste ninguna" />
            ) : (
              RUTAS.filter((r) => porRuta.has(r.id)).map((r) => {
                const cantidad = porRuta.get(r.id) ?? 0
                return (
                  <div key={r.id}>
                    <div className="mb-1 flex items-center justify-between text-[13.5px]">
                      <span className="font-medium">{r.nombre}</span>
                      <span className="text-faint">{cantidad}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(cantidad / maxPorRuta) * 100}%`, background: RUTA_COLOR[r.id]?.color }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[15.5px]">Tus técnicas mejor calificadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {mejorCalificadas.length === 0 ? (
              <EmptyState icon={Star} title="Calificá actividades completadas para ver tu ranking" />
            ) : (
              mejorCalificadas.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                  <span className="truncate text-[14px] font-medium">{a.titulo}</span>
                  <span className="flex shrink-0 items-center gap-0.5 text-warning">
                    {Array.from({ length: a.calificacion ?? 0 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}

function CalendarioHabito({ diasActivos }: { diasActivos: Set<string> }) {
  const dias: string[] = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dias.push(d.toISOString().slice(0, 10))
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {dias.map((iso) => (
        <div
          key={iso}
          title={iso}
          className="h-5 w-5 rounded-[4px]"
          style={{ background: diasActivos.has(iso) ? 'var(--color-accent)' : 'var(--color-surface-2)' }}
        />
      ))}
    </div>
  )
}
