import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(0x4caf50);
    graphics.fillCircle(16, 16, 16);
    graphics.generateTexture('player', 32, 32);
    
    graphics.clear();
    graphics.fillStyle(0xf44336);
    graphics.fillTriangle(16, 0, 0, 32, 32, 32);
    graphics.generateTexture('enemy', 32, 32);
    
    graphics.clear();
    graphics.fillStyle(0x9c27b0);
    graphics.fillCircle(32, 32, 32);
    graphics.generateTexture('boss', 64, 64);
    
    graphics.clear();
    graphics.fillStyle(0xffeb3b);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('bullet', 8, 8);
  }

  create() {
    this.scene.start('GameScene');
  }
}
