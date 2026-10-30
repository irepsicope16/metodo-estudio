import { useState } from 'react'
import { NotebookPen, Star, Trash2 } from 'lucide-react'
import { useCrearEntradaDiario, useDiario, useEliminarEntradaDiario } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label, Textarea } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { IlustracionDiario } from '@/components/shared/IlustracionesHerramientas'
import { IntroHerramienta } from '@/components/shared/IntroHerramienta'
import { toast } from '@/components/ui/toast'
import { fechaLarga } from '@/lib/utils'

export default function DiarioPage() {
  const { data: entradas = [] } = useDiario()
  const crear = useCrearEntradaDiario()
  const eliminar = useEliminarEntradaDiario()

  const [metodoUsado, setMetodoUsado] = useState('')
  const [efectividad, setEfectividad] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [queCambiaria, setQueCambiaria] = useState('')

  async function guardar() {
    if (!metodoUsado.trim()) return
    await crear.mutateAsync({ metodoUsado: metodoUsado.trim(), efectividad, queCambiaria: queCambiaria.trim() || undefined })
    toast.success('Entrada guardada')
    setMetodoUsado('')
    setEfectividad(3)
    setQueCambiaria('')
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Diario de metacognición" subtitle="Tres preguntas cortas después de estudiar, para ir viendo qué te funciona." />
      <AvisoOrientativo>Pensar en cómo estudiaste es tan importante como estudiar — así vas afinando tu propia estrategia.</AvisoOrientativo>

      <IntroHerramienta
        clave="diario"
        queEs="Un registro corto después de cada sesión de estudio, para ir notando qué técnicas te funcionan mejor."
        comoSeHace={[
          'Después de estudiar, anotá qué método usaste (ej: mapas conceptuales, fichas).',
          'Calificá con estrellas qué tan bien te funcionó.',
          'Si se te ocurre algo para la próxima, anotalo.',
          'Con el tiempo vas a ver un patrón de qué técnicas te rinden más.',
        ]}
        ejemplo="Método: «Fichas de repaso» → 4 estrellas → «La próxima vez, repasar también a la mañana»."
        ilustracion={<IlustracionDiario />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-[14px]">Nueva entrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div>
            <Label>¿Qué método usaste hoy?</Label>
            <Input value={metodoUsado} onChange={(e) => setMetodoUsado(e.target.value)} placeholder="Ej: Recuperación activa, mapas conceptuales…" />
          </div>
          <div>
            <Label>¿Qué tan bien te funcionó?</Label>
            <div className="flex gap-1.5">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <button key={n} onClick={() => setEfectividad(n)} aria-label={`${n} estrellas`}>
                  <Star className={`h-6 w-6 ${n <= efectividad ? 'fill-warning text-warning' : 'text-faint'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>¿Qué cambiarías la próxima vez? (opcional)</Label>
            <Textarea value={queCambiaria} onChange={(e) => setQueCambiaria(e.target.value)} />
          </div>
          <Button onClick={guardar} disabled={!metodoUsado.trim() || crear.isPending}>
            Guardar entrada
          </Button>
        </CardContent>
      </Card>

      {entradas.length === 0 ? (
        <EmptyState icon={NotebookPen} title="Todavía no hay entradas" />
      ) : (
        <div className="space-y-2">
          {entradas.map((e) => (
            <div key={e.id} className="flex items-start justify-between gap-3 rounded-xl border bg-surface p-3.5">
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{e.metodoUsado}</p>
                <div className="mt-0.5 flex items-center gap-1 text-warning">
                  {Array.from({ length: e.efectividad }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                {e.queCambiaria && <p className="mt-1 text-[12px] text-muted-foreground">{e.queCambiaria}</p>}
                <p className="mt-1 text-[11px] text-faint">{fechaLarga(e.fecha)}</p>
              </div>
              <Button variant="ghost" size="iconSm" onClick={() => eliminar.mutate(e.id)} aria-label="Borrar entrada">
                <Trash2 className="text-danger" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </FadeIn>
  )
}
