import { Link } from 'react-router-dom'
import { ArrowLeft, BookMarked, Eye, FileEdit, Highlighter, Printer, RotateCcw, SplitSquareVertical, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'

const PASOS: { titulo: string; desc: string; herramienta: string; icon: LucideIcon; color: string }[] = [
  {
    titulo: 'El tema',
    desc: 'Tené en claro cuál es el tema y la materia, porque cada una se resume distinto: no es lo mismo Historia que Biología o Matemática.',
    herramienta: 'Antes de empezar',
    icon: BookMarked,
    color: 'var(--color-accent)',
  },
  {
    titulo: 'Lectura global',
    desc: 'Una lectura general y completa del texto. Todavía no intentes memorizar ni estudiar: es solo para ubicar de qué se trata.',
    herramienta: 'Lectura por capas',
    icon: Eye,
    color: 'var(--color-mod-atencion)',
  },
  {
    titulo: 'Dividir',
    desc: 'Si el texto es largo, dividilo por párrafos, hojas o subtítulos. Así el cerebro lo procesa de a poco en vez de todo junto.',
    herramienta: 'Organización',
    icon: SplitSquareVertical,
    color: 'var(--color-mod-organizar)',
  },
  {
    titulo: 'Subrayar',
    desc: 'Resaltá lo más importante. Usá colores distintos para diferenciar ideas principales de las secundarias.',
    herramienta: 'Idea principal',
    icon: Highlighter,
    color: 'var(--color-mod-aprender)',
  },
  {
    titulo: 'Releer',
    desc: 'Volvé a leer y repasar el texto. Ahora ya está dividido y subrayado, con las ideas principales y secundarias identificadas.',
    herramienta: 'Repaso',
    icon: RotateCcw,
    color: 'var(--color-mod-escribir)',
  },
  {
    titulo: 'El resumen',
    desc: 'Transcribí lo subrayado a otra hoja, con tus palabras. Es la forma de empezar a entrenar la memoria de trabajo.',
    herramienta: 'Resumen',
    icon: FileEdit,
    color: 'var(--color-mod-regular)',
  },
]

export default function PrintPasosEstudioPage() {
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

        <h1 className="font-display text-2xl font-semibold tracking-tight">Etapas del estudio</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          6 pasos para pasar de leer un texto a tener tu propio resumen, con la herramienta de la Biblioteca que corresponde a cada uno.
        </p>

        <ol className="mt-6 space-y-4">
          {PASOS.map((p, i) => {
            const Icon = p.icon
            return (
              <li key={p.titulo} className="flex gap-3.5 border-b border-dashed pb-4 last:border-0">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-semibold text-white"
                  style={{ background: p.color }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-[14.5px] font-semibold">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: p.color }} />
                    {p.titulo}
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{p.desc}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10.5px] text-secondary-strong">
                    {p.herramienta}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="mt-6 border-t border-dashed pt-3 text-[11px] text-faint">
          Método Estudio · llevátelo impreso a tu lugar de estudio
        </p>
      </div>
    </div>
  )
}
