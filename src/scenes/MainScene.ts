import { Scene, Physics, Input, Math, GameObjects } from 'phaser';

export class MainScene extends Scene {
  private player!: Physics.Arcade.Sprite;
  private stars!: Physics.Arcade.Group;
  private bombs!: Physics.Arcade.Group;
  private platforms!: Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private scoreText!: GameObjects.Text;

  private score = 0;
  private gameover = false;

  constructor() {
    super('MainScene');
  }

  preload(){
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }

  update() {
    if (this.cursors.left && this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right && this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } 
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up && this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate((child: any) => {
      child.setBounceY(Math.FloatBetween(.4, .8));
    }, this);

    this.bombs = this.physics.add.group();
    
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
    
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }

  private hitBomb(player: any, bomb: any) {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play('turn');
    this.player.disableInteractive();
    this.gameover = true;
  }

  private collectStar(player: any, star: any) {
    //star.destroy();
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`score: ${this.score}`);

    if (!this.stars.countActive(true)) {
      this.stars.children.iterate((c: any) => c.enableBody(true, c.x, 0, true, true), this);

      let x = (this.player.x < 400) ? Math.Between(400,800) : Math.Between(0,400);
      let bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Math.Between(-200, 200), 20);
    }
  }
}