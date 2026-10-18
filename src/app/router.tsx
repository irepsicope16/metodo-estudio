import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

// Hash router: funciona en hosting estático (GitHub Pages) sin config de servidor.
// Sin login ni roles: la app es de un solo usuario local, se entra directo.

const InicioPage = lazy(() => import('@/features/home/InicioPage'))
const BienvenidaPreviewPage = lazy(() => import('@/features/home/BienvenidaPreviewPage'))
const AutoperfilPage = lazy(() => import('@/features/autoperfil/AutoperfilPage'))
const BibliotecaPage = lazy(() => import('@/features/biblioteca/BibliotecaPage'))
const ActividadesPage = lazy(() => import('@/features/actividades/ActividadesPage'))
const AgendaPage = lazy(() => import('@/features/agenda/AgendaPage'))
const AgendaAnualPage = lazy(() => import('@/features/agenda/AgendaAnualPage'))
const PlanificadorPrincipiantePage = lazy(() => import('@/features/agenda/PlanificadorPrincipiantePage'))
const PlanificadorSecundariaPage = lazy(() => import('@/features/agenda/PlanificadorSecundariaPage'))
const PlanificadorSuperiorPage = lazy(() => import('@/features/agenda/PlanificadorSuperiorPage'))
const PlanificadoresPage = lazy(() => import('@/features/agenda/PlanificadoresPage'))
const HerramientasPage = lazy(() => import('@/features/herramientas/HerramientasPage'))
const CronometroPage = lazy(() => import('@/features/herramientas/CronometroPage'))
const MapasPage = lazy(() => import('@/features/herramientas/MapasPage'))
const FichasPage = lazy(() => import('@/features/herramientas/FichasPage'))
const EvaluacionPage = lazy(() => import('@/features/herramientas/EvaluacionPage'))
const MemotestPage = lazy(() => import('@/features/herramientas/MemotestPage'))
const CuadrosComparativosPage = lazy(() => import('@/features/herramientas/CuadrosComparativosPage'))
const LineasTiempoPage = lazy(() => import('@/features/herramientas/LineasTiempoPage'))
const DiarioPage = lazy(() => import('@/features/herramientas/DiarioPage'))
const GuiaTextosPage = lazy(() => import('@/features/herramientas/GuiaTextosPage'))
const HorarioCursadaPage = lazy(() => import('@/features/herramientas/HorarioCursadaPage'))
const DistribucionActividadesPage = lazy(() => import('@/features/herramientas/DistribucionActividadesPage'))
const ProgresoPage = lazy(() => import('@/features/progreso/ProgresoPage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))
const PrintAcentuacionPage = lazy(() => import('@/features/print/PrintAcentuacionPage'))
const PrintPasosEstudioPage = lazy(() => import('@/features/print/PrintPasosEstudioPage'))
const PrintFichasPage = lazy(() => import('@/features/print/PrintFichasPage'))
const PrintMapaPage = lazy(() => import('@/features/print/PrintMapaPage'))
const PrintCuadroPage = lazy(() => import('@/features/print/PrintCuadroPage'))
const PrintLineaTiempoPage = lazy(() => import('@/features/print/PrintLineaTiempoPage'))
const PrivacidadPage = lazy(() => import('@/features/legal/PrivacidadPage'))

function Page({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center text-sm text-faint">Cargando…</div>}>
      {children}
    </Suspense>
  )
}

export const router = createHashRouter([
  { path: '/print/acentuacion', element: <Page><PrintAcentuacionPage /></Page> },
  { path: '/print/pasos-estudio', element: <Page><PrintPasosEstudioPage /></Page> },
  { path: '/print/fichas', element: <Page><PrintFichasPage /></Page> },
  { path: '/print/mapa/:id', element: <Page><PrintMapaPage /></Page> },
  { path: '/print/cuadro/:id', element: <Page><PrintCuadroPage /></Page> },
  { path: '/print/linea-tiempo/:id', element: <Page><PrintLineaTiempoPage /></Page> },
  { path: '/privacidad', element: <Page><PrivacidadPage /></Page> },
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Page><InicioPage /></Page> },
      { path: '/bienvenida', element: <Page><BienvenidaPreviewPage /></Page> },
      { path: '/autoperfil', element: <Page><AutoperfilPage /></Page> },
      { path: '/biblioteca', element: <Page><BibliotecaPage /></Page> },
      { path: '/actividades', element: <Page><ActividadesPage /></Page> },
      { path: '/agenda', element: <Page><AgendaPage /></Page> },
      { path: '/planificadores', element: <Page><PlanificadoresPage /></Page> },
      { path: '/herramientas', element: <Page><HerramientasPage /></Page> },
      { path: '/herramientas/cronometro', element: <Page><CronometroPage /></Page> },
      { path: '/herramientas/mapas', element: <Page><MapasPage /></Page> },
      { path: '/herramientas/fichas', element: <Page><FichasPage /></Page> },
      { path: '/herramientas/evaluacion', element: <Page><EvaluacionPage /></Page> },
      { path: '/herramientas/memotest', element: <Page><MemotestPage /></Page> },
      { path: '/herramientas/cuadros', element: <Page><CuadrosComparativosPage /></Page> },
      { path: '/herramientas/lineas-tiempo', element: <Page><LineasTiempoPage /></Page> },
      { path: '/herramientas/diario', element: <Page><DiarioPage /></Page> },
      { path: '/herramientas/guia-textos', element: <Page><GuiaTextosPage /></Page> },
      { path: '/herramientas/horario-cursada', element: <Page><HorarioCursadaPage /></Page> },
      { path: '/herramientas/distribucion-actividades', element: <Page><DistribucionActividadesPage /></Page> },
      { path: '/herramientas/agenda-anual', element: <Page><AgendaAnualPage /></Page> },
      { path: '/herramientas/planificador-principiante', element: <Page><PlanificadorPrincipiantePage /></Page> },
      { path: '/herramientas/planificador-secundaria', element: <Page><PlanificadorSecundariaPage /></Page> },
      { path: '/herramientas/planificador-superior', element: <Page><PlanificadorSuperiorPage /></Page> },
      { path: '/progreso', element: <Page><ProgresoPage /></Page> },
      { path: '/ajustes', element: <Page><SettingsPage /></Page> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
