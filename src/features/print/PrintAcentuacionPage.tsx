import { Link } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'

const REGLAS = [
  {
    nombre: 'Agudas',
    desc: 'La fuerza cae en la última sílaba. Llevan tilde si terminan en N, S o vocal.',
    ejemplo: 'ca-fé · ja-más · can-ción',
  },
  {
    nombre: 'Graves',
    desc: 'La fuerza cae en la penúltima sílaba. Llevan tilde si NO terminan en N, S o vocal.',
    ejemplo: 'ár-bol · lá-piz · fá-cil',
  },
  {
    nombre: 'Esdrújulas',
    desc: 'La fuerza cae en la antepenúltima sílaba. Siempre llevan tilde.',
    ejemplo: 'mú-si-ca · rá-pi-do',
  },
]

const FILAS = ['examen', 'carácter', '', '', '']

export default function PrintAcentuacionPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-surface px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link to="/biblioteca" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </Link>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
      </div>

      <div className="print-page rounded-xl border bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Isotipo size={26} />
          <span className="font-display text-[14px] font-semibold tracking-tight">
            Método <span className="text-accent">Estudio</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight">Guía de acentuación</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Separá en sílabas, encontrá la tónica y aplicá la regla.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {REGLAS.map((r) => (
            <div key={r.nombre} className="rounded-lg border bg-surface-2 p-3.5">
              <p className="text-[12px] font-bold uppercase tracking-wide text-primary">{r.nombre}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{r.desc}</p>
              <p className="mt-2 rounded bg-surface px-2 py-1 font-mono text-[11.5px]">{r.ejemplo}</p>
            </div>
          ))}
        </div>

        <table className="mt-8 w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b-2 text-left text-[10.5px] uppercase tracking-wide text-faint">
              <th className="py-2 pr-2">Palabra</th>
              <th className="py-2 pr-2">Sílabas</th>
              <th className="py-2 pr-2">Tónica</th>
              <th className="py-2 pr-2">Tipo</th>
              <th className="py-2">¿Tilde?</th>
            </tr>
          </thead>
          <tbody>
            {FILAS.map((palabra, i) => (
              <tr key={i} className="border-b border-dashed">
                <td className="py-3 pr-2 italic text-faint">{palabra || ' '}</td>
                <td className="py-3 pr-2">&nbsp;</td>
                <td className="py-3 pr-2">&nbsp;</td>
                <td className="py-3 pr-2">&nbsp;</td>
                <td className="py-3">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 border-t border-dashed pt-3 text-[11px] text-faint">
          Método Estudio · para completar a mano en sesión o en casa
        </p>
      </div>
    </div>
  )
}
