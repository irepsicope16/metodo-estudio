import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, History, Printer } from 'lucide-react'
import { useLineasTiempo } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { Isotipo } from '@/branding/Logo'

export default function PrintLineaTiempoPage() {
  const { id } = useParams()
  const { data: lineas = [] } = useLineasTiempo()
  const linea = lineas.find((l) => l.id === id)

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-surface px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link to="/herramientas/lineas-tiempo" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </Link>
        <Button size="sm" onClick={() => window.print()} disabled={!linea}>
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
      </div>

      {!linea ? (
        <EmptyState icon={History} title="No se encontró la línea de tiempo" />
      ) : (
        <div className="print-page rounded-xl border bg-surface p-8">
          <div className="mb-6 flex items-center gap-2">
            <Isotipo size={26} />
            <span className="font-display text-[14px] font-semibold tracking-tight">
              Método <span className="text-accent">Estudio</span>
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">{linea.titulo}</h1>

          <div className="mt-6 space-y-0">
            {linea.eventos.map((e, i) => (
              <div key={i} className="flex gap-4 border-l-2 pb-5 pl-4 last:pb-0" style={{ borderColor: 'var(--color-mod-regular)' }}>
                <div className="-ml-[21px] mt-0.5 h-3 w-3 shrink-0 rounded-full border-2" style={{ background: 'var(--surface)', borderColor: 'var(--color-mod-regular)' }} />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--color-mod-regular)' }}>
                    {e.fecha}
                  </p>
                  <p className="mt-0.5 text-[13.5px] text-foreground">{e.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-dashed pt-3 text-[11px] text-faint">Método Estudio</p>
        </div>
      )}
    </div>
  )
}
