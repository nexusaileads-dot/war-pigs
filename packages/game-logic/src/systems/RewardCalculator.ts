export interface RunStats {
  kills: number;
  damageDealt: number;
  damageTaken: number;
  accuracy: number; // 0.0 to 1.0
  timeElapsed: number; // seconds
  wavesCleared: number;
  bossKilled: boolean;
  difficulty: number;
  isPerfectRun: boolean; // no damage taken
}

export interface RewardBreakdown {
  baseReward: number;
  killBonus: number;
  accuracyBonus: number;
  speedBonus: number;
  noDamageBonus: number;
  bossBonus: number;
  difficultyMultiplier: number;
  total: number;
  xpEarned: number;
}

export class RewardCalculator {
  private readonly BASE_PIGS_PER_KILL = 5;
  private readonly ACCURACY_THRESHOLD = 0.8;
  private readonly ACCURACY_BONUS = 50;
  private readonly SPEED_THRESHOLD = 300; // 5 minutes
  private readonly SPEED_BONUS = 100;
  private readonly PERFECT_BONUS = 200;
  private readonly BOSS_BONUS = 500;

  calculateRewards(stats: RunStats): RewardBreakdown {
    // Base calculation
    const baseReward = stats.wavesCleared * 50 * stats.difficulty;
    
    // Kill bonus
    const killBonus = stats.kills * this.BASE_PIGS_PER_KILL;
    
    // Accuracy bonus
    const accuracyBonus = stats.accuracy >= this.ACCURACY_THRESHOLD ? this.ACCURACY_BONUS : 0;
    
    // Speed bonus
    const speedBonus = stats.timeElapsed < this.SPEED_THRESHOLD ? this.SPEED_BONUS : 0;
    
    // No damage bonus
    const noDamageBonus = stats.isPerfectRun ? this.PERFECT_BONUS : 0;
    
    // Boss bonus
    const bossBonus = stats.bossKilled ? this.BOSS_BONUS * stats.difficulty : 0;
    
    // Difficulty multiplier (compound)
    const difficultyMultiplier = 1 + ((stats.difficulty - 1) * 0.1);
    
    // Calculate total before multiplier
    const subtotal = baseReward + killBonus + accuracyBonus + speedBonus + noDamageBonus + bossBonus;
    const total = Math.floor(subtotal * difficultyMultiplier);
    
    // XP calculation
    const xpEarned = Math.floor(
      (stats.kills * 10 + stats.wavesCleared * 100 + (stats.bossKilled ? 500 : 0)) * difficultyMultiplier
    );

    return {
      baseReward,
      killBonus,
      accuracyBonus,
      speedBonus,
      noDamageBonus,
      bossBonus,
      difficultyMultiplier,
      total,
      xpEarned
    };
  }

  // Anti-cheat validation: Check if claimed stats are possible
  validateRunStats(stats: RunStats, maxPossibleKills: number): { valid: boolean; reason?: string } {
    // Check impossible kill counts
    if (stats.kills > maxPossibleKills * 1.5) { // Allow some margin for explosive chain kills
      return { valid: false, reason: 'Kill count exceeds maximum possible' };
    }
    
    // Check impossible damage
    const maxPossibleDamage = maxPossibleKills * 200 * stats.difficulty; // rough estimate
    if (stats.damageDealt > maxPossibleDamage) {
      return { valid: false, reason: 'Damage exceeds maximum possible' };
    }
    
    // Check accuracy bounds
    if (stats.accuracy < 0 || stats.accuracy > 1) {
      return { valid: false, reason: 'Invalid accuracy value' };
    }
    
    // Check negative values
    if (stats.kills < 0 || stats.damageDealt < 0 || stats.damageTaken < 0) {
      return { valid: false, reason: 'Negative values detected' };
    }
    
    return { valid: true };
  }
}
