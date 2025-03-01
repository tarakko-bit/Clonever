import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPoints } from "@/lib/telegram";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, Referral } from "@shared/schema";

export default function Referrals() {
  const { toast } = useToast();

  const { data: referrals } = useQuery<Referral[]>({
    queryKey: ["/api/referrals/1"], // Mock user ID
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/1"], // Mock user ID
  });

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Referral code copied!",
        description: "Share this code with your friends to earn points.",
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Referrals</h1>

      <div className="rounded-lg border p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Your Referral Code</h2>
          <p className="text-sm text-muted-foreground">
            Share this code with friends to earn points when they sign up
          </p>
        </div>
        <div className="flex gap-4">
          <Input
            value={user?.referralCode || ""}
            readOnly
            className="font-mono text-lg"
          />
          <Button onClick={handleCopyCode} className="min-w-[100px]">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Points Earned</TableHead>
              <TableHead>Date Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals?.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.referredId}</TableCell>
                <TableCell>{formatPoints(referral.points)}</TableCell>
                <TableCell>
                  {new Date(referral.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {!referrals?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  No referrals yet. Share your code to start earning points!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}