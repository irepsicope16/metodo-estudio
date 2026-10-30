import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

function leerColapsada(clave: string) {
  try {
    return localStorage.getItem(`introHerramienta:${clave}`) === 'colapsada'
  } catch {
    return false
  }
}

function guardarColapsada(clave: string, colapsada: boolean) {
  try {
    localStorage.setItem(`introHerramienta:${clave}`, colapsada ? 'colapsada' : 'abierta')
  } catch {
    /* localStorage no disponible, no interrumpe el flujo */
  }
}

/** Intro visual al principio de cada herramienta: qué es, cómo se hace y un
 *  ejemplo, con una ilustración simple — para estudiantes que necesitan
 *  apoyo visual además del texto. Se puede ocultar y queda así la próxima vez. */
export function IntroHerramienta({
  clave,
  queEs,
  comoSeHace,
  ejemplo,
  ilustracion,
}: {
  clave: string
  queEs: string
  comoSeHace: string[]
  ejemplo?: string
  ilustracion: ReactNode
}) {
  const [colapsada, setColapsada] = useState(() => leerColapsada(clave))

  function alternar() {
    setColapsada((c) => {
      guardarColapsada(clave, !c)
      return !c
    })
  }

  if (colapsada) {
    return (
      <button
        type="button"
        onClick={alternar}
        className="flex w-full items-center justify-between rounded-xl border border-dashed bg-surface-2 px-4 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:bg-surface"
      >
        ¿Qué es esto y cómo se usa?
        <ChevronDown className="h-4 w-4" />
      </button>
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-start">
        <div className="flex justify-center sm:justify-start">{ilustracion}</div>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[15px] leading-relaxed">{queEs}</p>
          <div>
            <p className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-faint">Cómo se hace</p>
            <ol className="space-y-1 text-[14px] leading-relaxed text-muted-foreground">
              {comoSeHace.map((paso, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="shrink-0 font-semibold text-primary">{i + 1}.</span>
                  <span>{paso}</span>
                </li>
              ))}
            </ol>
          </div>
          {ejemplo && (
            <div className="rounded-lg border bg-surface-2 px-3 py-2">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-faint">Ejemplo</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-muted-foreground">{ejemplo}</p>
            </div>
          )}
          <button
            type="button"
            onClick={alternar}
            className="flex items-center gap-1 text-[13px] font-medium text-faint hover:text-foreground"
          >
            <ChevronUp className="h-3.5 w-3.5" /> Ocultar
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
