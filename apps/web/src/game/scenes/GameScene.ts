import Phaser from 'phaser';
import { PigPlayer } from '../entities/PigPlayer';
import { apiClient } from '../../api/client';

export class GameScene extends Phaser.Scene {
  player!: PigPlayer;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: any;
  projectiles!: Phaser.Physics.Arcade.Group;
  lastShotTime: number = 0;
  kills: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.player = new PigPlayer(this, 800, 600);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.projectiles = this.physics.add.group({ defaultKey: 'bullet', maxSize: 50 });

    this.input.on('pointerdown', () => this.shoot());
  }

  update(time: number) {
    this.player.updateMovement(this.cursors, this.wasd, 200);
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
    this.player.setRotation(angle);
  }

  shoot() {
    const now = this.time.now;
    if (now - this.lastShotTime < 250) return;
    this.lastShotTime = now;

    const bullet = this.projectiles.get(this.player.x, this.player.y);
    if (bullet) {
      bullet.setActive(true).setVisible(true);
      this.physics.velocityFromRotation(this.player.rotation, 600, bullet.body.velocity);
      this.time.delayedCall(1000, () => { bullet.setActive(false).setVisible(false).body.stop(); });
    }
  }

  async finishGame() {
    const runData = JSON.parse(sessionStorage.getItem('currentRun') || '{}');
    if (!runData.run) return;

    await apiClient.post('/api/game/complete', {
      runId: runData.run.id,
      sessionToken: runData.sessionToken,
      clientHash: 'validated',
      stats: {
        kills: this.kills,
        damageDealt: this.kills * 40,
        damageTaken: 0,
        accuracy: 0.8,
        timeElapsed: 120,
        wavesCleared: 3,
        bossKilled: true
      }
    });

    window.dispatchEvent(new CustomEvent('WAR_PIGS_EVENT', { detail: { type: 'STATE_CHANGE', state: 'victory' } }));
  }
      }
