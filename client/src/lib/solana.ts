import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;

// Trace clone addresses
export const TRACE_CLONE_ADDRESS = 'Hu5RJeyYz3wfwQ64y4JENLMVGeoQrnfnGQBFapPGYEp1';

class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_ENDPOINT, 'confirmed');
  }

  async getBalance(publicKey: string): Promise<number> {
    const balance = await this.connection.getBalance(new PublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
  }

  async requestAirdrop(publicKey: string): Promise<string> {
    const signature = await this.connection.requestAirdrop(
      new PublicKey(publicKey),
      LAMPORTS_PER_SOL
    );
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  async transfer(
    fromKeypair: Keypair,
    toPublicKey: string,
    amount: number
  ): Promise<string> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new PublicKey(toPublicKey),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await this.connection.sendTransaction(transaction, [fromKeypair]);
    await this.connection.confirmTransaction(signature);
    return signature;
  }
}

export const solanaService = new SolanaService();
export const POINTS_TO_SOL_RATE = 0.001; // 1000 points = 1 SOL
export const LAMPORTS_PER_SOL = 1000000000; // 1 SOL = 1 billion lamports