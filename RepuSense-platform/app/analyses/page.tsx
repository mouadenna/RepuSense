import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter, InfoIcon, Share } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "RepuSense | Analyses",
  description: "Analyses approfondies de votre e-réputation",
}

// Mock data for sentiment trends
const sentimentTrends = [
  { date: "2023-01", positive: 65, neutral: 25, negative: 10 },
  { date: "2023-02", positive: 60, neutral: 28, negative: 12 },
  { date: "2023-03", positive: 62, neutral: 26, negative: 12 },
  { date: "2023-04", positive: 58, neutral: 27, negative: 15 },
  { date: "2023-05", positive: 63, neutral: 24, negative: 13 },
  { date: "2023-06", positive: 67, neutral: 22, negative: 11 },
  { date: "2023-07", positive: 70, neutral: 20, negative: 10 },
  { date: "2023-08", positive: 72, neutral: 18, negative: 10 },
  { date: "2023-09", positive: 68, neutral: 22, negative: 10 },
  { date: "2023-10", positive: 65, neutral: 25, negative: 10 },
  { date: "2023-11", positive: 67, neutral: 23, negative: 10 },
  { date: "2023-12", positive: 70, neutral: 20, negative: 10 },
]

// Mock data for topic distribution
const topicDistribution = [
  { name: "Service client", value: 35, sentiment: 0.68 },
  { name: "Qualité produit", value: 25, sentiment: 0.72 },
  { name: "Prix", value: 15, sentiment: 0.45 },
  { name: "Livraison", value: 10, sentiment: 0.38 },
  { name: "Site web", value: 8, sentiment: 0.61 },
  { name: "Application", value: 7, sentiment: 0.58 },
]

// Mock data for influencer impact
const influencerImpact = [
  { name: "Tech Expert", followers: 450000, mentions: 12, sentiment: 0.35, impact: 85 },
  { name: "Product Review", followers: 320000, mentions: 8, sentiment: 0.65, impact: 75 },
  { name: "Digital Trends", followers: 280000, mentions: 5, sentiment: 0.72, impact: 65 },
  { name: "Consumer Guide", followers: 210000, mentions: 7, sentiment: 0.48, impact: 60 },
  { name: "Tech News", followers: 180000, mentions: 4, sentiment: 0.62, impact: 55 },
]

// Mock data for topic trends
const topicTrends = [
  {
    name: "Service client",
    data: [
      { date: "2023-01", value: 65 },
      { date: "2023-02", value: 68 },
      { date: "2023-03", value: 62 },
      { date: "2023-04", value: 64 },
      { date: "2023-05", value: 70 },
      { date: "2023-06", value: 68 },
    ],
  },
  {
    name: "Qualité produit",
    data: [
      { date: "2023-01", value: 72 },
      { date: "2023-02", value: 70 },
      { date: "2023-03", value: 74 },
      { date: "2023-04", value: 75 },
      { date: "2023-05", value: 72 },
      { date: "2023-06", value: 76 },
    ],
  },
  {
    name: "Prix",
    data: [
      { date: "2023-01", value: 45 },
      { date: "2023-02", value: 48 },
      { date: "2023-03", value: 42 },
      { date: "2023-04", value: 44 },
      { date: "2023-05", value: 46 },
      { date: "2023-06", value: 45 },
    ],
  },
  {
    name: "Livraison",
    data: [
      { date: "2023-01", value: 38 },
      { date: "2023-02", value: 36 },
      { date: "2023-03", value: 40 },
      { date: "2023-04", value: 42 },
      { date: "2023-05", value: 45 },
      { date: "2023-06", value: 48 },
    ],
  },
]

// Mock data for competitor comparison
const competitorComparison = [
  { name: "Votre Entreprise", sentiment: 68, mentions: 1482, reach: 245000 },
  { name: "Concurrent A", sentiment: 62, mentions: 1250, reach: 210000 },
  { name: "Concurrent B", sentiment: 70, mentions: 980, reach: 180000 },
  { name: "Concurrent C", sentiment: 58, mentions: 1650, reach: 320000 },
]

// Get color based on sentiment
function getSentimentColor(sentiment: number) {
  if (sentiment >= 0.65) return "#3b82f6" // Blue for very positive
  if (sentiment >= 0.5) return "#60a5fa" // Light blue for positive
  if (sentiment >= 0.4) return "#94a3b8" // Gray for neutral
  if (sentiment >= 0.25) return "#f87171" // Light red for negative
  return "#ef4444" // Red for very negative
}

