import { CATEGORIAS_DISTRIBUCION, useDistribucionActividadesStore } from '@/stores/distribucionActividadesStore'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/input'
import { FadeIn, PageHeader } from '@/components/shared'
import { cn } from '@/lib/utils'

export default function DistribucionActividadesPage() {
  const { valores, setValor } = useDistribucionActividadesStore()
  const total = CATEGORIAS_DISTRIBUCION.reduce((acc, c) => acc + valores[c.key], 0)

  let acumulado = 0
  const stops = CATEGORIAS_DISTRIBUCION.map((c) => {
    const inicio = acumulado
    acumulado += valores[c.key]
    return `${c.color} ${inicio}% ${acumulado}%`
  })
  if (acumulado < 100) stops.push(`var(--color-border) ${acumulado}% 100%`)

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Distribución de actividades"
        subtitle="¿Cómo se reparte tu día? Completá el porcentaje de cada categoría y mirá el gráfico actualizarse."
      />

      <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex justify-center">
          <div
            className="relative flex h-56 w-56 shrink-0 items-center justify-center rounded-full shadow-[0_10px_30px_-14px_rgba(16,24,32,0.25)]"
            style={{ background: `conic-gradient(${stops.join(', ')})` }}
          >
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-surface text-center">
              <span className="text-[26px] font-bold tracking-tight">{total}%</span>
              <span className="text-[11px] text-muted-foreground">{total === 100 ? 'completo' : 'asignado'}</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-4 pt-5">
            {CATEGORIAS_DISTRIBUCION.map((c) => (
              <div key={c.key} className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c.color }} />
                <Label className="mb-0 w-24 shrink-0">{c.label}</Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={valores[c.key]}
                  onChange={(e) => setValor(c.key, Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer"
                  style={{ accentColor: c.color }}
                />
                <span className="w-12 shrink-0 text-right text-[13px] font-semibold tabular-nums">{valores[c.key]}%</span>
              </div>
            ))}
            <p className={cn('pt-1 text-[12px]', total > 100 ? 'text-danger' : 'text-muted-foreground')}>
              {total > 100
                ? `Te pasaste por ${total - 100} puntos — ajustá alguna categoría.`
                : total === 100
                  ? '¡Repartiste el 100% de tu día!'
                  : `Todavía te quedan ${100 - total} puntos por repartir.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}
