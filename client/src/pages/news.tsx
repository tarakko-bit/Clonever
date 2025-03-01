import { NewsFeed } from "@/components/news/NewsFeed";
import { NewsPreferences } from "@/components/news/NewsPreferences";

export default function News() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Crypto News</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <NewsFeed />
        <div className="space-y-8">
          <NewsPreferences />
        </div>
      </div>
    </div>
  );
}