export default function AnalysesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* En-tête de la page */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Analyses</h1>
              <p className="text-muted-foreground">Analyses approfondies de votre e-réputation</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="mr-2 h-4 w-4" />
                Période
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Share className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </div>
          </div>

          {/* Onglets d'analyse */}
          <Tabs defaultValue="sentiment">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="topics">Sujets</TabsTrigger>
              <TabsTrigger value="influencers">Influenceurs</TabsTrigger>
              <TabsTrigger value="competitors">Concurrents</TabsTrigger>
            </TabsList>

            {/* Analyse de sentiment */}
            <TabsContent value="sentiment" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>Évolution du sentiment</CardTitle>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Ce graphique montre l'évolution du sentiment des mentions de votre marque au fil du
                                temps, réparti entre positif, neutre et négatif.
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription>Tendance du sentiment sur les 12 derniers mois</CardDescription>
                    </div>
                    <Select defaultValue="12m">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3m">3 mois</SelectItem>
                        <SelectItem value="6m">6 mois</SelectItem>
                        <SelectItem value="12m">12 mois</SelectItem>
                        <SelectItem value="all">Tout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sentimentTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, ""]} labelFormatter={(label) => `${label}`} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="positive"
                          name="Positif"
                          stackId="1"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorPositive)"
                        />
                        <Area
                          type="monotone"
                          dataKey="neutral"
                          name="Neutre"
                          stackId="1"
                          stroke="#94a3b8"
                          fillOpacity={1}
                          fill="url(#colorNeutral)"
                        />
                        <Area
                          type="monotone"
                          dataKey="negative"
                          name="Négatif"
                          stackId="1"
                          stroke="#ef4444"
                          fillOpacity={1}
                          fill="url(#colorNegative)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition du sentiment</CardTitle>
                    <CardDescription>Répartition actuelle du sentiment des mentions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Positif", value: 70 },
                              { name: "Neutre", value: 20 },
                              { name: "Négatif", value: 10 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#94a3b8" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, ""]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment par source</CardTitle>
                    <CardDescription>Répartition du sentiment selon les sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Twitter", positive: 65, neutral: 25, negative: 10 },
                            { name: "Facebook", positive: 60, neutral: 30, negative: 10 },
                            { name: "Instagram", positive: 75, neutral: 20, negative: 5 },
                            { name: "Blogs", positive: 55, neutral: 30, negative: 15 },
                            { name: "Forums", positive: 40, neutral: 35, negative: 25 },
                          ]}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}%`, ""]} />
                          <Legend />
                          <Bar dataKey="positive" name="Positif" stackId="a" fill="#3b82f6" />
                          <Bar dataKey="neutral" name="Neutre" stackId="a" fill="#94a3b8" />
                          <Bar dataKey="negative" name="Négatif" stackId="a" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analyse des sujets */}
            <TabsContent value="topics" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution des sujets</CardTitle>
                    <CardDescription>Répartition des mentions par sujet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topicDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {topicDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value}% des mentions`,
                              `${name} (Sentiment: ${(props.payload.sentiment * 100).toFixed(0)}%)`,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment par sujet</CardTitle>
                    <CardDescription>Répartition du sentiment pour chaque sujet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Service client", positive: 68, neutral: 22, negative: 10 },
                            { name: "Qualité produit", positive: 72, neutral: 18, negative: 10 },
                            { name: "Prix", positive: 45, neutral: 30, negative: 25 },
                            { name: "Livraison", positive: 38, neutral: 32, negative: 30 },
                            { name: "Site web", positive: 61, neutral: 29, negative: 10 },
                          ]}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}%`, ""]} />
                          <Legend />
                          <Bar dataKey="positive" name="Positif" stackId="a" fill="#3b82f6" />
                          <Bar dataKey="neutral" name="Neutre" stackId="a" fill="#94a3b8" />
                          <Bar dataKey="negative" name="Négatif" stackId="a" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution des sujets</CardTitle>
                  <CardDescription>Tendance du sentiment par sujet au fil du temps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          type="category"
                          allowDuplicatedCategory={false}
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                        <Legend />
                        {topicTrends.map((s) => (
                          <Line
                            key={s.name}
                            data={s.data}
                            type="monotone"
                            dataKey="value"
                            name={s.name}
                            stroke={getSentimentColor(
                              s.name === "Service client"
                                ? 0.68
                                : s.name === "Qualité produit"
                                  ? 0.72
                                  : s.name === "Prix"
                                    ? 0.45
                                    : 0.38,
                            )}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analyse des influenceurs */}
            <TabsContent value="influencers" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Impact des influenceurs</CardTitle>
                  <CardDescription>Analyse de l'impact des influenceurs sur votre e-réputation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={influencerImpact} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#10b981"
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="mentions" name="Mentions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="impact" name="Impact (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment des influenceurs</CardTitle>
                    <CardDescription>Répartition du sentiment des mentions par influenceur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={influencerImpact}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis
                            type="number"
                            domain={[0, 1]}
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${(value * 100).toFixed(0)}%`, "Sentiment"]} />
                          <Bar
                            dataKey="sentiment"
                            name="Sentiment"
                            radius={[0, 4, 4, 0]}
                            label={{ position: "right", formatter: (value) => `${(value * 100).toFixed(0)}%` }}
                          >
                            {influencerImpact.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Portée des influenceurs</CardTitle>
                    <CardDescription>Nombre d'abonnés par influenceur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={influencerImpact} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis
                            tickFormatter={(value) =>
                              value >= 1000000
                                ? `${(value / 1000000).toFixed(1)}M`
                                : value >= 1000
                                  ? `${(value / 1000).toFixed(0)}K`
                                  : value
                            }
                          />
                          <Tooltip
                            formatter={(value) =>
                              value >= 1000000
                                ? [`${(value / 1000000).toFixed(1)}M`, "Abonnés"]
                                : value >= 1000
                                  ? [`${(value / 1000).toFixed(0)}K`, "Abonnés"]
                                  : [value, "Abonnés"]
                            }
                          />
                          <Bar dataKey="followers" name="Abonnés" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analyse des concurrents */}
            <TabsContent value="competitors" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison avec les concurrents</CardTitle>
                  <CardDescription>
                    Analyse comparative de votre e-réputation par rapport à vos concurrents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={competitorComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#10b981"
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="mentions" name="Mentions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar
                          yAxisId="right"
                          dataKey="sentiment"
                          name="Sentiment (%)"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Portée comparative</CardTitle>
                    <CardDescription>Comparaison de la portée des mentions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={competitorComparison} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis
                            tickFormatter={(value) =>
                              value >= 1000000
                                ? `${(value / 1000000).toFixed(1)}M`
                                : value >= 1000
                                  ? `${(value / 1000).toFixed(0)}K`
                                  : value
                            }
                          />
                          <Tooltip
                            formatter={(value) =>
                              value >= 1000000
                                ? [`${(value / 1000000).toFixed(1)}M`, "Portée"]
                                : value >= 1000
                                  ? [`${(value / 1000).toFixed(0)}K`, "Portée"]
                                  : [value, "Portée"]
                            }
                          />
                          <Bar dataKey="reach" name="Portée" fill="#6366f1" radius={[4, 4, 0, 0]}>
                            {competitorComparison.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.name === "Votre Entreprise" ? "#3b82f6" : "#6366f1"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analyse SWOT</CardTitle>
                    <CardDescription>Forces, faiblesses, opportunités et menaces</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50">
                        <h3 className="mb-2 font-medium text-blue-700 dark:text-blue-300">Forces</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Sentiment global supérieur à Concurrent A et C</li>
                          <li>• Forte présence sur Instagram</li>
                          <li>• Excellente perception du service client</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/50">
                        <h3 className="mb-2 font-medium text-red-700 dark:text-red-300">Faiblesses</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Perception négative des délais de livraison</li>
                          <li>• Moins de mentions que Concurrent C</li>
                          <li>• Faible présence sur les forums</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/50">
                        <h3 className="mb-2 font-medium text-green-700 dark:text-green-300">Opportunités</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Amélioration du service de livraison</li>
                          <li>• Collaboration avec des influenceurs</li>
                          <li>• Développement de la présence sur les forums</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/50">
                        <h3 className="mb-2 font-medium text-amber-700 dark:text-amber-300">Menaces</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Concurrent B a un meilleur sentiment global</li>
                          <li>• Concurrent C a une portée plus importante</li>
                          <li>• Critiques sur les prix par rapport à la concurrence</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
