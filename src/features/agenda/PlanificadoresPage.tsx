import { FadeIn, PageHeader } from '@/components/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AgendaAnualPage from './AgendaAnualPage'
import PlanificadorPrincipiantePage from './PlanificadorPrincipiantePage'
import PlanificadorSecundariaPage from './PlanificadorSecundariaPage'
import PlanificadorSuperiorPage from './PlanificadorSuperiorPage'

export default function PlanificadoresPage() {
  return (
    <FadeIn>
      <PageHeader
        title="Planificadores y agenda"
        subtitle="Un planificador semanal por nivel, más la agenda anual mes por mes."
      />

      <Tabs defaultValue="nivel1">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="nivel1">Nivel 1</TabsTrigger>
          <TabsTrigger value="nivel2">Nivel 2</TabsTrigger>
          <TabsTrigger value="nivel3">Nivel 3</TabsTrigger>
          <TabsTrigger value="anual">Agenda anual</TabsTrigger>
        </TabsList>

        <TabsContent value="nivel1">
          <PlanificadorPrincipiantePage />
        </TabsContent>
        <TabsContent value="nivel2">
          <PlanificadorSecundariaPage />
        </TabsContent>
        <TabsContent value="nivel3">
          <PlanificadorSuperiorPage />
        </TabsContent>
        <TabsContent value="anual">
          <AgendaAnualPage />
        </TabsContent>
      </Tabs>
    </FadeIn>
  )
}
