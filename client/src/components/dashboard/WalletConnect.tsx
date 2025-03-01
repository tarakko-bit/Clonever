import { useState, useCallback, useEffect } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Button } from "@/components/ui/button";
import { solanaService } from '@/lib/solana';
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [wallet] = useState(() => new PhantomWalletAdapter());
  const { toast } = useToast();

  useEffect(() => {
    // Initialize wallet
    wallet.connect().catch(console.error);

    return () => {
      wallet.disconnect().catch(console.error);
    };
  }, [wallet]);

  const connectWallet = useCallback(async () => {
    if (!wallet.connected) {
      try {
        await wallet.connect();
        const publicKeyStr = wallet.publicKey?.toString();
        if (publicKeyStr) {
          setPublicKey(publicKeyStr);
          const balance = await solanaService.getBalance(publicKeyStr);
          setBalance(balance);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to Phantom wallet. Please make sure it's installed.",
        });
      }
    }
  }, [wallet, toast]);

  const disconnect = useCallback(async () => {
    try {
      await wallet.disconnect();
      setPublicKey(null);
      setBalance(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [wallet]);

  if (publicKey) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-medium">Balance: {balance?.toFixed(2)} SOL</div>
          <div className="text-muted-foreground text-xs">{publicKey.slice(0, 8)}...</div>
        </div>
        <Button 
          variant="outline" 
          onClick={disconnect}
          className="text-sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connectWallet} className="text-sm">
      Connect Phantom
    </Button>
  );
}