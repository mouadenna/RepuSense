import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react"

export function RelatedMentions() {
  const mentions = [
    {
      id: 1,
      platform: "Reddit",
      username: "frustrated_customer",
      date: "July 12, 2023",
      content:
        "I've been waiting for 3 days to get a response from customer service. This is absolutely unacceptable for a company of this size. Will be taking my business elsewhere.",
      sentiment: "negative",
      upvotes: 45,
      replies: 12,
    },
    {
      id: 2,
      platform: "Twitter",
      username: "sarah_j",
      date: "July 10, 2023",
      content: "Hey @company, it's been 48 hours and still no response to my support ticket #12345. Is anyone there?",
      sentiment: "negative",
      likes: 23,
      retweets: 5,
    },
    {
      id: 3,
      platform: "Trustpilot",
      username: "Michael T.",
      date: "July 8, 2023",
      content:
        "Great products but terrible customer service. Took them over a week to respond to a simple question about my order. One star for response time.",
      sentiment: "mixed",
      rating: 2,
    },
    {
      id: 4,
      platform: "Facebook",
      username: "Jennifer Smith",
      date: "July 7, 2023",
      content:
        "I love your products but I'm really disappointed with how long it takes to get a response from your team. 24+ hours is too long in today's world.",
      sentiment: "mixed",
      likes: 34,
      comments: 8,
    },
    {
      id: 5,
      platform: "Reddit",
      username: "tech_enthusiast",
      date: "July 5, 2023",
      content:
        "Their customer service is a joke. Waited 3 days for a response only to get a generic template that didn't even address my issue. Had to follow up again and still waiting...",
      sentiment: "negative",
      upvotes: 67,
      replies: 15,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          A selection of recent mentions related to this issue from various platforms. These mentions provide context
          and customer sentiment regarding the slow response time problem.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="reviews">Review Sites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mentions.map((mention) => (
            <Card key={mention.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={mention.username} />
                    <AvatarFallback>{mention.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{mention.username}</span>
                        <Badge variant="outline" className="text-xs">
                          {mention.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{mention.date}</span>
                      </div>
                    </div>
                    <p className="text-sm">{mention.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {mention.upvotes && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{mention.upvotes}</span>
                          </div>
                        )}
                        {mention.likes && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{mention.likes}</span>
                          </div>
                        )}
                        {mention.replies && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{mention.replies}</span>
                          </div>
                        )}
                        {mention.comments && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{mention.comments}</span>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          mention.sentiment === "negative"
                            ? "destructive"
                            : mention.sentiment === "positive"
                              ? "default"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {mention.sentiment}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            Load more mentions
          </Button>
        </TabsContent>

        <TabsContent value="reddit" className="space-y-4">
          {mentions
            .filter((mention) => mention.platform === "Reddit")
            .map((mention) => (
              <Card key={mention.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={mention.username} />
                      <AvatarFallback>{mention.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{mention.username}</span>
                          <Badge variant="outline" className="text-xs">
                            {mention.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{mention.date}</span>
                        </div>
                      </div>
                      <p className="text-sm">{mention.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {mention.upvotes && (
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{mention.upvotes}</span>
                            </div>
                          )}
                          {mention.replies && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{mention.replies}</span>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            mention.sentiment === "negative"
                              ? "destructive"
                              : mention.sentiment === "positive"
                                ? "default"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {mention.sentiment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="twitter" className="space-y-4">
          {mentions
            .filter((mention) => mention.platform === "Twitter")
            .map((mention) => (
              <Card key={mention.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={mention.username} />
                      <AvatarFallback>{mention.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{mention.username}</span>
                          <Badge variant="outline" className="text-xs">
                            {mention.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{mention.date}</span>
                        </div>
                      </div>
                      <p className="text-sm">{mention.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {mention.likes && (
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{mention.likes}</span>
                            </div>
                          )}
                          {mention.retweets && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{mention.retweets} RT</span>
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            mention.sentiment === "negative"
                              ? "destructive"
                              : mention.sentiment === "positive"
                                ? "default"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {mention.sentiment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {mentions
            .filter((mention) => mention.platform === "Trustpilot")
            .map((mention) => (
              <Card key={mention.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={mention.username} />
                      <AvatarFallback>{mention.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{mention.username}</span>
                          <Badge variant="outline" className="text-xs">
                            {mention.platform}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{mention.date}</span>
                        </div>
                      </div>
                      <p className="text-sm">{mention.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Rating: </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < mention.rating ? "text-amber-500" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant={
                            mention.sentiment === "negative"
                              ? "destructive"
                              : mention.sentiment === "positive"
                                ? "default"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {mention.sentiment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
