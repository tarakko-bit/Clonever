import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTelegramLoginUrl } from "@/lib/telegram";
import type { User } from "@shared/schema";

export function TelegramConnect() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/1"], // Mock user ID
  });

  if (user?.telegramId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telegram Connected</CardTitle>
          <CardDescription>Your account is linked to Telegram</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Telegram ID: {user.telegramId}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Telegram</CardTitle>
        <CardDescription>
          Link your Telegram account to start using your referral code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="font-medium">Your Referral Code: {user?.referralCode}</p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Click the button below to open Telegram</li>
            <li>Start a chat with our bot</li>
            <li>Send the command: /link {user?.referralCode}</li>
          </ol>
        </div>
        <Button asChild className="w-full">
          <a href={getTelegramLoginUrl()} target="_blank" rel="noopener noreferrer">
            Connect with Telegram
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
