import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataSourcesList } from "@/components/data-management/data-sources-list"
import { DataSourceSettings } from "@/components/data-management/data-source-settings"
import { CollectionSchedule } from "@/components/data-management/collection-schedule"
import { DataQuality } from "@/components/data-management/data-quality"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Data Management | RepuSense",
  description: "Configure and manage your data sources",
}

export default function DataManagementPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
            <p className="text-muted-foreground">Configure and manage your data sources</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Data Source
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <DataSourcesList />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reddit Data Source</CardTitle>
                <CardDescription>Configure settings for Reddit data collection</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="settings" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="schedule">Collection Schedule</TabsTrigger>
                    <TabsTrigger value="quality">Data Quality</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings">
                    <DataSourceSettings />
                  </TabsContent>

                  <TabsContent value="schedule">
                    <CollectionSchedule />
                  </TabsContent>

                  <TabsContent value="quality">
                    <DataQuality />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
