import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Bienvenida } from '@/features/estudiantes/SeleccionarEstudiantePage'
import { Button } from '@/components/ui/button'

/**
 * Vista previa de la pantalla de bienvenida / selector de estudiante,
 * accesible desde Ajustes sin crear ni seleccionar nada de verdad
 * (`preview`): una vez que ya hay un estudiante activo, la app no vuelve a
 * mostrar esa pantalla sola — esta ruta la muestra igual, en modo inerte.
 */
export default function BienvenidaPreviewPage() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="/ajustes">
          <ArrowLeft /> Volver a Ajustes
        </Link>
      </Button>
      <Bienvenida preview />
    </div>
  )
}
