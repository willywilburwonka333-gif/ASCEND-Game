import Phaser from 'phaser';
import './style.css';

const W = 960;
const H = 540;
const C = {
  ink: 0x17324d,
  cream: 0xfff8df,
  sky: 0x8ee7ff,
  grass: 0x86dc72,
  grass2: 0x6fca64,
  path: 0xf5d89a,
  water: 0x55c8f2,
  purple: 0x8d72e8,
  pink: 0xff8fbd,
  gold: 0xffca57,
  mint: 0x73d8bd,
};

const state = {
  eggName: 'Starlight Egg',
  companionName: 'Nova',
};

const textStyle = (size = 20, colour = '#17324d') => ({
  fontFamily: 'Nunito, Arial, sans-serif',
  fontSize: `${size}px`,
  fontStyle: 'bold',
  color: colour,
});

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    const g = this.add.graphics();

    g.fillStyle(0xffffff).fillRect(0, 0, 2, 2);
    g.generateTexture('pixel', 2, 2);
    g.clear();

    g.fillStyle(0x3e79b2).fillEllipse(24, 38, 34, 18);
    g.fillStyle(0x5795cf).fillCircle(24, 24, 18);
    g.fillStyle(0xf6c8a7).fillCircle(24, 17, 11);
    g.fillStyle(0x24344f).fillCircle(20, 15, 2).fillCircle(28, 15, 2);
    g.fillStyle(0xffffff).fillCircle(19, 14, 1).fillCircle(27, 14, 1);
    g.generateTexture('player', 48, 52);
    g.clear();

    g.fillStyle(0x6d56d8).fillEllipse(24, 34, 34, 22);
    g.fillStyle(0x9b83f4).fillCircle(24, 21, 17);
    g.fillTriangle(11, 15, 17, 1, 21, 16);
    g.fillTriangle(27, 16, 32, 1, 38, 15);
    g.fillStyle(0xffe78a).fillCircle(19, 20, 3).fillCircle(29, 20, 3);
    g.fillStyle(0x292144).fillCircle(19, 20, 1).fillCircle(29, 20, 1);
    g.generateTexture('companion', 48, 48);
    g.clear();

    g.fillStyle(0xffd1a8).fillCircle(22, 16, 11);
    g.fillStyle(0x7e4a2f).fillEllipse(22, 10, 24, 13);
    g.fillStyle(0x7bcb70).fillRoundedRect(8, 25, 28, 24, 8);
    g.fillStyle(0x26364d).fillCircle(18, 16, 2).fillCircle(26, 16, 2);
    g.generateTexture('mira', 44, 52);
    g.clear();

    g.fillStyle(0x704a31).fillRoundedRect(0, 0, 84, 38, 7);
    g.fillStyle(0xa8784c).fillRoundedRect(5, 4, 74, 10, 4);
    g.fillStyle(0xd8ab68).fillRect(8, 18, 68, 5).fillRect(8, 28, 68, 5);
    g.generateTexture('bridge', 84, 38);
    g.clear();

    g.fillStyle(0x6741a5).fillCircle(32, 32, 28);
    g.fillStyle(0x986fe0).fillTriangle(8, 26, 19, 1, 24, 27);
    g.fillTriangle(39, 27, 44, 1, 57, 26);
    g.fillStyle(0xffed7a).fillCircle(24, 31, 4).fillCircle(40, 31, 4);
    g.fillStyle(0x24193e).fillCircle(24, 31, 2).fillCircle(40, 31, 2);
    g.generateTexture('guardian', 64, 64);
    g.clear();

    g.fillStyle(0xc6f8ff).fillTriangle(18, 0, 36, 34, 0, 34);
    g.fillStyle(0xffffff, 0.8).fillTriangle(18, 5, 28, 28, 10, 28);
    g.generateTexture('shard', 36, 36);
    g.destroy();

    this.scene.start('Egg');
  }
}

class EggScene extends Phaser.Scene {
  constructor() { super('Egg'); }

