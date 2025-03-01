import { useQuery } from "@tanstack/react-query";
import { Coins, Users, Wallet } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPoints, getTelegramLoginUrl } from "@/lib/telegram";
import type { User, Referral } from "@shared/schema";

interface ConversionRate {
  rate: number;
}

export default function Home() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/1"], // Mock user ID
  });

  const { data: rate } = useQuery<ConversionRate>({
    queryKey: ["/api/convert/rate"],
  });

  const { data: referrals } = useQuery<Referral[]>({
    queryKey: ["/api/referrals/1"], // Mock user ID
  });

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Points"
          value={user?.points ? formatPoints(user.points) : "0.00"}
          icon={<Coins className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="USD Value"
          value={
            user?.points && rate?.rate
              ? formatPoints(parseFloat(user.points) * rate.rate)
              : "$0.00"
          }
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Referrals"
          value={referrals?.length?.toString() || "0"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {!user?.telegramId && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Telegram</CardTitle>
            <CardDescription>
              Link your Telegram account to manage your points and receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href={getTelegramLoginUrl()} target="_blank" rel="noopener noreferrer">
                Connect with Telegram
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <ConversionChart />
    </div>
  );
}