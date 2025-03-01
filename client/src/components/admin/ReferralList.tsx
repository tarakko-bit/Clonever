import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User, Referral } from "@shared/schema";

interface ReferralListProps {
  referrals: Referral[];
  users: User[];
}

export function ReferralList({ referrals, users }: ReferralListProps) {
  const getUserById = (id: number) => users.find(u => u.id === id);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Referrer</TableHead>
          <TableHead>Referred User</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Solana Wallets</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => {
          const referrer = getUserById(referral.referrerId);
          const referred = getUserById(referral.referredId);

          return (
            <TableRow key={referral.id}>
              <TableCell>{referrer?.username || 'Unknown'}</TableCell>
              <TableCell>{referred?.username || 'Unknown'}</TableCell>
              <TableCell>{referral.points}</TableCell>
              <TableCell>
                <div className="text-xs">
                  <div>Referrer: {referrer?.solanaWallet || 'Not connected'}</div>
                  <div>Referred: {referred?.solanaWallet || 'Not connected'}</div>
                </div>
              </TableCell>
              <TableCell>
                {new Date(referral.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
