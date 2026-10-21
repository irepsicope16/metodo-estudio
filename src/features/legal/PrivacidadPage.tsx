import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Isotipo } from '@/branding/Logo'
import { Button } from '@/components/ui/button'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-[720px] rounded-2xl bg-surface p-6 shadow-[0_2px_4px_rgba(16,24,32,0.06),0_16px_32px_-12px_rgba(16,24,32,0.18)] sm:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Isotipo size={28} />
            <span className="font-display text-[15px] font-semibold tracking-tight">Método Estudio</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft /> Volver a la app
            </Link>
          </Button>
        </div>

        <h1 className="font-display text-[22px] font-semibold tracking-tight">Privacidad y términos de uso</h1>
        <p className="mt-1 text-[12.5px] text-faint">Última actualización: octubre de 2026.</p>

        <div className="mt-6 space-y-6 text-[13.5px] leading-relaxed text-foreground">
          <section>
            <h2 className="text-[14.5px] font-semibold">Tu cuenta</h2>
            <p className="mt-1.5 text-muted-foreground">
              Para usar Método Estudio pedimos un mail y una contraseña (si quien se registra es menor de edad, el
              mail tiene que ser el de un adulto responsable). Ese mail, la contraseña y el rol elegido (profesional o
              estudiante/familia) se guardan en un servidor (Supabase) — es el único dato que sale de tu dispositivo.
              Lo usamos únicamente para identificarte, no lo compartimos con terceros ni lo usamos con otro fin.
            </p>
          </section>

          <section>
            <h2 className="text-[14.5px] font-semibold">Dónde vive el resto de tu información</h2>
            <p className="mt-1.5 text-muted-foreground">
              Todo lo que cargás dentro de la app una vez que entraste — respuestas del autoperfil, actividades,
              fichas, mapas, el diario de metacognición, el progreso — queda guardado únicamente en el almacenamiento
              local de tu navegador, en tu propio dispositivo. Nada de eso se envía ni se guarda en ningún servidor.
            </p>
          </section>

          <section>
            <h2 className="text-[14.5px] font-semibold">Qué implica esto en la práctica</h2>
            <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>Nadie más que vos (ni siquiera nosotros) puede ver lo que cargaste.</li>
              <li>
                Si borrás los datos del navegador, cambiás de celular o desinstalás la app, esa información se pierde
                — no hay forma de recuperarla desde ningún lado, salvo que hayas exportado una copia.
              </li>
              <li>
                Desde Ajustes → Datos podés exportar una copia de seguridad (un archivo que se descarga a tu
                dispositivo) y volver a importarla cuando quieras, incluso en otro dispositivo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[14.5px] font-semibold">Analítica de uso</h2>
            <p className="mt-1.5 text-muted-foreground">
              Para saber de forma agregada cuánta gente usa la app, registramos un único evento anónimo la primera vez
              que se abre en un dispositivo nuevo: si quien la usa se identificó como "profesional" o "estudiante o
              familia". No incluye nombre, ubicación exacta ni ningún otro dato personal, y se procesa con la IP
              anonimizada. Esto es independiente de tus datos de estudio, que — como se explica arriba — nunca salen
              de tu dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-[14.5px] font-semibold">Uso por menores de edad</h2>
            <p className="mt-1.5 text-muted-foreground">
              Método Estudio puede ser usada por estudiantes menores de edad. Recomendamos que su uso esté acompañado
              o supervisado por un adulto responsable o por el profesional a cargo del seguimiento. La app es una
              herramienta de apoyo para organizar el estudio — no reemplaza una evaluación, un diagnóstico ni el
              acompañamiento de un profesional, y no debe usarse para una emergencia.
            </p>
          </section>

          <section>
            <h2 className="text-[14.5px] font-semibold">Propiedad y uso del contenido</h2>
            <p className="mt-1.5 text-muted-foreground">
              Método Estudio es una herramienta creada por la Lic. Irene Morbidelli (Psicopedagoga). Está prohibida su
              reventa, redistribución o copia sin autorización.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
