import Phaser from 'phaser';

export class PigPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  updateMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasd: any, speed: number) {
    let vx = 0;
    let vy = 0;
    if (cursors.left.isDown || wasd.left.isDown) vx = -speed;
    if (cursors.right.isDown || wasd.right.isDown) vx = speed;
    if (cursors.up.isDown || wasd.up.isDown) vy = -speed;
    if (cursors.down.isDown || wasd.down.isDown) vy = speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }
    this.setVelocity(vx, vy);
  }
}
