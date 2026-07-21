import Phaser from 'phaser';
import './style.css';

const WIDTH = 960;
const HEIGHT = 540;

const palette = {
  ink: 0x17324d,
  cream: 0xfff8df,
  sky: 0x8ee7ff,
  grass: 0x86dc72,
  grassDark: 0x5fbe61,
  path: 0xf5d89a,
  water: 0x55c8f2,
  purple: 0x8d72e8,
  pink: 0xff8fbd,
  gold: 0xffca57,
  white: 0xffffff,
};

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.makeTextures();
    this.scene.start('Egg');
  }

  makeTextures() {
    const g = this.add.graphics();

    g.fillStyle(0x2f6f9f).fillEllipse(22, 34, 30, 18);
    g.fillStyle(0x4b86c4).fillCircle(22, 22, 17);
    g.fillStyle(0xf6c8a7).fillCircle(22, 16, 10);
    g.fillStyle(0x25334e).fillCircle(18, 14, 2).fillCircle(26, 14, 2);
    g.fillStyle(0xffffff).fillCircle(17, 13, 1).fillCircle(25, 13, 1);
    g.generateTexture('player', 44, 48);
    g.clear();

    g.fillStyle(0x6d56d8).fillEllipse(22, 31, 30, 20);
    g.fillStyle(0x9b83f4).fillCircle(22, 20, 15);
    g.fillTriangle(10, 14, 16, 2, 19, 15);
    g.fillTriangle(25, 15, 29, 2, 35, 14);
    g.fillStyle(0xffe78a).fillCircle(17, 19, 3).fillCircle(27, 19, 3);
    g.fillStyle(0x292144).fillCircle(17, 19, 1).fillCircle(27, 19, 1);
    g.generateTexture('companion', 44, 44);
    g.clear();

    g.fillStyle(0xffd1a8).fillCircle(22, 16, 11);
    g.fillStyle(0x7e4a2f).fillEllipse(22, 10, 24, 13);
    g.fillStyle(0x7bcb70).fillRoundedRect(8, 25, 28, 24, 8);
    g.fillStyle(0x26364d).fillCircle(18, 16, 2).fillCircle(26, 16, 2);
    g.generateTexture('mira', 44, 52);
    g.clear();

    g.fillStyle(0x704a31).fillRoundedRect(0, 0, 72, 34, 7);
    g.fillStyle(0xa8784c).fillRoundedRect(5, 4, 62, 9, 4);
    g.fillStyle(0xd8ab68).fillRect(8, 16, 56, 5).fillRect(8, 25, 56, 5);
    g.generateTexture('bridge', 72, 34);
    g.clear();

    g.fillStyle(0x6741a5).fillCircle(28, 28, 24);
    g.fillStyle(0x986fe0).fillTriangle(7, 22, 18, 1, 22, 23);
    g.fillTriangle(34, 23, 39, 1, 50, 22);
    g.fillStyle(0xffed7a).fillCircle(21, 27, 4).fillCircle(35, 27, 4);
    g.fillStyle(0x24193e).fillCircle(21, 27, 2).fillCircle(35, 27, 2);
    g.generateTexture('guardian', 56, 56);
    g.destroy();
  }
}

class EggScene extends Phaser.Scene {
  constructor() { super('Egg'); }

