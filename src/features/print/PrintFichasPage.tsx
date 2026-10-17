import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpenCheck, Printer } from 'lucide-react'
import { useFichas } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { Isotipo } from '@/branding/Logo'

export default function PrintFichasPage() {
  const { data: fichas = [] } = useFichas()
  const [params] = useSearchParams()
  const tema = params.get('tema')

  const visibles = tema ? fichas.filter((f) => f.tema === tema) : fichas

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-surface px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link to="/herramientas/fichas" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </Link>
        <Button size="sm" onClick={() => window.print()} disabled={visibles.length === 0}>
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
      </div>

      {visibles.length === 0 ? (
        <EmptyState icon={BookOpenCheck} title="No hay fichas para imprimir" description="Creá alguna ficha primero." />
      ) : (
        <div className="print-page rounded-xl border bg-surface p-8">
          <div className="mb-6 flex items-center gap-2">
            <Isotipo size={26} />
            <span className="font-display text-[14px] font-semibold tracking-tight">
              Método <span className="text-accent">Estudio</span>
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">Fichas de repaso{tema ? ` — ${tema}` : ''}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Doblá por la mitad o recortá para repasar sin ver la respuesta.</p>

          <div className="mt-6 space-y-4">
            {visibles.map((f, i) => (
              <div key={f.id} className="break-inside-avoid-page rounded-lg border border-dashed p-4">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">
                  {i + 1}. {f.tema}
                </p>
                <p className="mt-1.5 text-[14px] font-semibold">{f.pregunta}</p>
                <div className="mt-2.5 border-t border-dashed pt-2.5">
                  <p className="text-[10.5px] uppercase tracking-wide text-faint">Respuesta</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{f.respuesta}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 border-t border-dashed pt-3 text-[11px] text-faint">Método Estudio · {visibles.length} fichas</p>
        </div>
      )}
    </div>
  )
}