  create() {
    this.cameras.main.setBackgroundColor(C.sky);
    this.add.rectangle(W / 2, 420, W, 260, C.grass);
    this.add.circle(120, 86, 55, 0xffffff, 0.55);
    this.add.circle(835, 95, 70, 0xffffff, 0.35);

    this.add.text(W / 2, 55, 'ASCEND', {
      ...textStyle(62), fontFamily: 'Baloo 2, Arial', stroke: '#ffffff', strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(W / 2, 120, 'Choose the egg that feels like yours', {
      ...textStyle(27, '#6b4cc5'), fontFamily: 'Baloo 2, Arial',
    }).setOrigin(0.5);

    [
      { x: 270, base: C.pink, spots: 0xffe0ef, glow: 0xffb3d7, name: 'Bloom Egg' },
      { x: 480, base: 0x9b83f4, spots: 0xffe57d, glow: 0xc0afff, name: 'Starlight Egg' },
      { x: 690, base: C.mint, spots: 0xd9fff6, glow: 0x90eadb, name: 'Tide Egg' },
    ].forEach((egg) => this.makeEgg(egg));

    this.add.text(W / 2, 505, 'No wrong choice. Your companion grows with you.', textStyle(18, '#315b65')).setOrigin(0.5);
  }

  makeEgg({ x, base, spots, glow, name }) {
    const group = this.add.container(x, 320);
    group.add([
      this.add.circle(0, 8, 82, glow, 0.25),
      this.add.ellipse(0, 88, 112, 24, 0x315b65, 0.22),
      this.add.ellipse(0, 0, 112, 150, base).setStrokeStyle(7, 0xffffff, 0.9),
      this.add.ellipse(-24, -18, 25, 17, spots, 0.9).setAngle(-20),
      this.add.ellipse(25, 18, 30, 20, spots, 0.9).setAngle(15),
      this.add.circle(-10, 38, 10, spots, 0.9),
      this.add.text(0, 116, name, { ...textStyle(21), backgroundColor: '#fff8df', padding: { x: 14, y: 7 } }).setOrigin(0.5),
    ]);
    group.setSize(150, 235).setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: group, y: 310, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    group.on('pointerover', () => this.tweens.add({ targets: group, scale: 1.08, duration: 130 }));
    group.on('pointerout', () => this.tweens.add({ targets: group, scale: 1, duration: 130 }));
    group.on('pointerdown', () => {
      state.eggName = name;
      this.input.enabled = false;
      this.cameras.main.flash(350, 255, 255, 255);
      this.tweens.add({
        targets: group, scale: 1.35, angle: 8, duration: 170, yoyo: true, repeat: 3,
        onComplete: () => this.scene.start('Name'),
      });
    });
  }
}

class NameScene extends Phaser.Scene {
  constructor() { super('Name'); }

  create() {
    this.cameras.main.setBackgroundColor(0xc8f4ff);
    this.add.rectangle(W / 2, H - 85, W, 170, C.grass);
    this.add.circle(W / 2, 225, 112, 0xffffff, 0.58);
    const creature = this.add.sprite(W / 2, 225, 'companion').setScale(2.5);
    this.tweens.add({ targets: creature, y: 214, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.add.text(W / 2, 62, `${state.eggName} has awakened!`, {
      ...textStyle(38, '#6b4cc5'), fontFamily: 'Baloo 2, Arial', stroke: '#ffffff', strokeThickness: 6,
    }).setOrigin(0.5);
    this.add.text(W / 2, 112, 'What will you call your companion?', textStyle(22)).setOrigin(0.5);

    const names = ['Nova', 'Pip', 'Lumi', 'Mochi', 'Spark', 'Echo'];
    names.forEach((name, i) => {
      const x = 260 + (i % 3) * 220;
      const y = 370 + Math.floor(i / 3) * 70;
      const button = this.add.rectangle(x, y, 175, 52, i === 0 ? C.gold : C.cream).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
      this.add.text(x, y, name, textStyle(21)).setOrigin(0.5);
      button.on('pointerdown', () => {
        state.companionName = name;
        this.cameras.main.flash(250, 255, 255, 255);
        this.time.delayedCall(220, () => this.scene.start('World'));
      });
    });
  }
}

class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }

  init() {
    this.stage = 0;
    this.shards = 0;
    this.bridgeRepaired = false;
    this.guardianComplete = false;
    this.modalOpen = false;
    this.touch = new Phaser.Math.Vector2();
  }

  create() {
    this.physics.world.setBounds(0, 0, 1900, 1100);
    this.cameras.main.setBounds(0, 0, 1900, 1100);
    this.drawWorld();
    this.makeCollision();

    this.player = this.physics.add.sprite(250, 530, 'player').setCollideWorldBounds(true);
    this.player.setCircle(16, 8, 16);
    this.companion = this.add.sprite(205, 565, 'companion');
    this.mira = this.add.sprite(760, 500, 'mira');
    this.guardian = this.add.sprite(1620, 500, 'guardian').setScale(1.15);
    this.add.text(760, 456, 'Mira', this.labelStyle()).setOrigin(0.5).setDepth(900);
    this.add.text(1620, 445, 'Fracture Guardian', this.labelStyle()).setOrigin(0.5).setDepth(900);

    this.shardGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    [[430, 710], [650, 790], [855, 700]].forEach(([x, y]) => {
      const shard = this.shardGroup.create(x, y, 'shard');
      this.tweens.add({ targets: shard, y: y - 12, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    });

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.water);
    this.physics.add.collider(this.player, this.bridgeBlocker);
    this.physics.add.overlap(this.player, this.shardGroup, (_, shard) => this.collectShard(shard));

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.06);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');

    this.makeHud();
    this.makeTouchControls();
    this.message(`${state.companionName} is ready. Find Mira near the broken bridge.`, 3800);
  }

  drawWorld() {
    const g = this.add.graphics();
    g.fillStyle(C.grass).fillRect(0, 0, 1900, 1100);
    for (let y = 0; y < 1100; y += 90) {
      for (let x = 0; x < 1900; x += 90) {
        if ((x + y) % 180 === 0) g.fillStyle(C.grass2, 0.25).fillCircle(x + 30, y + 25, 16);
      }
    }
    g.fillStyle(C.path).fillRoundedRect(80, 445, 850, 170, 70);
    g.fillRoundedRect(850, 475, 460, 90, 45);
    g.fillRoundedRect(1230, 430, 580, 180, 70);
    g.fillStyle(C.water).fillRect(1090, 0, 190, 1100);
    g.fillStyle(0xb7efff, 0.55);
    for (let y = 25; y < 1100; y += 62) g.fillRoundedRect(1107, y, 155, 10, 5);

    this.house(220, 250, 0xff9d8b, 'Awakener Lodge');
    this.house(540, 260, 0xffd570, 'Crystal Workshop');
    this.house(1600, 255, 0xa994f4, 'Guardian Grove');
    for (let i = 0; i < 16; i++) {
      const x = 115 + (i * 131) % 1650;
      const y = i % 2 ? 820 + (i % 3) * 62 : 105 + (i % 3) * 62;
      this.tree(x, y);
    }
    this.add.text(410, 650, 'CRYSTALBROOK', { ...textStyle(32, '#4a8a59'), fontFamily: 'Baloo 2, Arial' }).setOrigin(0.5).setAlpha(0.55);
    this.add.text(1530, 665, 'THE FRACTURE', { ...textStyle(32, '#7255b8'), fontFamily: 'Baloo 2, Arial' }).setOrigin(0.5).setAlpha(0.55);
  }

  house(x, y, roof, name) {
    this.add.rectangle(x, y, 190, 125, 0xfff1c9).setStrokeStyle(6, 0xffffff).setDepth(y);
    this.add.triangle(x, y - 105, 0, 105, 95, 0, 190, 105, roof).setStrokeStyle(6, 0xffffff).setDepth(y + 1);
    this.add.rectangle(x, y + 25, 42, 64, 0x8f684e).setDepth(y + 2);
    this.add.text(x, y + 92, name, this.labelStyle()).setOrigin(0.5).setDepth(y + 5);
  }

  tree(x, y) {
    this.add.ellipse(x + 8, y + 44, 68, 18, 0x2c724f, 0.18).setDepth(y - 2);
    this.add.rectangle(x, y + 18, 19, 55, 0x93643f).setDepth(y);
    this.add.circle(x, y - 12, 42, 0x58b963).setStrokeStyle(5, 0x8adb76).setDepth(y + 1);
  }

  makeCollision() {
    this.walls = this.physics.add.staticGroup();
    this.invisible(this.walls, 220, 265, 210, 190);
    this.invisible(this.walls, 540, 275, 210, 190);
    this.invisible(this.walls, 1600, 265, 210, 190);
    this.water = this.physics.add.staticGroup();
    this.invisible(this.water, 1185, 220, 190, 440);
    this.invisible(this.water, 1185, 825, 190, 500);
    this.bridgeBlocker = this.physics.add.staticImage(1185, 520, 'pixel').setDisplaySize(190, 125).setVisible(false);
    this.bridgeBlocker.refreshBody();
  }

  invisible(group, x, y, w, h) {
    const body = group.create(x, y, 'pixel').setDisplaySize(w, h).setVisible(false);
    body.refreshBody();
  }

  makeHud() {
    this.add.rectangle(18, 18, 440, 112, C.cream, 0.96).setOrigin(0).setScrollFactor(0).setDepth(2000).setStrokeStyle(4, 0xffffff);
    this.add.text(36, 28, `ASCEND • ${state.companionName.toUpperCase()}`, { ...textStyle(22, '#6b4cc5'), fontFamily: 'Baloo 2, Arial' }).setScrollFactor(0).setDepth(2001);
    this.questText = this.add.text(36, 60, 'Meet Mira near the broken bridge', { ...textStyle(16), wordWrap: { width: 390 } }).setScrollFactor(0).setDepth(2001);
    this.shardText = this.add.text(36, 98, 'Crystal shards: 0 / 3', textStyle(15, '#3d7180')).setScrollFactor(0).setDepth(2001);
    this.prompt = this.add.text(W / 2, H - 42, '', { ...textStyle(20), backgroundColor: '#fff8df', padding: { x: 18, y: 9 } }).setOrigin(0.5).setScrollFactor(0).setDepth(2200).setVisible(false);
  }

  makeTouchControls() {
    const pad = (x, y, symbol, vx, vy) => {
      const circle = this.add.circle(x, y, 33, 0xffffff, 0.58).setStrokeStyle(3, 0x6b86a1, 0.55).setScrollFactor(0).setDepth(2300).setInteractive();
      this.add.text(x, y, symbol, textStyle(24, '#315a78')).setOrigin(0.5).setScrollFactor(0).setDepth(2301);
      circle.on('pointerdown', () => this.touch.set(vx, vy));
      circle.on('pointerup', () => this.touch.set(0, 0));
      circle.on('pointerout', () => this.touch.set(0, 0));
    };
    pad(82, H - 76, '◀', -1, 0);
    pad(154, H - 76, '▶', 1, 0);
    pad(118, H - 116, '▲', 0, -1);
    pad(118, H - 36, '▼', 0, 1);
    const act = this.add.circle(W - 82, H - 72, 43, C.gold, 0.92).setStrokeStyle(5, 0xffffff).setScrollFactor(0).setDepth(2300).setInteractive();
    this.add.text(W - 82, H - 72, 'ACT', textStyle(20, '#61420c')).setOrigin(0.5).setScrollFactor(0).setDepth(2301);
    act.on('pointerdown', () => this.interact());
  }

  update() {
    if (this.modalOpen) {
      this.player.setVelocity(0);
      return;
    }
    let x = 0;
    let y = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) x -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) x += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) y -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) y += 1;
    x += this.touch.x;
    y += this.touch.y;
    const dir = new Phaser.Math.Vector2(x, y).normalize();
    this.player.setVelocity(dir.x * 210, dir.y * 210);
    if (dir.x) this.player.setFlipX(dir.x < 0);
    this.player.setDepth(this.player.y + 20);

    const targetX = this.player.x - (dir.x || 1) * 48;
    const targetY = this.player.y - dir.y * 46 + 22;
    this.companion.x = Phaser.Math.Linear(this.companion.x, targetX, 0.075);
    this.companion.y = Phaser.Math.Linear(this.companion.y, targetY, 0.075);
    this.companion.setDepth(this.companion.y + 10);

    const nearMira = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.mira.x, this.mira.y) < 115;
    const nearGuardian = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.guardian.x, this.guardian.y) < 130;
    if (nearMira && this.stage === 0) this.setPrompt('Press E / ACT to speak with Mira');
    else if (nearMira && this.stage === 1 && this.shards === 3) this.setPrompt('Press E / ACT to restore the bridge');
    else if (nearGuardian && this.bridgeRepaired && !this.guardianComplete) this.setPrompt('Press E / ACT to face the Guardian');
    else this.setPrompt('');

    if (Phaser.Input.Keyboard.JustDown(this.keys.E) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.interact();
  }

  collectShard(shard) {
    if (this.stage !== 1) return;
    shard.disableBody(true, true);
    this.shards += 1;
    this.shardText.setText(`Crystal shards: ${this.shards} / 3`);
    this.cameras.main.flash(170, 205, 250, 255);
    this.message(`${state.companionName} found a memory shard! ${this.shards}/3`, 1700);
    if (this.shards === 3) {
      this.questText.setText('Return to Mira with the three memory shards');
      this.message('All three shards are humming together. Return to Mira.', 2800);
    }
  }

  interact() {
    if (this.modalOpen) return;
    const nearMira = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.mira.x, this.mira.y) < 125;
    const nearGuardian = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.guardian.x, this.guardian.y) < 140;
    if (nearMira && this.stage === 0) this.startShardQuest();
    else if (nearMira && this.stage === 1 && this.shards === 3) this.openBridgePuzzle();
    else if (nearGuardian && this.bridgeRepaired && !this.guardianComplete) this.openGuardianBattle();
  }

  startShardQuest() {
    this.stage = 1;
    this.questText.setText('Find three memory shards in Crystalbrook');
    this.message('Mira: “The bridge forgot how to be whole. Find the three memory shards scattered nearby.”', 5000);
  }

  openBridgePuzzle() {
    this.openQuestion({
      title: 'Restore the Bridge',
      story: 'The bridge needs half of a crystal charge. Which decimal means one half?',
      answers: ['0.2', '0.5', '5.0'],
      correct: 1,
      hint: 'One half is smaller than one whole.',
      success: 'Exactly. 0.5 is the same amount as one half.',
      onSuccess: () => this.repairBridge(),
    });
  }

  repairBridge() {
    this.bridgeRepaired = true;
    this.stage = 2;
    this.bridgeBlocker.destroy();
    const bridge = this.add.sprite(1185, 520, 'bridge').setScale(1.35, 1.55).setDepth(530).setAlpha(0);
    this.tweens.add({ targets: bridge, alpha: 1, scaleX: 1.12, scaleY: 1.42, duration: 900, ease: 'Back.out' });
    this.questText.setText('Cross the bridge and face the Fracture Guardian');
    this.cameras.main.flash(450, 255, 233, 130);
    this.message('The bridge remembers its shape. The Fracture is open.', 3500);
  }

  openGuardianBattle() {
    const rounds = [
      { title: 'Guardian Trial 1', story: 'Which number has 6 in the tens place?', answers: ['163', '316', '631'], correct: 0, hint: 'The tens place is the middle digit.', success: '163 has 6 tens.' },
      { title: 'Guardian Trial 2', story: 'Four groups of six crystals make how many?', answers: ['10', '20', '24'], correct: 2, hint: 'Think 6 + 6 + 6 + 6.', success: 'Correct. 4 × 6 = 24.' },
      { title: 'Guardian Trial 3', story: 'Which fraction is equal to one half?', answers: ['2/4', '1/3', '3/4'], correct: 0, hint: 'Two of four equal parts is half.', success: 'Correct. 2/4 simplifies to 1/2.' },
    ];
    let index = 0;
    const next = () => {
      const round = rounds[index];
      this.openQuestion({ ...round, onSuccess: () => {
        index += 1;
        if (index < rounds.length) this.time.delayedCall(250, next);
        else this.finishGuardian();
      }});
    };
    next();
  }

  finishGuardian() {
    this.guardianComplete = true;
    this.stage = 3;
    this.tweens.add({ targets: this.guardian, scale: 1.5, duration: 220, yoyo: true, repeat: 2 });
    this.time.delayedCall(650, () => {
      this.guardian.setTint(0xffe682);
      this.questText.setText('Crystalbrook restored — first chapter complete');
      this.message(`Guardian: “${state.companionName} chose understanding over guessing. The world remembers you.”`, 6500);
      this.add.text(this.guardian.x, this.guardian.y - 100, 'WORLD RESTORED +1', {
        ...textStyle(29, '#ffffff'), fontFamily: 'Baloo 2, Arial', stroke: '#6b4cc5', strokeThickness: 7,
      }).setOrigin(0.5).setDepth(2500);
      this.cameras.main.flash(500, 255, 255, 255);
    });
  }

  openQuestion({ title, story, answers, correct, hint, success, onSuccess }) {
    this.modalOpen = true;
    const overlay = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(5000);
    const shade = this.add.rectangle(0, 0, W, H, C.ink, 0.62).setInteractive();
    const panel = this.add.rectangle(0, 0, 680, 400, C.cream).setStrokeStyle(8, 0xffffff);
    const heading = this.add.text(0, -145, title, { ...textStyle(33, '#6b4cc5'), fontFamily: 'Baloo 2, Arial' }).setOrigin(0.5);
    const question = this.add.text(0, -76, story, { ...textStyle(22), align: 'center', wordWrap: { width: 560 } }).setOrigin(0.5);
    const feedback = this.add.text(0, 133, 'Choose the answer that makes sense.', { ...textStyle(18, '#46677c'), align: 'center' }).setOrigin(0.5);
    overlay.add([shade, panel, heading, question, feedback]);

    answers.forEach((answer, i) => {
      const x = -190 + i * 190;
      const button = this.add.rectangle(x, 35, 150, 76, i === correct ? C.purple : C.mint).setStrokeStyle(5, 0xffffff).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, 35, answer, { ...textStyle(29), fontFamily: 'Baloo 2, Arial' }).setOrigin(0.5);
      overlay.add([button, label]);
      button.on('pointerdown', () => {
        if (i !== correct) {
          feedback.setText(`Not yet. ${hint}`).setColor('#b24d64');
          this.tweens.add({ targets: button, angle: 4, duration: 70, yoyo: true, repeat: 2 });
          return;
        }
        overlay.list.forEach((item) => item.disableInteractive?.());
        feedback.setText(success).setColor('#37835a');
        this.time.delayedCall(800, () => {
          overlay.destroy(true);
          this.modalOpen = false;
          onSuccess();
        });
      });
    });
  }

  setPrompt(value) { this.prompt.setText(value).setVisible(Boolean(value)); }

  message(value, duration = 2800) {
    if (this.messageBox) this.messageBox.destroy();
    this.messageBox = this.add.text(W / 2, 132, value, {
      ...textStyle(19), align: 'center', backgroundColor: '#fff8df', padding: { x: 22, y: 14 }, wordWrap: { width: 650 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2700).setAlpha(0);
    this.tweens.add({ targets: this.messageBox, alpha: 1, y: 142, duration: 230 });
    this.time.delayedCall(duration, () => {
      if (!this.messageBox?.active) return;
      this.tweens.add({ targets: this.messageBox, alpha: 0, duration: 220, onComplete: () => this.messageBox?.destroy() });
    });
  }

  labelStyle() {
    return { ...textStyle(15), backgroundColor: '#fff8df', padding: { x: 9, y: 4 } };
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: W,
  height: H,
  backgroundColor: '#8ee7ff',
  physics: { default: 'arcade', arcade: { debug: false, gravity: { x: 0, y: 0 } } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, EggScene, NameScene, WorldScene],
});
