import { useQuery } from "@tanstack/react-query";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatPoints, calculateUsdValue } from "@/lib/telegram";

export default function Convert() {
  const [amount, setAmount] = useState("");

  const { data: rate } = useQuery({
    queryKey: ["/api/convert/rate"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/1"], // Mock user ID
  });

  const points = parseFloat(amount) || 0;
  const usdValue = rate?.rate ? points * rate.rate : 0;

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Convert Points</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {user?.points ? formatPoints(user.points) : "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              1 Point = ${rate?.rate || "0.00"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Convert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Points to Convert</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">You will receive:</p>
            <p className="text-2xl font-bold">{calculateUsdValue(points, rate?.rate || 0)}</p>
          </div>

          <Button className="w-full" size="lg">
            Convert Points
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
