import { useState } from 'react'
import { Brain, Plus, Star, Trash2 } from 'lucide-react'
import {
  useAprendizajesSesion,
  useCrearAprendizajeSesion,
  useEliminarAprendizajeSesion,
  useRevisarAprendizajeSesion,
} from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaLarga } from '@/lib/utils'

export default function AprendizajesSesionPage() {
  const { data: aprendizajes = [] } = useAprendizajesSesion()
  const crear = useCrearAprendizajeSesion()
  const revisar = useRevisarAprendizajeSesion()
  const eliminar = useEliminarAprendizajeSesion()

  const [nuevoAbierto, setNuevoAbierto] = useState(false)
  const [reveladas, setReveladas] = useState<Record<string, boolean>>({})

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Aprendizajes de la sesión"
        subtitle="Vos escribís qué se trabajó. El estudiante piensa su respuesta en voz alta, la verifica y se autoevalúa — sin escribir nada."
        actions={
          <Button onClick={() => setNuevoAbierto(true)}>
            <Plus className="h-4 w-4" /> Nuevo aprendizaje
          </Button>
        }
      />
      <AvisoOrientativo>
        Pensado para usarlo vos con el estudiante: cargás la pregunta y lo que trabajaron como respuesta, y después de
        pensarla en voz alta, él mismo verifica y se pone la estrella.
      </AvisoOrientativo>

      {aprendizajes.length === 0 ? (
        <EmptyState icon={Brain} title="Todavía no hay aprendizajes cargados" description="Creá el primero con «Nuevo aprendizaje»." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aprendizajes.map((a) => {
            const revelada = !!reveladas[a.id]
            return (
              <Card key={a.id} className="group relative flex flex-col">
                <CardHeader className="pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                      {fechaLarga(a.createdAt)}
                    </span>
                    <button onClick={() => eliminar.mutate(a.id)} aria-label="Borrar aprendizaje">
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                  <p className="text-[13.5px] font-medium">{a.pregunta}</p>
                  <p className="text-[11px] text-faint">Pensalo o decilo en voz alta — después verificá tu respuesta.</p>

                  {!revelada ? (
                    <Button variant="outline" size="sm" className="mt-auto w-fit" onClick={() => setReveladas((r) => ({ ...r, [a.id]: true }))}>
                      Verificá tu respuesta
                    </Button>
                  ) : (
                    <div className="mt-auto space-y-2.5 rounded-lg border bg-surface-2 p-3">
                      <p className="text-[12.5px] leading-relaxed text-muted-foreground">{a.respuesta}</p>
                      <div>
                        <p className="mb-1 text-[11px] font-medium text-faint">¿Qué tan bien coincidió?</p>
                        <div className="flex gap-1">
                          {([1, 2, 3, 4, 5] as const).map((n) => (
                            <button
                              key={n}
                              onClick={() => {
                                revisar.mutate({ id: a.id, estrellas: n })
                                toast.success('¡Guardado!')
                              }}
                              aria-label={`${n} estrellas`}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  a.ultimaRevision && n <= a.ultimaRevision.estrellas ? 'fill-warning text-warning' : 'text-faint'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      {a.ultimaRevision && (
                        <p className="text-[10.5px] text-faint">Última revisión: {fechaLarga(a.ultimaRevision.fecha)}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <DialogoNuevoAprendizaje
        open={nuevoAbierto}
        onClose={() => setNuevoAbierto(false)}
        onCrear={async (data) => {
          await crear.mutateAsync(data)
          toast.success('Aprendizaje cargado')
          setNuevoAbierto(false)
        }}
      />
    </FadeIn>
  )
}

function DialogoNuevoAprendizaje({
  open,
  onClose,
  onCrear,
}: {
  open: boolean
  onClose: () => void
  onCrear: (data: { pregunta: string; respuesta: string }) => Promise<void>
}) {
  const [pregunta, setPregunta] = useState('¿Qué aprendiste hoy?')
  const [respuesta, setRespuesta] = useState('')

  async function guardar() {
    if (!pregunta.trim() || !respuesta.trim()) return
    await onCrear({ pregunta: pregunta.trim(), respuesta: respuesta.trim() })
    setPregunta('¿Qué aprendiste hoy?')
    setRespuesta('')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo aprendizaje</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Pregunta</Label>
            <Input value={pregunta} onChange={(e) => setPregunta(e.target.value)} autoFocus />
          </div>
          <div>
            <Label>Respuesta (lo que se trabajó en la sesión)</Label>
            <Textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Anotá acá lo que el estudiante debería recordar…"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!pregunta.trim() || !respuesta.trim()}>
              Crear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
