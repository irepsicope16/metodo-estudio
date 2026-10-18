import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Columns3, Printer } from 'lucide-react'
import { useCuadros } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { Isotipo } from '@/branding/Logo'

export default function PrintCuadroPage() {
  const { id } = useParams()
  const { data: cuadros = [] } = useCuadros()
  const cuadro = cuadros.find((c) => c.id === id)

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-surface px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link to="/herramientas/cuadros" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </Link>
        <Button size="sm" onClick={() => window.print()} disabled={!cuadro}>
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
      </div>

      {!cuadro ? (
        <EmptyState icon={Columns3} title="No se encontró el cuadro" />
      ) : (
        <div className="print-page rounded-xl border bg-surface p-8">
          <div className="mb-6 flex items-center gap-2">
            <Isotipo size={26} />
            <span className="font-display text-[14px] font-semibold tracking-tight">
              Método <span className="text-accent">Estudio</span>
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">{cuadro.titulo}</h1>

          <table className="mt-6 w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border p-2 text-left text-[11.5px] font-semibold uppercase tracking-wide text-faint">Criterio</th>
                {cuadro.columnas.map((c, i) => (
                  <th key={i} className="border p-2 text-left font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cuadro.filas.map((f, i) => (
                <tr key={i}>
                  <td className="border p-2 font-medium text-muted-foreground">{f.criterio}</td>
                  {f.valores.map((v, j) => (
                    <td key={j} className="border p-2">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-8 border-t border-dashed pt-3 text-[11px] text-faint">Método Estudio</p>
        </div>
      )}
    </div>
  )
}
