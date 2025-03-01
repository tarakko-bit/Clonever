import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function BulkSendSolana() {
  const [recipients, setRecipients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const transactions = recipients
        .split("\n")
        .map(line => {
          const [address, amount] = line.split(",").map(s => s.trim());
          return { address, amount: parseFloat(amount) };
        })
        .filter(tx => tx.address && !isNaN(tx.amount));

      await apiRequest("POST", "/api/admin/bulk-send", { transactions });
      
      toast({
        title: "Success",
        description: "Bulk send initiated successfully",
      });
      
      setRecipients("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process bulk send",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Enter recipients (one per line) in format: address,amount&#10;Example:&#10;Hu5RJeyYz3wfwQ64y4JENLMVGeoQrnfnGQBFapPGYEp1,1.5"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          rows={10}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Send SOL"}
      </Button>
    </form>
  );
}
