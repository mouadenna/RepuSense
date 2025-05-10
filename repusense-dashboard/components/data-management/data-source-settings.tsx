import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function DataSourceSettings() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Configure the settings for your Reddit data source. These settings determine what data is collected,
          how it's processed, and what filters are applied.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="source-name">Source Name</Label>
            <Input id="source-name" defaultValue="Reddit" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-type">Source Type</Label>
            <Select defaultValue="social">
              <SelectTrigger id="source-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="news">News Sites</SelectItem>
                <SelectItem value="reviews">Review Sites</SelectItem>
                <SelectItem value="forums">Forums</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Authentication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" defaultValue="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" defaultValue="••••••••••••••••" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Data Collection Parameters</h3>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords & Phrases</Label>
            <Textarea
              id="keywords"
              placeholder="Enter keywords or phrases, one per line"
              defaultValue="brand name
product name
company name
#brandhashtag"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subreddits">Subreddits to Monitor</Label>
              <Textarea
                id="subreddits"
                placeholder="Enter subreddits, one per line"
                defaultValue="r/technology
r/products
r/reviews
r/customerservice"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excluded-terms">Excluded Terms</Label>
              <Textarea
                id="excluded-terms"
                placeholder="Enter terms to exclude, one per line"
                defaultValue="competitor1
competitor2
unrelated_term"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-period">Historical Time Period</Label>
              <Select defaultValue="90days">
                <SelectTrigger id="time-period">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                  <SelectItem value="all">All available data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language Filter</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="all">All languages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Processing Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sentiment-analysis">Sentiment Analysis</Label>
                <p className="text-xs text-muted-foreground">Analyze sentiment of collected mentions</p>
              </div>
              <Switch id="sentiment-analysis" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="topic-modeling">Topic Modeling</Label>
                <p className="text-xs text-muted-foreground">Identify key topics and themes</p>
              </div>
              <Switch id="topic-modeling" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="entity-extraction">Entity Extraction</Label>
                <p className="text-xs text-muted-foreground">Extract people, places, and organizations</p>
              </div>
              <Switch id="entity-extraction" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language-detection">Language Detection</Label>
                <p className="text-xs text-muted-foreground">Automatically detect content language</p>\
