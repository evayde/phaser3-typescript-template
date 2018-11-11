import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

const config: GameConfig = {
  title: "test",
  url: "https://github.com/evayde",
  version: "1.0",
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  scene: [MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  backgroundColor: "#000000"
}

class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  new Game(config);
}