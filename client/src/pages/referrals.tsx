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

export default function Referrals() {
  const { data: referrals } = useQuery({
    queryKey: ["/api/referrals/1"], // Mock user ID
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/1"], // Mock user ID
  });

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Referrals</h1>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Your Referral Code</h2>
        <div className="flex gap-4">
          <Input
            value={user?.referralCode || ""}
            readOnly
            className="font-mono"
          />
          <Button onClick={() => navigator.clipboard.writeText(user?.referralCode || "")}>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
