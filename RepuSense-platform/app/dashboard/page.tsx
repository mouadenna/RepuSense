import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import KpiCards from "@/components/dashboard/kpi-cards"
import SentimentTrends from "@/components/dashboard/sentiment-trends"
import KeyMentions from "@/components/dashboard/key-mentions"
import ActionCenter from "@/components/dashboard/action-center"
import InsightSummary from "@/components/dashboard/insight-summary"
import TopicModeling from "@/components/visualizations/topic-modeling"
import WordCloud from "@/components/visualizations/word-cloud"
import TopicDistribution from "@/components/visualizations/topic-distribution"

export const metadata: Metadata = {
  title: "RepuSense | Tableau de Bord",
  description: "Plateforme de surveillance et d'analyse de l'e-réputation",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* En-tête de la page */}
          <div>
            <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
            <p className="text-muted-foreground">Aperçu de votre e-réputation et des actions recommandées</p>
          </div>

          {/* KPIs */}
          <KpiCards />

          {/* Contenu principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Graphiques et analyses */}
            <div className="lg:col-span-2 space-y-6">
              <SentimentTrends />
              <TopicModeling />
              <TopicDistribution />
            </div>

            {/* Sidebar avec insights et actions */}
            <div className="space-y-6">
              <InsightSummary />
              <WordCloud />
              <ActionCenter />
            </div>
          </div>

          {/* Mentions clés */}
          <KeyMentions />
        </div>
      </main>
    </div>
  )
}
