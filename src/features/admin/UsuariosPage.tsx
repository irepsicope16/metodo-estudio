import { useEffect, useState } from 'react'
import { Briefcase, GraduationCap, ShieldAlert } from 'lucide-react'
import { supabase, MAIL_ADMIN } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { fechaLarga } from '@/lib/utils'
import type { RolCuenta } from '@/types'

interface FilaPerfil {
  id: string
  email: string
  rol: RolCuenta
  es_menor: boolean
  nombre: string
  created_at: string
}

export default function UsuariosPage() {
  const session = useAuthStore((s) => s.session)
  const [filas, setFilas] = useState<FilaPerfil[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const esAdmin = session?.user.email === MAIL_ADMIN

  useEffect(() => {
    if (!esAdmin) return
    supabase
      .from('perfiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setFilas(data as FilaPerfil[])
      })
  }, [esAdmin])

  if (!esAdmin) {
    return (
      <FadeIn>
        <EmptyState icon={ShieldAlert} title="No tenés acceso a esta sección" description="Esta pantalla es solo para la administradora de Método Estudio." />
      </FadeIn>
    )
  }

  const profesionales = filas?.filter((f) => f.rol === 'profesional') ?? []
  const estudiantes = filas?.filter((f) => f.rol === 'estudiante_familia') ?? []

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Profesionales y estudiantes" subtitle="Quiénes se registraron en Método Estudio." />

      {error && <p className="text-[13px] text-danger">No se pudo cargar: {error}</p>}

      {filas === null && !error ? (
        <p className="text-[13px] text-muted-foreground">Cargando…</p>
      ) : (
        <>
          <Seccion titulo="Profesionales" icon={Briefcase} filas={profesionales} />
          <Seccion titulo="Estudiantes y familias" icon={GraduationCap} filas={estudiantes} />
        </>
      )}
    </FadeIn>
  )
}

function Seccion({ titulo, icon: Icon, filas }: { titulo: string; icon: typeof Briefcase; filas: FilaPerfil[] }) {
  return (
    <div>
      <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-semibold tracking-tight">
        <Icon className="h-4 w-4 text-primary" /> {titulo} ({filas.length})
      </h2>
      {filas.length === 0 ? (
        <p className="text-[12.5px] text-muted-foreground">Todavía no hay nadie en esta categoría.</p>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {filas.map((f) => (
            <Card key={f.id}>
              <CardContent className="space-y-1 pt-4 text-[13px]">
                <p className="font-medium">{f.nombre}</p>
                <p className="text-muted-foreground">{f.email}</p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {f.es_menor && <Badge variant="secundario">Mail de un adulto (menor)</Badge>}
                  <span className="text-[11px] text-faint">Registrado el {fechaLarga(f.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