  create() {
    this.cameras.main.setBackgroundColor(palette.sky);
    this.add.rectangle(WIDTH / 2, HEIGHT * 0.77, WIDTH, HEIGHT * 0.5, palette.grass);
    this.add.circle(130, 85, 55, 0xffffff, 0.55);
    this.add.circle(820, 100, 75, 0xffffff, 0.35);

    this.add.text(WIDTH / 2, 58, 'ASCEND', {
      fontFamily: 'Baloo 2', fontSize: '64px', fontStyle: '800', color: '#17324d',
      stroke: '#ffffff', strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 118, 'Every great adventure begins with something small.', {
      fontFamily: 'Nunito', fontSize: '22px', fontStyle: '700', color: '#294d68',
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 163, 'Choose the egg that feels like yours', {
      fontFamily: 'Baloo 2', fontSize: '29px', fontStyle: '700', color: '#6b4cc5',
    }).setOrigin(0.5);

    const eggs = [
      { x: 270, base: 0xff91c5, spots: 0xffe0ef, glow: 0xffb3d7, name: 'Bloom Egg' },
      { x: 480, base: 0x9b83f4, spots: 0xffe57d, glow: 0xc0afff, name: 'Starlight Egg' },
      { x: 690, base: 0x66d4c0, spots: 0xd9fff6, glow: 0x90eadb, name: 'Tide Egg' },
    ];

    eggs.forEach((egg) => this.createEgg(egg));

    this.add.text(WIDTH / 2, 500, 'No wrong choice. Your companion grows with you.', {
      fontFamily: 'Nunito', fontSize: '18px', fontStyle: '700', color: '#315b65',
    }).setOrigin(0.5);
  }

  createEgg({ x, base, spots, glow, name }) {
    const group = this.add.container(x, 325);
    const aura = this.add.circle(0, 10, 80, glow, 0.25);
    const shadow = this.add.ellipse(0, 88, 112, 24, 0x315b65, 0.22);
    const shell = this.add.ellipse(0, 0, 112, 150, base).setStrokeStyle(7, 0xffffff, 0.9);
    const spot1 = this.add.ellipse(-24, -18, 25, 17, spots, 0.9).setAngle(-20);
    const spot2 = this.add.ellipse(25, 18, 30, 20, spots, 0.9).setAngle(15);
    const spot3 = this.add.circle(-10, 38, 10, spots, 0.9);
    const label = this.add.text(0, 116, name, {
      fontFamily: 'Baloo 2', fontSize: '22px', fontStyle: '700', color: '#17324d',
      backgroundColor: '#fff8df', padding: { x: 14, y: 7 },
    }).setOrigin(0.5);

    group.add([aura, shadow, shell, spot1, spot2, spot3, label]);
    group.setSize(150, 235).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: group, y: 315, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    group.on('pointerover', () => this.tweens.add({ targets: group, scale: 1.08, duration: 140 }));
    group.on('pointerout', () => this.tweens.add({ targets: group, scale: 1, duration: 140 }));
    group.on('pointerdown', () => this.hatch(group, name));
  }

  hatch(group, name) {
    this.input.enabled = false;
    this.cameras.main.flash(350, 255, 255, 255);
    this.tweens.add({
      targets: group,
      scale: 1.35,
      angle: 8,
      duration: 180,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.add.text(WIDTH / 2, 255, 'Your companion heard you.', {
          fontFamily: 'Baloo 2', fontSize: '38px', fontStyle: '800', color: '#ffffff',
          stroke: '#6b4cc5', strokeThickness: 8,
        }).setOrigin(0.5).setDepth(20);
        this.time.delayedCall(900, () => this.scene.start('World', { eggName: name }));
      },
    });
  }
}

class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }

  init(data) {
    this.eggName = data.eggName || 'Starlight Egg';
    this.quest = 'Meet Mira near the broken bridge';
    this.bridgeRepaired = false;
    this.puzzleOpen = false;
    this.guardianComplete = false;
    this.touchVector = new Phaser.Math.Vector2();
  }

  create() {
    this.physics.world.setBounds(0, 0, 1700, 1050);
    this.cameras.main.setBounds(0, 0, 1700, 1050);
    this.cameras.main.setBackgroundColor(palette.grass);

    this.drawWorld();
    this.createCollisions();

    this.player = this.physics.add.sprite(260, 500, 'player').setDepth(500);
    this.player.setCircle(15, 7, 15).setCollideWorldBounds(true);
    this.companion = this.add.sprite(220, 540, 'companion').setDepth(499);

    this.mira = this.add.sprite(750, 480, 'mira').setDepth(480);
    this.add.text(750, 438, 'Mira', this.smallLabel()).setOrigin(0.5).setDepth(900);
    this.guardian = this.add.sprite(1450, 500, 'guardian').setDepth(500);
    this.add.text(1450, 452, 'Fracture Guardian', this.smallLabel()).setOrigin(0.5).setDepth(900);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.waterBlockers);
    this.physics.add.collider(this.player, this.bridgeBlocker);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.08);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');

    this.createHud();
    this.createTouchControls();
    this.showMessage(`Your ${this.eggName} hatched into a curious little companion.`, 3200);
  }

  drawWorld() {
    const g = this.add.graphics();
    g.fillStyle(palette.grass).fillRect(0, 0, 1700, 1050);

    for (let y = 0; y < 1050; y += 90) {
      for (let x = 0; x < 1700; x += 90) {
        if ((x + y) % 180 === 0) g.fillStyle(0x76cf6a, 0.28).fillCircle(x + 30, y + 25, 16);
      }
    }

    g.fillStyle(palette.path).fillRoundedRect(90, 430, 650, 160, 70);
    g.fillRoundedRect(720, 470, 390, 80, 40);
    g.fillRoundedRect(1110, 430, 520, 160, 70);

    g.fillStyle(palette.water).fillRect(1010, 0, 180, 1050);
    g.fillStyle(0xb7efff, 0.55);
    for (let y = 30; y < 1050; y += 65) g.fillRoundedRect(1025, y, 145, 10, 5);

    this.add.rectangle(1100, 510, 76, 38, 0x6e4b34, 0.35).setDepth(2);

    this.drawHouse(220, 250, 0xff9d8b, 'Awakener Lodge');
    this.drawHouse(530, 260, 0xffd570, 'Crystal Workshop');
    this.drawHouse(1430, 255, 0xa994f4, 'Guardian Grove');

    for (let i = 0; i < 12; i++) {
      const x = 130 + (i * 127) % 1450;
      const y = i % 2 ? 760 + (i % 3) * 70 : 100 + (i % 3) * 60;
      this.drawTree(x, y);
    }

    this.add.text(375, 650, 'CRYSTALBROOK', {
      fontFamily: 'Baloo 2', fontSize: '32px', fontStyle: '800', color: '#4a8a59',
    }).setOrigin(0.5).setAlpha(0.55);
    this.add.text(1380, 650, 'THE FRACTURE', {
      fontFamily: 'Baloo 2', fontSize: '32px', fontStyle: '800', color: '#7255b8',
    }).setOrigin(0.5).setAlpha(0.55);
  }

  drawHouse(x, y, roofColor, label) {
    this.add.rectangle(x, y, 190, 125, 0xfff1c9).setStrokeStyle(6, 0xffffff).setDepth(y);
    this.add.triangle(x, y - 105, 0, 105, 95, 0, 190, 105, roofColor).setStrokeStyle(6, 0xffffff).setDepth(y + 1);
    this.add.rectangle(x, y + 25, 42, 64, 0x8f684e).setDepth(y + 2);
    this.add.text(x, y + 92, label, this.smallLabel()).setOrigin(0.5).setDepth(y + 5);
  }

  drawTree(x, y) {
    this.add.ellipse(x + 8, y + 44, 68, 18, 0x2c724f, 0.18).setDepth(y - 2);
    this.add.rectangle(x, y + 18, 19, 55, 0x93643f).setDepth(y);
    this.add.circle(x, y - 12, 42, 0x58b963).setStrokeStyle(5, 0x8adb76).setDepth(y + 1);
  }

  createCollisions() {
    this.walls = this.physics.add.staticGroup();
    this.addWall(125, 180, 190, 170);
    this.addWall(435, 190, 190, 170);
    this.addWall(1335, 180, 190, 170);

    this.waterBlockers = this.physics.add.staticGroup();
    this.addWaterBlock(1010, 0, 180, 450);
    this.addWaterBlock(1010, 570, 180, 480);

    this.bridgeBlocker = this.physics.add.staticImage(1100, 510, null).setDisplaySize(180, 120).setVisible(false);
    this.bridgeBlocker.body.setSize(180, 120);
  }

  addWall(x, y, w, h) {
    const wall = this.walls.create(x + w / 2, y + h / 2, null).setDisplaySize(w, h).setVisible(false);
    wall.refreshBody();
  }

  addWaterBlock(x, y, w, h) {
    const block = this.waterBlockers.create(x + w / 2, y + h / 2, null).setDisplaySize(w, h).setVisible(false);
    block.refreshBody();
  }

  createHud() {
    this.hudPanel = this.add.rectangle(18, 18, 410, 92, 0xfff8df, 0.95)
      .setOrigin(0).setScrollFactor(0).setDepth(2000).setStrokeStyle(4, 0xffffff);
    this.add.text(36, 30, 'ASCEND • THE FRACTURE', {
      fontFamily: 'Baloo 2', fontSize: '22px', fontStyle: '800', color: '#6b4cc5',
    }).setScrollFactor(0).setDepth(2001);
    this.questText = this.add.text(36, 62, this.quest, {
      fontFamily: 'Nunito', fontSize: '16px', fontStyle: '800', color: '#17324d', wordWrap: { width: 365 },
    }).setScrollFactor(0).setDepth(2001);

    this.prompt = this.add.text(WIDTH / 2, HEIGHT - 40, '', {
      fontFamily: 'Baloo 2', fontSize: '21px', fontStyle: '800', color: '#17324d',
      backgroundColor: '#fff8df', padding: { x: 18, y: 9 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2100).setVisible(false);
  }

  createTouchControls() {
    const makePad = (x, y, symbol, vx, vy) => {
      const circle = this.add.circle(x, y, 34, 0xffffff, 0.58).setStrokeStyle(3, 0x6b86a1, 0.55)
        .setScrollFactor(0).setDepth(2200).setInteractive();
      this.add.text(x, y, symbol, { fontSize: '25px', color: '#315a78', fontStyle: 'bold' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(2201);
      circle.on('pointerdown', () => this.touchVector.set(vx, vy));
      circle.on('pointerup', () => this.touchVector.set(0, 0));
      circle.on('pointerout', () => this.touchVector.set(0, 0));
    };

    makePad(82, HEIGHT - 78, '◀', -1, 0);
    makePad(154, HEIGHT - 78, '▶', 1, 0);
    makePad(118, HEIGHT - 118, '▲', 0, -1);
    makePad(118, HEIGHT - 38, '▼', 0, 1);

    const action = this.add.circle(WIDTH - 82, HEIGHT - 74, 43, palette.gold, 0.9)
      .setStrokeStyle(5, 0xffffff).setScrollFactor(0).setDepth(2200).setInteractive();
    this.add.text(WIDTH - 82, HEIGHT - 74, 'ACT', {
      fontFamily: 'Baloo 2', fontSize: '20px', fontStyle: '800', color: '#61420c',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2201);
    action.on('pointerdown', () => this.interact());
  }

  update() {
    if (this.puzzleOpen) {
      this.player.setVelocity(0);
      return;
    }

    const speed = 205;
    let x = 0;
    let y = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) x -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) x += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) y -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) y += 1;
    x += this.touchVector.x;
    y += this.touchVector.y;

    const direction = new Phaser.Math.Vector2(x, y).normalize();
    this.player.setVelocity(direction.x * speed, direction.y * speed);
    if (direction.x !== 0) this.player.setFlipX(direction.x < 0);
    this.player.setDepth(this.player.y + 20);

    const targetX = this.player.x - (direction.x || 1) * 46;
    const targetY = this.player.y - direction.y * 46 + 22;
    this.companion.x = Phaser.Math.Linear(this.companion.x, targetX, 0.075);
    this.companion.y = Phaser.Math.Linear(this.companion.y, targetY, 0.075);
    this.companion.setDepth(this.companion.y + 10);

    const nearMira = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.mira.x, this.mira.y) < 105;
    const nearGuardian = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.guardian.x, this.guardian.y) < 115;

    if (nearMira && !this.bridgeRepaired) this.setPrompt('Press E / ACT to speak with Mira');
    else if (nearGuardian && this.bridgeRepaired && !this.guardianComplete) this.setPrompt('Press E / ACT to face the Guardian');
    else this.setPrompt('');

    if (Phaser.Input.Keyboard.JustDown(this.keys.E) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.interact();
  }

  interact() {
    if (this.puzzleOpen) return;
    const nearMira = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.mira.x, this.mira.y) < 115;
    const nearGuardian = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.guardian.x, this.guardian.y) < 125;

    if (nearMira && !this.bridgeRepaired) this.openPuzzle();
    else if (nearGuardian && this.bridgeRepaired && !this.guardianComplete) this.completeGuardian();
  }

  openPuzzle() {
    this.puzzleOpen = true;
    const overlay = this.add.container(this.cameras.main.scrollX + WIDTH / 2, this.cameras.main.scrollY + HEIGHT / 2).setDepth(5000);
    const shade = this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x17324d, 0.58).setInteractive();
    const panel = this.add.rectangle(0, 0, 650, 390, palette.cream).setStrokeStyle(8, 0xffffff);
    const title = this.add.text(0, -142, 'Mira’s Bridge Puzzle', {
      fontFamily: 'Baloo 2', fontSize: '34px', fontStyle: '800', color: '#6b4cc5',
    }).setOrigin(0.5);
    const story = this.add.text(0, -82, 'The bridge needs half of a crystal charge.\nWhich decimal means one half?', {
      fontFamily: 'Nunito', fontSize: '23px', fontStyle: '800', color: '#17324d', align: 'center',
    }).setOrigin(0.5);
    overlay.add([shade, panel, title, story]);

    const answers = [
      { text: '0.2', x: -190, correct: false },
      { text: '0.5', x: 0, correct: true },
      { text: '5.0', x: 190, correct: false },
    ];

    const feedback = this.add.text(0, 125, 'Choose the answer that makes sense.', {
      fontFamily: 'Nunito', fontSize: '19px', fontStyle: '800', color: '#46677c',
    }).setOrigin(0.5);
    overlay.add(feedback);

    answers.forEach(({ text, x, correct }) => {
      const button = this.add.rectangle(x, 35, 145, 75, correct ? 0x9b83f4 : 0x8fd9c5)
        .setStrokeStyle(5, 0xffffff).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, 35, text, {
        fontFamily: 'Baloo 2', fontSize: '31px', fontStyle: '800', color: '#17324d',
      }).setOrigin(0.5);
      overlay.add([button, label]);
      button.on('pointerdown', () => {
        if (!correct) {
          feedback.setText('Not quite. One half is smaller than one whole. Try again.').setColor('#b24d64');
          this.tweens.add({ targets: button, angle: 4, duration: 70, yoyo: true, repeat: 2 });
          return;
        }
        feedback.setText('Exactly! 0.5 is the same amount as one half.').setColor('#37835a');
        this.time.delayedCall(850, () => {
          overlay.destroy(true);
          this.puzzleOpen = false;
          this.repairBridge();
        });
      });
    });
  }

  repairBridge() {
    this.bridgeRepaired = true;
    this.bridgeBlocker.destroy();
    const bridge = this.add.sprite(1100, 510, 'bridge').setScale(1.18, 1.55).setDepth(520).setAlpha(0);
    this.tweens.add({ targets: bridge, alpha: 1, scaleX: 1, scaleY: 1.35, duration: 900, ease: 'Back.out' });
    this.quest = 'Cross the restored bridge and find the Guardian';
    this.questText.setText(this.quest);
    this.cameras.main.flash(450, 255, 233, 130);
    this.showMessage('The bridge remembers its shape. The way forward is open!', 3500);
  }

  completeGuardian() {
    this.guardianComplete = true;
    this.player.setVelocity(0);
    this.tweens.add({ targets: this.guardian, scale: 1.35, duration: 220, yoyo: true, repeat: 2 });
    this.time.delayedCall(700, () => {
      this.guardian.setTint(0xffe682);
      this.questText.setText('Vertical slice complete — Crystalbrook is waking up');
      this.showMessage('Guardian: “You did not guess. You understood. The Fracture accepts you.”', 6000);
      this.add.text(this.guardian.x, this.guardian.y - 90, 'WORLD RESTORED +1', {
        fontFamily: 'Baloo 2', fontSize: '28px', fontStyle: '800', color: '#ffffff',
        stroke: '#6b4cc5', strokeThickness: 7,
      }).setOrigin(0.5).setDepth(2500);
      this.cameras.main.flash(500, 255, 255, 255);
    });
  }

  setPrompt(text) {
    this.prompt.setText(text).setVisible(Boolean(text));
  }

  showMessage(text, duration = 2800) {
    if (this.messageBox) this.messageBox.destroy();
    this.messageBox = this.add.text(WIDTH / 2, 125, text, {
      fontFamily: 'Nunito', fontSize: '20px', fontStyle: '800', color: '#17324d', align: 'center',
      backgroundColor: '#fff8df', padding: { x: 22, y: 14 }, wordWrap: { width: 610 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2600).setAlpha(0);
    this.tweens.add({ targets: this.messageBox, alpha: 1, y: 138, duration: 250 });
    this.time.delayedCall(duration, () => {
      if (!this.messageBox) return;
      this.tweens.add({ targets: this.messageBox, alpha: 0, duration: 250, onComplete: () => this.messageBox?.destroy() });
    });
  }

  smallLabel() {
    return {
      fontFamily: 'Nunito', fontSize: '16px', fontStyle: '800', color: '#17324d',
      backgroundColor: '#fff8df', padding: { x: 9, y: 4 },
    };
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#8ee7ff',
  physics: {
    default: 'arcade',
    arcade: { debug: false, gravity: { x: 0, y: 0 } },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, EggScene, WorldScene],
};

new Phaser.Game(config);
