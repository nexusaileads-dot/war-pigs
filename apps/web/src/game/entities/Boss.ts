import Phaser from 'phaser';

export class BossSprite extends Phaser.Physics.Arcade.Sprite {
  id: string;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y, 'boss');
    this.id = id;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
