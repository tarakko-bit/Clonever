import { useState, useCallback } from 'react';
import { Keypair } from '@solana/web3.js';
import { Button } from "@/components/ui/button";
import { solanaService } from '@/lib/solana';

export function WalletConnect() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const generateWallet = useCallback(async () => {
    const wallet = Keypair.generate();
    const publicKeyStr = wallet.publicKey.toString();
    setPublicKey(publicKeyStr);

    // Request airdrop for testing
    try {
      await solanaService.requestAirdrop(publicKeyStr);
      const balance = await solanaService.getBalance(publicKeyStr);
      setBalance(balance);
    } catch (error) {
      console.error('Error getting SOL balance:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setBalance(null);
  }, []);

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
    <Button onClick={generateWallet} className="text-sm">
      Connect Wallet
    </Button>
  );
}