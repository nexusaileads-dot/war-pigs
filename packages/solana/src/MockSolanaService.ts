import { 
  SolanaServiceInterface, 
  WalletInfo, 
  RewardDistribution, 
  TransactionResult 
} from './types';

/**
 * Mock implementation for development/testing.
 * Simulates blockchain delays and random failures for realistic testing.
 * Replace with real SolanaService in production.
 */
export class MockSolanaService implements SolanaServiceInterface {
  private mockWallets: Map<string, number> = new Map();
  private mockTransactions: Map<string, TransactionResult> = new Map();

  async createWallet(): Promise<WalletInfo> {
    // Simulate network delay
    await this.delay(500);
    
    const address = `mock_${Math.random().toString(36).substring(2, 15)}`;
    this.mockWallets.set(address, 0);
    
    return {
      address,
      balance: 0,
    };
  }

  async getBalance(address: string): Promise<number> {
    await this.delay(300);
    return this.mockWallets.get(address) || 0;
  }

  async distributeRewards(distribution: RewardDistribution): Promise<TransactionResult> {
    await this.delay(1000 + Math.random() * 2000); // 1-3s delay
    
    // Simulate 5% failure rate for testing retry logic
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Network congestion - retry suggested',
      };
    }

    const currentBalance = this.mockWallets.get(distribution.recipientAddress) || 0;
    this.mockWallets.set(distribution.recipientAddress, currentBalance + distribution.amount);
    
    const signature = `tx_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      success: true,
      signature,
      confirmationTime: Date.now(),
    };
  }

  validateAddress(address: string): boolean {
    // Basic validation - real implementation would check base58 encoding
    return address.length > 30 && address.length < 50;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper for testing - get all mock balances
  getMockLedger(): Record<string, number> {
    return Object.fromEntries(this.mockWallets);
  }
}
