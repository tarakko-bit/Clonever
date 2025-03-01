import { useQuery } from "@tanstack/react-query";
import { User, Referral } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BulkSendSolana } from "@/components/admin/BulkSendSolana";
import { ReferralList } from "@/components/admin/ReferralList";

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPERADMIN";

  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: referrals, isLoading: loadingReferrals } = useQuery<Referral[]>({
    queryKey: ["/api/admin/referrals"],
  });

  if (loadingUsers || loadingReferrals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {isSuperAdmin && (
          <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
            SuperAdmin
          </div>
        )}
      </div>

      <div className="grid gap-8">
        {isSuperAdmin && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Bulk Send SOL</h2>
            <BulkSendSolana />
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Referral Management</h2>
          <ReferralList referrals={referrals || []} users={users || []} />
        </Card>
      </div>
    </div>
  );
}
