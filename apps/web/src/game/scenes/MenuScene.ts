import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'WAR PIGS', {
      fontSize: '48px',
      color: '#ff6b35'
    }).setOrigin(0.5);
  }
}
