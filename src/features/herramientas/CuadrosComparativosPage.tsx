import { useEffect, useState } from 'react'
import { Columns3, Plus, Printer, Trash2, X } from 'lucide-react'
import { useCrearCuadro, useCuadros, useActualizarCuadro, useEliminarCuadro } from '@/hooks/queries'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import type { CuadroComparativo } from '@/types'

type Fila = { criterio: string; valores: string[] }

function cuadroVacio(): { titulo: string; columnas: string[]; filas: Fila[] } {
  return { titulo: '', columnas: ['', ''], filas: [{ criterio: '', valores: ['', ''] }] }
}

export default function CuadrosComparativosPage() {
  const { data: cuadros = [] } = useCuadros()
  const crear = useCrearCuadro()
  const actualizar = useActualizarCuadro()
  const eliminar = useEliminarCuadro()

  const [editando, setEditando] = useState<string | 'nuevo' | null>(null)
  const [titulo, setTitulo] = useState('')
  const [columnas, setColumnas] = useState<string[]>([])
  const [filas, setFilas] = useState<Fila[]>([])
  const [aEliminar, setAEliminar] = useState<CuadroComparativo | null>(null)

  useEffect(() => {
    if (editando === 'nuevo') {
      const v = cuadroVacio()
      setTitulo(v.titulo)
      setColumnas(v.columnas)
      setFilas(v.filas)
    } else if (editando) {
      const c = cuadros.find((x) => x.id === editando)
      if (c) {
        setTitulo(c.titulo)
        setColumnas(c.columnas)
        setFilas(c.filas)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editando])

  function agregarColumna() {
    setColumnas((c) => [...c, ''])
    setFilas((f) => f.map((fila) => ({ ...fila, valores: [...fila.valores, ''] })))
  }
  function quitarColumna(i: number) {
    if (columnas.length <= 2) return
    setColumnas((c) => c.filter((_, idx) => idx !== i))
    setFilas((f) => f.map((fila) => ({ ...fila, valores: fila.valores.filter((_, idx) => idx !== i) })))
  }
  function agregarFila() {
    setFilas((f) => [...f, { criterio: '', valores: columnas.map(() => '') }])
  }
  function quitarFila(i: number) {
    setFilas((f) => f.filter((_, idx) => idx !== i))
  }

  async function guardar() {
    if (!titulo.trim() || columnas.some((c) => !c.trim()) || filas.length === 0) {
      toast.error('Completá el título y el nombre de cada columna.')
      return
    }
    const data = { titulo: titulo.trim(), columnas: columnas.map((c) => c.trim()), filas }
    if (editando === 'nuevo') {
      await crear.mutateAsync(data)
      toast.success('Cuadro creado')
    } else if (editando) {
      await actualizar.mutateAsync({ id: editando, ...data })
      toast.success('Cuadro guardado')
    }
    setEditando(null)
  }

  if (editando) {
    return (
      <FadeIn className="space-y-5">
        <PageHeader title={editando === 'nuevo' ? 'Nuevo cuadro comparativo' : 'Editar cuadro'} />
        <Input placeholder="Título (ej. Personajes de la novela)" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[480px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-accent-soft">
                <th className="w-[150px] border-b p-2 text-left text-[11.5px] font-semibold text-faint">Criterio</th>
                {columnas.map((col, i) => (
                  <th key={i} className="border-b p-1.5">
                    <div className="flex items-center gap-1">
                      <Input
                        value={col}
                        onChange={(e) => setColumnas((c) => c.map((x, idx) => (idx === i ? e.target.value : x)))}
                        placeholder={`Elemento ${i + 1}`}
                        className="h-8 text-[12.5px]"
                      />
                      {columnas.length > 2 && (
                        <button onClick={() => quitarColumna(i)} aria-label="Quitar columna" className="shrink-0 text-faint hover:text-danger">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="w-9 border-b" />
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-1.5">
                    <Input
                      value={fila.criterio}
                      onChange={(e) => setFilas((f) => f.map((x, idx) => (idx === i ? { ...x, criterio: e.target.value } : x)))}
                      placeholder="Criterio"
                      className="h-8 text-[12.5px]"
                    />
                  </td>
                  {fila.valores.map((v, j) => (
                    <td key={j} className="p-1.5">
                      <Input
                        value={v}
                        onChange={(e) =>
                          setFilas((f) =>
                            f.map((x, idx) => (idx === i ? { ...x, valores: x.valores.map((vv, vj) => (vj === j ? e.target.value : vv)) } : x)),
                          )
                        }
                        className="h-8 text-[12.5px]"
                      />
                    </td>
                  ))}
                  <td className="p-1.5 text-center">
                    {filas.length > 1 && (
                      <button onClick={() => quitarFila(i)} aria-label="Quitar fila" className="text-faint hover:text-danger">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={agregarColumna}>
            <Plus className="h-3.5 w-3.5" /> Agregar columna
          </Button>
          <Button variant="outline" size="sm" onClick={agregarFila}>
            <Plus className="h-3.5 w-3.5" /> Agregar fila
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={guardar}>Guardar</Button>
          <Button variant="ghost" onClick={() => setEditando(null)}>
            Cancelar
          </Button>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Cuadros comparativos"
        subtitle="Poné dos o más elementos uno al lado del otro y comparalos criterio por criterio."
        actions={
          <Button onClick={() => setEditando('nuevo')}>
            <Plus className="h-4 w-4" /> Nuevo cuadro
          </Button>
        }
      />

      {cuadros.length === 0 ? (
        <EmptyState icon={Columns3} title="Todavía no hay cuadros" description="Creá el primero con «Nuevo cuadro»." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {cuadros.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-[14px]">{c.titulo}</CardTitle>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`#/print/cuadro/${c.id}`} target="_blank" rel="noopener noreferrer">
                        <Printer className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAEliminar(c)} aria-label="Eliminar">
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="cursor-pointer pt-0" onClick={() => setEditando(c.id)}>
                <div className="overflow-hidden rounded-lg border text-[11px]">
                  <div className="grid" style={{ gridTemplateColumns: `100px repeat(${c.columnas.length}, 1fr)`, background: 'var(--color-accent-soft)' }}>
                    <div className="p-1.5" />
                    {c.columnas.map((col, i) => (
                      <div key={i} className="truncate p-1.5 text-center font-semibold" style={{ color: 'var(--color-accent-strong)' }}>
                        {col}
                      </div>
                    ))}
                  </div>
                  {c.filas.slice(0, 3).map((f, i) => (
                    <div key={i} className="grid border-t" style={{ gridTemplateColumns: `100px repeat(${c.columnas.length}, 1fr)` }}>
                      <div className="truncate p-1.5 font-medium text-muted-foreground">{f.criterio}</div>
                      {f.valores.map((v, j) => (
                        <div key={j} className="truncate border-l p-1.5">
                          {v}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {c.filas.length > 3 && <p className="mt-1.5 text-[11px] text-faint">+{c.filas.length - 3} filas más</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!aEliminar} onOpenChange={(open) => !open && setAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar "{aEliminar?.titulo}"</DialogTitle>
            <DialogDescription>Esta acción no puede deshacerse.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!aEliminar) return
                await eliminar.mutateAsync(aEliminar.id)
                setAEliminar(null)
                toast.success('Cuadro eliminado')
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
