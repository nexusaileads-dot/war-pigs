import { Enemy, EnemyTemplate } from '../entities/Enemy';

export interface WaveConfig {
  waveNumber: number;
  enemies: Array<{
    template: EnemyTemplate;
    count: number;
    spawnDelay: number; // ms between spawns
  }>;
  duration: number; // ms, if not cleared by then, fail or next wave
}

export class WaveSystem {
  currentWave: number = 0;
  waves: WaveConfig[];
  activeEnemies: Map<string, Enemy> = new Map();
  spawnQueue: Array<{ enemy: Enemy; spawnTime: number }> = [];
  waveStartTime: number = 0;
  isWaveActive: boolean = false;
  isComplete: boolean = false;

  constructor(waves: WaveConfig[]) {
    this.waves = waves;
  }

  startWave(waveNumber: number): void {
    if (waveNumber > this.waves.length) {
      this.isComplete = true;
      return;
    }
    
    this.currentWave = waveNumber;
    this.waveStartTime = Date.now();
    this.isWaveActive = true;
    
    const config = this.waves[waveNumber - 1];
    let delayAccum = 0;
    
    // Build spawn queue
    config.enemies.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        const id = `enemy_${waveNumber}_${group.template.id}_${i}_${Date.now()}`;
        const enemy = new Enemy(
          id,
          group.template,
          0, // x set at spawn time
          0  // y set at spawn time
        );
        
        this.spawnQueue.push({
          enemy,
          spawnTime: Date.now() + delayAccum
        });
        delayAccum += group.spawnDelay;
      }
    });
  }

  update(currentTime: number, spawnCallback: (enemy: Enemy) => { x: number; y: number }): void {
    if (!this.isWaveActive) return;

    // Process spawns
    const toSpawn = this.spawnQueue.filter(q => q.spawnTime <= currentTime);
    toSpawn.forEach(q => {
      const pos = spawnCallback(q.enemy);
      q.enemy.x = pos.x;
      q.enemy.y = pos.y;
      this.activeEnemies.set(q.enemy.id, q.enemy);
    });
    
    this.spawnQueue = this.spawnQueue.filter(q => q.spawnTime > currentTime);

    // Check wave completion
    if (this.spawnQueue.length === 0 && this.activeEnemies.size === 0) {
      this.isWaveActive = false;
      if (this.currentWave >= this.waves.length) {
        this.isComplete = true;
      }
    }

    // Check timeout
    const config = this.waves[this.currentWave - 1];
    if (currentTime - this.waveStartTime > config.duration) {
      // Wave timeout - could trigger fail condition or force next wave
      this.isWaveActive = false;
    }
  }

  removeEnemy(enemyId: string): void {
    this.activeEnemies.delete(enemyId);
  }

  getActiveEnemies(): Enemy[] {
    return Array.from(this.activeEnemies.values());
  }

  reset(): void {
    this.currentWave = 0;
    this.activeEnemies.clear();
    this.spawnQueue = [];
    this.isWaveActive = false;
    this.isComplete = false;
  }
                    }
  
