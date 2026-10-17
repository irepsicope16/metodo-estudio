import { useState } from 'react'
import { BookOpenCheck, Check, Highlighter, NotebookPen, Plus, Trash2 } from 'lucide-react'
import { useActualizarTextoGuia, useCrearTextoGuia, useEliminarTextoGuia, useTextosGuia } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { TextoGuia } from '@/types'

const PASOS: { key: keyof Pick<TextoGuia, 'leido' | 'subrayado' | 'resumido'>; label: string; icon: typeof Check }[] = [
  { key: 'leido', label: 'Leído', icon: BookOpenCheck },
  { key: 'subrayado', label: 'Subrayado', icon: Highlighter },
  { key: 'resumido', label: 'Resumido', icon: NotebookPen },
]

export default function GuiaTextosPage() {
  const { data: textos = [] } = useTextosGuia()
  const crear = useCrearTextoGuia()
  const actualizar = useActualizarTextoGuia()
  const eliminar = useEliminarTextoGuia()
  const [titulo, setTitulo] = useState('')

  async function agregar() {
    if (!titulo.trim()) return
    await crear.mutateAsync(titulo.trim())
    setTitulo('')
  }

  const completados = textos.filter((t) => t.leido && t.subrayado && t.resumido).length

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Guía de textos"
        subtitle="Un lugar para anotar qué estás leyendo y marcar tu avance en cada paso: leído, subrayado, resumido."
      />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-2 pt-5">
          <div className="min-w-[220px] flex-1">
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del texto (por ejemplo: Capítulo 5 de Historia)"
              onKeyDown={(e) => e.key === 'Enter' && agregar()}
            />
          </div>
          <Button onClick={agregar} disabled={!titulo.trim()}>
            <Plus className="h-4 w-4" /> Agregar texto
          </Button>
        </CardContent>
      </Card>

      {textos.length === 0 ? (
        <EmptyState icon={BookOpenCheck} title="Todavía no agregaste ningún texto" description="Escribí el título de lo que estás leyendo y agregalo." />
      ) : (
        <>
          <p className="text-[12.5px] text-muted-foreground">
            {completados} de {textos.length} {textos.length === 1 ? 'texto completo' : 'textos completos'}
          </p>
          <div className="space-y-2.5">
            {textos.map((t) => (
              <Card key={t.id} className="group">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <p className={cn('flex-1 text-[14px] font-medium', t.leido && t.subrayado && t.resumido && 'text-muted-foreground line-through')}>
                    {t.titulo}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {PASOS.map((p) => {
                      const Icon = p.icon
                      const activo = t[p.key]
                      return (
                        <button
                          key={p.key}
                          onClick={() => actualizar.mutate({ id: t.id, [p.key]: !activo })}
                          className={cn(
                            'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors',
                            activo
                              ? 'border-transparent bg-primary text-primary-foreground shadow-[0_4px_10px_-4px_var(--color-primary)]'
                              : 'border-border text-muted-foreground hover:bg-surface-2',
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => eliminar.mutate(t.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Borrar texto"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </FadeIn>
  )
}
