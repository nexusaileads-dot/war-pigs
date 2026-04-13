export * from './types';
export * from './MockSolanaService';
export * from './SolanaService';

import { MockSolanaService } from './MockSolanaService';
import { SolanaService } from './SolanaService';

// Factory function to get appropriate service
export function getSolanaService() {
  if (process.env.NODE_ENV === 'production' && process.env.SOLANA_PRIVATE_KEY) {
    return new SolanaService();
  }
  return new MockSolanaService();
}
