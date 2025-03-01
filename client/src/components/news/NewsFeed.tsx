import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { News } from "@shared/schema";

export function NewsFeed() {
  const { data: news } = useQuery<News[]>({
    queryKey: ["/api/news/recommended/1"], // Mock user ID
  });

  if (!news?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No news articles available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {news.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <CardDescription>
                {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
