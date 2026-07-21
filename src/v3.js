import Phaser from 'phaser';
import './style.css';

const W = 960;
const H = 540;
const SAVE_KEY = 'ascend_project_kayla_v3';

const C = {
  ink: 0x17324d,
  cream: 0xfff8df,
  sky: 0x8ee7ff,
  grass: 0x86dc72,
  grass2: 0x69c768,
  path: 0xf5d89a,
  water: 0x55c8f2,
  purple: 0x8d72e8,
  pink: 0xff8fbd,
  gold: 0xffca57,
  mint: 0x73d8bd,
  red: 0xef6f7d,
};

const skills = ['placeValue', 'multiplication', 'division', 'fractions', 'decimals'];
const skillNames = {
  placeValue: 'Place Value',
  multiplication: 'Multiplication',
  division: 'Division',
  fractions: 'Fractions',
  decimals: 'Decimals',
};

const freshSave = () => ({
  egg: '',
  companion: '',
  level: 1,
  xp: 0,
  coins: 0,
  crystals: 0,
  evolution: 0,
  streak: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  mastery: Object.fromEntries(skills.map((s) => [s, 0.2])),
  attempts: Object.fromEntries(skills.map((s) => [s, 0])),
  correct: Object.fromEntries(skills.map((s) => [s, 0])),
  daily: { date: '', target: 5, progress: 0, claimed: false },
  unlockedRifts: 1,
  guardianWins: 0,
});

let profile = loadSave();

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return freshSave();
    return { ...freshSave(), ...JSON.parse(raw) };
  } catch {
    return freshSave();
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(profile));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function ensureDaily() {
  if (profile.daily.date !== todayKey()) {
    profile.daily = { date: todayKey(), target: 5, progress: 0, claimed: false };
    saveGame();
  }
}

function textStyle(size = 20, colour = '#17324d') {
  return { fontFamily: 'Nunito, Arial, sans-serif', fontSize: `${size}px`, fontStyle: 'bold', color: colour };
}

function shuffle(list) {
  return Phaser.Utils.Array.Shuffle([...list]);
}

function lowestSkill() {
  return [...skills].sort((a, b) => profile.mastery[a] - profile.mastery[b])[0];
}

function adaptiveDifficulty(skill) {
  const mastery = profile.mastery[skill] || 0;
  if (mastery < 0.35) return 1;
  if (mastery < 0.6) return 2;
  if (mastery < 0.82) return 3;
  return 4;
}

function makeQuestion(skill = lowestSkill()) {
  const d = adaptiveDifficulty(skill);
  const pick = (a, b) => Phaser.Math.Between(a, b);
  let prompt = '';
  let answer = 0;
  let explanation = '';

  if (skill === 'placeValue') {
    const digit = pick(2, 9);
    const place = d <= 1 ? 10 : d === 2 ? 100 : d === 3 ? 1000 : 10000;
    const number = digit * place + pick(1, place - 1);
    prompt = `What is the value of ${digit} in ${number.toLocaleString()}?`;
    answer = digit * place;
    explanation = `${digit} is in the ${place.toLocaleString()}s place, so its value is ${answer.toLocaleString()}.`;
  } else if (skill === 'multiplication') {
    const max = d <= 1 ? 5 : d === 2 ? 10 : d === 3 ? 12 : 20;
    const a = pick(2, max);
    const b = pick(2, max);
    prompt = `${a} × ${b} = ?`;
    answer = a * b;
    explanation = `${a} groups of ${b} make ${answer}.`;
  } else if (skill === 'division') {
    const divisor = pick(2, d <= 1 ? 5 : d === 2 ? 10 : 12);
    const quotient = pick(2, d <= 1 ? 6 : d === 2 ? 10 : 15);
    const total = divisor * quotient;
    prompt = `${total} ÷ ${divisor} = ?`;
    answer = quotient;
    explanation = `${divisor} fits into ${total} exactly ${quotient} times.`;
  } else if (skill === 'fractions') {
    const den = d <= 1 ? 4 : d === 2 ? 8 : d === 3 ? 10 : 12;
    const num = pick(1, den - 1);
    const multiplier = pick(2, d + 2);
    prompt = `Which fraction is equivalent to ${num}/${den}?`;
    answer = `${num * multiplier}/${den * multiplier}`;
    explanation = `Multiplying the top and bottom by ${multiplier} keeps the fraction equal.`;
  } else {
    const tenths = pick(1, 9);
    const hundredths = d >= 3 ? pick(1, 9) : 0;
    const decimal = hundredths ? Number(`0.${tenths}${hundredths}`) : tenths / 10;
    prompt = `Which fraction matches ${decimal}?`;
    answer = hundredths ? `${tenths * 10 + hundredths}/100` : `${tenths}/10`;
    explanation = hundredths ? `${decimal} means ${tenths * 10 + hundredths} hundredths.` : `${decimal} means ${tenths} tenths.`;
  }

  const options = buildOptions(skill, answer, d);
  return { skill, prompt, answer: String(answer), options, explanation, difficulty: d };
}

function buildOptions(skill, answer, difficulty) {
  const correct = String(answer);
  let wrong = [];
  if (skill === 'fractions' || skill === 'decimals') {
    const [n, d] = correct.split('/').map(Number);
    wrong = [`${Math.max(1, n - 1)}/${d}`, `${n}/${Math.max(2, d - (difficulty > 2 ? 1 : 2))}`, `${n + 1}/${d + 1}`];
  } else {
    const n = Number(answer);
    const step = Math.max(1, Math.round(Math.abs(n) * 0.1));
    wrong = [n + step, Math.max(0, n - step), n + (difficulty + 1)].map(String);
  }
  return shuffle([correct, ...wrong.filter((v) => v !== correct)]).slice(0, 4);
}

function recordAnswer(question, correct) {
  const skill = question.skill;
  profile.totalAttempts += 1;
  profile.attempts[skill] += 1;
  profile.daily.progress = Math.min(profile.daily.target, profile.daily.progress + 1);

  if (correct) {
    profile.totalCorrect += 1;
    profile.correct[skill] += 1;
    profile.streak += 1;
    const gain = 0.045 + question.difficulty * 0.012;
    profile.mastery[skill] = Math.min(1, profile.mastery[skill] + gain);
  } else {
    profile.streak = 0;
    profile.mastery[skill] = Math.max(0.08, profile.mastery[skill] - 0.018);
  }
  saveGame();
}

function grantRewards(baseXp, coins, crystals = 0) {
  profile.xp += baseXp;
  profile.coins += coins;
  profile.crystals += crystals;
  let levelled = false;
  while (profile.xp >= profile.level * 100) {
    profile.xp -= profile.level * 100;
    profile.level += 1;
    levelled = true;
    if (profile.level === 3 || profile.level === 6 || profile.level === 10) profile.evolution += 1;
    if (profile.level % 2 === 0) profile.unlockedRifts += 1;
  }
  saveGame();
  return levelled;
}

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    ensureDaily();
    const g = this.add.graphics();
    g.fillStyle(0xffffff).fillRect(0, 0, 2, 2); g.generateTexture('pixel', 2, 2); g.clear();

    g.fillStyle(0x3977b3).fillEllipse(24, 39, 35, 19);
    g.fillStyle(0x5597d2).fillCircle(24, 24, 18);
    g.fillStyle(0xf3c39f).fillCircle(24, 17, 11);
    g.fillStyle(0x23334d).fillCircle(20, 15, 2).fillCircle(28, 15, 2);
    g.generateTexture('player', 48, 52); g.clear();

    g.fillStyle(0x6d56d8).fillEllipse(24, 35, 36, 23);
    g.fillStyle(0x9b83f4).fillCircle(24, 21, 17);
    g.fillTriangle(10, 15, 17, 0, 21, 16).fillTriangle(27, 16, 32, 0, 39, 15);
    g.fillStyle(0xffe78a).fillCircle(19, 20, 3).fillCircle(29, 20, 3);
    g.generateTexture('companion', 48, 48); g.clear();

    g.fillStyle(0xffd1a8).fillCircle(22, 16, 11);
    g.fillStyle(0x7e4a2f).fillEllipse(22, 10, 24, 13);
    g.fillStyle(0x7bcb70).fillRoundedRect(8, 25, 28, 24, 8);
    g.fillStyle(0x26364d).fillCircle(18, 16, 2).fillCircle(26, 16, 2);
    g.generateTexture('mira', 44, 52); g.clear();

    g.fillStyle(0xc6f8ff).fillTriangle(18, 0, 36, 34, 0, 34);
    g.fillStyle(0xffffff, 0.8).fillTriangle(18, 5, 28, 28, 10, 28);
    g.generateTexture('crystal', 36, 36); g.clear();

    g.fillStyle(0x6b4cc5).fillCircle(32, 32, 27);
    g.fillStyle(0x9c78e9).fillTriangle(8, 27, 20, 1, 25, 28).fillTriangle(39, 28, 45, 1, 58, 27);
    g.fillStyle(0xffec75).fillCircle(24, 31, 4).fillCircle(41, 31, 4);
    g.generateTexture('guardian', 64, 64); g.clear();

    g.fillStyle(0x704a31).fillRoundedRect(0, 0, 88, 40, 7);
    g.fillStyle(0xd8ab68).fillRect(8, 8, 72, 6).fillRect(8, 25, 72, 6);
    g.generateTexture('bridge', 88, 40); g.destroy();

    this.scene.start(profile.companion ? 'World' : 'Egg');
  }
}

class EggScene extends Phaser.Scene {
  constructor() { super('Egg'); }
  create() {
    this.cameras.main.setBackgroundColor(C.sky);
    this.add.rectangle(W / 2, 420, W, 260, C.grass);
    this.add.text(W / 2, 60, 'ASCEND', { ...textStyle(62), fontFamily: 'Baloo 2, Arial', stroke: '#fff', strokeThickness: 8 }).setOrigin(0.5);
    this.add.text(W / 2, 122, 'Choose the egg that feels like yours', textStyle(26, '#6b4cc5')).setOrigin(0.5);
    const eggs = [
      ['Bloom Egg', 270, C.pink, 0xffe0ef],
      ['Starlight Egg', 480, 0x9b83f4, 0xffe57d],
      ['Tide Egg', 690, C.mint, 0xd9fff6],
    ];
    eggs.forEach(([name, x, base, spots]) => {
      const box = this.add.container(x, 320);
      box.add([
        this.add.circle(0, 5, 82, base, 0.25),
        this.add.ellipse(0, 88, 112, 24, 0x315b65, 0.22),
        this.add.ellipse(0, 0, 112, 150, base).setStrokeStyle(7, 0xffffff),
        this.add.ellipse(-24, -18, 25, 17, spots).setAngle(-20),
        this.add.ellipse(25, 18, 30, 20, spots).setAngle(15),
        this.add.text(0, 116, name, { ...textStyle(20), backgroundColor: '#fff8df', padding: { x: 12, y: 6 } }).setOrigin(0.5),
      ]);
      box.setSize(150, 230).setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: box, y: 309, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      box.on('pointerdown', () => {
        profile.egg = name;
        saveGame();
        this.cameras.main.flash(300, 255, 255, 255);
        this.time.delayedCall(280, () => this.scene.start('Name'));
      });
    });
  }
}

class NameScene extends Phaser.Scene {
  constructor() { super('Name'); }
  create() {
    this.cameras.main.setBackgroundColor(0xc8f4ff);
    this.add.rectangle(W / 2, H - 75, W, 150, C.grass);
    const pet = this.add.sprite(W / 2, 220, 'companion').setScale(2.6);
    this.tweens.add({ targets: pet, y: 208, duration: 1000, yoyo: true, repeat: -1 });
    this.add.text(W / 2, 60, `${profile.egg} has awakened!`, textStyle(38, '#6b4cc5')).setOrigin(0.5);
    this.add.text(W / 2, 112, 'Choose your companion’s name', textStyle(22)).setOrigin(0.5);
    ['Nova', 'Pip', 'Lumi', 'Mochi', 'Spark', 'Echo'].forEach((name, i) => {
      const x = 260 + (i % 3) * 220;
      const y = 360 + Math.floor(i / 3) * 70;
      const b = this.add.rectangle(x, y, 175, 52, i === 0 ? C.gold : C.cream).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
      this.add.text(x, y, name, textStyle(21)).setOrigin(0.5);
      b.on('pointerdown', () => {
        profile.companion = name;
        saveGame();
        this.scene.start('World');
      });
    });
  }
}

class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }

  init() {
    ensureDaily();
    this.modalOpen = false;
    this.touch = new Phaser.Math.Vector2();
    this.near = null;
  }

  create() {
    this.physics.world.setBounds(0, 0, 2200, 1300);
    this.cameras.main.setBounds(0, 0, 2200, 1300);
    this.drawWorld();
    this.makeCollisions();

    this.player = this.physics.add.sprite(280, 600, 'player').setCollideWorldBounds(true).setDepth(620);
    this.player.setCircle(16, 8, 16);
    this.pet = this.add.sprite(230, 640, 'companion').setDepth(610).setScale(1 + profile.evolution * 0.12);

    this.nodes = [
      this.node('mira', 710, 560, 'mira', 'Mira'),
      this.node('training', 520, 900, 'crystal', 'Training Shrine'),
      this.node('rift', 1060, 940, 'crystal', 'Adaptive Rift'),
      this.node('guardian', 1810, 590, 'guardian', 'Fracture Guardian'),
      this.node('daily', 350, 250, 'crystal', 'Daily Crystal'),
    ];

    this.crystals = this.physics.add.group({ allowGravity: false, immovable: true });
    [[330,760],[610,740],[870,800],[1380,760],[1570,850],[1970,880]].forEach(([x,y]) => {
      const c = this.crystals.create(x, y, 'crystal');
      c.setData('collected', false);
      this.tweens.add({ targets: c, y: y - 12, duration: 850, yoyo: true, repeat: -1 });
    });

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.water);
    this.physics.add.overlap(this.player, this.crystals, (_, crystal) => this.collectCrystal(crystal));

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.05);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');

    this.makeHud();
    this.makeTouchControls();
    this.refreshHud();
    this.message(`Welcome back, Awakener. ${profile.companion} is level ${profile.level}.`, 3200);
  }

  drawWorld() {
    const g = this.add.graphics();
    g.fillStyle(C.grass).fillRect(0, 0, 2200, 1300);
    for (let y = 0; y < 1300; y += 90) for (let x = 0; x < 2200; x += 90) if ((x + y) % 180 === 0) g.fillStyle(C.grass2, 0.25).fillCircle(x + 25, y + 25, 15);
    g.fillStyle(C.path).fillRoundedRect(100, 500, 900, 190, 80);
    g.fillRoundedRect(800, 535, 680, 110, 55);
    g.fillRoundedRect(1420, 490, 650, 210, 90);
    g.fillRoundedRect(240, 720, 950, 260, 110);
    g.fillRoundedRect(1350, 730, 650, 260, 110);
    g.fillStyle(C.water).fillRect(1210, 0, 190, 1300);
    g.fillStyle(0xb7efff, 0.55);
    for (let y = 20; y < 1300; y += 64) g.fillRoundedRect(1228, y, 154, 10, 5);
    this.add.sprite(1305, 590, 'bridge').setScale(1.5, 1.45).setDepth(600);

    this.house(240, 285, 0xff9d8b, 'Awakener Lodge');
    this.house(560, 300, 0xffd570, 'Crystal Workshop');
    this.house(1850, 290, 0xa994f4, 'Guardian Grove');
    this.house(1570, 1030, 0x73d8bd, 'Rift Camp');

    for (let i = 0; i < 20; i++) {
      const x = 100 + (i * 157) % 2000;
      const y = i % 2 ? 1080 + (i % 3) * 55 : 100 + (i % 3) * 70;
      this.tree(x, y);
    }

    this.add.text(500, 700, 'CRYSTALBROOK', textStyle(34, '#4e925b')).setOrigin(0.5).setAlpha(0.5);
    this.add.text(1740, 710, 'THE FRACTURE', textStyle(34, '#7255b8')).setOrigin(0.5).setAlpha(0.5);
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

  node(id, x, y, texture, label) {
    const sprite = this.add.sprite(x, y, texture).setDepth(y).setScale(id === 'guardian' ? 1.2 : 1);
    this.add.text(x, y - 48, label, this.labelStyle()).setOrigin(0.5).setDepth(y + 20);
    return { id, sprite };
  }

  makeCollisions() {
    this.walls = this.physics.add.staticGroup();
    [[240,300,210,195],[560,315,210,195],[1850,305,210,195],[1570,1045,210,195]].forEach((a) => this.invisible(this.walls, ...a));
    this.water = this.physics.add.staticGroup();
    this.invisible(this.water, 1305, 245, 190, 490);
    this.invisible(this.water, 1305, 955, 190, 690);
  }

  invisible(group, x, y, w, h) {
    const item = group.create(x, y, 'pixel').setDisplaySize(w, h).setVisible(false);
    item.refreshBody();
  }

  makeHud() {
    this.add.rectangle(16, 16, 530, 114, C.cream, 0.96).setOrigin(0).setScrollFactor(0).setDepth(3000).setStrokeStyle(4, 0xffffff);
    this.titleText = this.add.text(32, 28, '', textStyle(21, '#6b4cc5')).setScrollFactor(0).setDepth(3001);
    this.statsText = this.add.text(32, 58, '', textStyle(15)).setScrollFactor(0).setDepth(3001);
    this.questText = this.add.text(32, 85, '', textStyle(15, '#315b65')).setScrollFactor(0).setDepth(3001);
    this.prompt = this.add.text(W / 2, H - 36, '', { ...textStyle(20), backgroundColor: '#fff8df', padding: { x: 17, y: 8 } }).setOrigin(0.5).setScrollFactor(0).setDepth(3200).setVisible(false);

    const masteryButton = this.add.rectangle(W - 92, 46, 150, 54, C.purple, 0.92).setScrollFactor(0).setDepth(3001).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
    this.add.text(W - 92, 46, 'MASTERY', textStyle(17, '#ffffff')).setOrigin(0.5).setScrollFactor(0).setDepth(3002);
    masteryButton.on('pointerdown', () => this.openMastery());
  }

  refreshHud() {
    const needed = profile.level * 100;
    this.titleText.setText(`${profile.companion} • Level ${profile.level} • Evolution ${profile.evolution}`);
    this.statsText.setText(`XP ${profile.xp}/${needed}   ◆ ${profile.crystals}   Coins ${profile.coins}   Streak ${profile.streak}`);
    this.questText.setText(`Daily learning: ${profile.daily.progress}/${profile.daily.target}${profile.daily.claimed ? ' ✓ claimed' : ''}   •   Focus: ${skillNames[lowestSkill()]}`);
  }

  makeTouchControls() {
    const pad = (x, y, symbol, vx, vy) => {
      const c = this.add.circle(x, y, 33, 0xffffff, 0.58).setStrokeStyle(3, 0x6b86a1, 0.55).setScrollFactor(0).setDepth(3300).setInteractive();
      this.add.text(x, y, symbol, textStyle(23, '#315a78')).setOrigin(0.5).setScrollFactor(0).setDepth(3301);
      c.on('pointerdown', () => this.touch.set(vx, vy));
      c.on('pointerup', () => this.touch.set(0, 0));
      c.on('pointerout', () => this.touch.set(0, 0));
    };
    pad(78, H - 72, '◀', -1, 0); pad(148, H - 72, '▶', 1, 0); pad(113, H - 110, '▲', 0, -1); pad(113, H - 34, '▼', 0, 1);
    const act = this.add.circle(W - 76, H - 68, 43, C.gold, 0.92).setStrokeStyle(5, 0xffffff).setScrollFactor(0).setDepth(3300).setInteractive();
    this.add.text(W - 76, H - 68, 'ACT', textStyle(19, '#61420c')).setOrigin(0.5).setScrollFactor(0).setDepth(3301);
    act.on('pointerdown', () => this.interact());
  }

  update() {
    if (this.modalOpen) { this.player.setVelocity(0); return; }
    let x = 0; let y = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) x -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) x += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) y -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) y += 1;
    x += this.touch.x; y += this.touch.y;
    const dir = new Phaser.Math.Vector2(x, y).normalize();
    this.player.setVelocity(dir.x * 210, dir.y * 210);
    if (dir.x) this.player.setFlipX(dir.x < 0);
    this.player.setDepth(this.player.y + 20);
    const followX = this.player.x - (dir.x || 1) * 48;
    const followY = this.player.y - dir.y * 45 + 22;
    this.pet.x = Phaser.Math.Linear(this.pet.x, followX, 0.075);
    this.pet.y = Phaser.Math.Linear(this.pet.y, followY, 0.075);
    this.pet.setDepth(this.pet.y + 10);

    this.near = null;
    for (const node of this.nodes) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, node.sprite.x, node.sprite.y) < 120) { this.near = node.id; break; }
    }
    const labels = { mira: 'Talk to Mira', training: 'Start focused training', rift: 'Enter adaptive rift', guardian: 'Challenge Guardian', daily: 'Claim daily reward' };
    this.prompt.setText(this.near ? `Press E / ACT — ${labels[this.near]}` : '').setVisible(Boolean(this.near));
    if (Phaser.Input.Keyboard.JustDown(this.keys.E) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.interact();
  }

  collectCrystal(crystal) {
    if (!crystal.active || crystal.getData('collected')) return;
    crystal.setData('collected', true);
    crystal.disableBody(true, true);
    grantRewards(8, 2, 1);
    this.refreshHud();
    this.message('Memory crystal collected: +8 XP, +1 crystal', 1600);
  }

  interact() {
    if (this.modalOpen || !this.near) return;
    if (this.near === 'mira') this.openDialogue();
    if (this.near === 'training') this.startSession('training', 3);
    if (this.near === 'rift') this.startSession('rift', Math.min(5, 3 + Math.floor(profile.level / 3)));
    if (this.near === 'guardian') this.startSession('guardian', 5);
    if (this.near === 'daily') this.claimDaily();
  }

  openDialogue() {
    const focus = lowestSkill();
    this.simpleModal('Mira’s Guidance', `${profile.companion} is learning from every answer.\n\nYour adaptive focus is ${skillNames[focus]} because it currently needs the most support.\n\nTraining is short and safe. Rifts give better rewards. The Guardian tests several skills.`, 'Continue');
  }

  claimDaily() {
    if (profile.daily.claimed) return this.message('Today’s crystal reward has already been claimed.', 2200);
    if (profile.daily.progress < profile.daily.target) return this.message(`Complete ${profile.daily.target - profile.daily.progress} more learning encounters first.`, 2500);
    profile.daily.claimed = true;
    const levelled = grantRewards(70, 45, 5);
    this.refreshHud();
    this.message(`Daily reward claimed! +70 XP, +45 coins, +5 crystals${levelled ? ' • LEVEL UP!' : ''}`, 3500);
  }

  startSession(type, rounds) {
    this.modalOpen = true;
    const session = { type, rounds, index: 0, correct: 0, questions: [] };
    for (let i = 0; i < rounds; i++) {
      const skill = type === 'training' ? lowestSkill() : type === 'guardian' ? skills[i % skills.length] : (Math.random() < 0.65 ? lowestSkill() : Phaser.Utils.Array.GetRandom(skills));
      session.questions.push(makeQuestion(skill));
    }
    this.showQuestion(session);
  }

  showQuestion(session) {
    const q = session.questions[session.index];
    const overlay = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(6000);
    overlay.add(this.add.rectangle(0, 0, W, H, C.ink, 0.65).setInteractive());
    overlay.add(this.add.rectangle(0, 0, 730, 450, C.cream).setStrokeStyle(8, 0xffffff));
    overlay.add(this.add.text(0, -185, `${session.type.toUpperCase()} • ${session.index + 1}/${session.rounds}`, textStyle(20, '#6b4cc5')).setOrigin(0.5));
    overlay.add(this.add.text(0, -145, skillNames[q.skill], textStyle(18, '#397a68')).setOrigin(0.5));
    overlay.add(this.add.text(0, -78, q.prompt, { ...textStyle(27), align: 'center', wordWrap: { width: 620 } }).setOrigin(0.5));
    const feedback = this.add.text(0, 150, 'Choose the answer that makes sense.', { ...textStyle(17, '#46677c'), align: 'center', wordWrap: { width: 620 } }).setOrigin(0.5);
    overlay.add(feedback);

    q.options.forEach((option, i) => {
      const x = -240 + (i % 2) * 480;
      const y = 20 + Math.floor(i / 2) * 82;
      const b = this.add.rectangle(x, y, 210, 62, i === 0 ? C.mint : 0xd9d0ff).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, y, option, textStyle(22)).setOrigin(0.5);
      overlay.add([b, label]);
      b.on('pointerdown', () => {
        const correct = String(option) === q.answer;
        recordAnswer(q, correct);
        b.disableInteractive();
        if (!correct) {
          feedback.setText(`Not yet. ${q.explanation}\nTry another answer.`).setColor('#b24d64');
          this.tweens.add({ targets: b, angle: 4, duration: 70, yoyo: true, repeat: 2 });
          return;
        }
        session.correct += 1;
        feedback.setText(`Correct! ${q.explanation}`).setColor('#37835a');
        overlay.list.forEach((item) => item.disableInteractive?.());
        this.time.delayedCall(900, () => {
          overlay.destroy(true);
          session.index += 1;
          if (session.index < session.rounds) this.showQuestion(session);
          else this.finishSession(session);
        });
      });
    });
  }

  finishSession(session) {
    const ratio = session.correct / session.rounds;
    let xp = session.type === 'training' ? 30 : session.type === 'rift' ? 65 : 110;
    let coins = session.type === 'training' ? 12 : session.type === 'rift' ? 30 : 60;
    let crystals = session.type === 'training' ? 0 : session.type === 'rift' ? 2 : 5;
    xp = Math.round(xp * (0.65 + ratio * 0.7));
    coins = Math.round(coins * (0.65 + ratio * 0.7));
    if (session.type === 'guardian' && ratio >= 0.6) profile.guardianWins += 1;
    const levelled = grantRewards(xp, coins, crystals);
    this.modalOpen = false;
    this.refreshHud();
    this.message(`${session.type === 'guardian' ? 'Guardian cleared' : 'Session complete'}: ${session.correct}/${session.rounds} correct • +${xp} XP • +${coins} coins${crystals ? ` • +${crystals} crystals` : ''}${levelled ? ' • LEVEL UP!' : ''}`, 4800);
    if (levelled) {
      this.pet.setScale(1 + profile.evolution * 0.12);
      this.cameras.main.flash(500, 255, 240, 150);
    }
  }

  openMastery() {
    if (this.modalOpen) return;
    this.modalOpen = true;
    const overlay = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(7000);
    overlay.add(this.add.rectangle(0, 0, W, H, C.ink, 0.65).setInteractive());
    overlay.add(this.add.rectangle(0, 0, 710, 465, C.cream).setStrokeStyle(8, 0xffffff));
    overlay.add(this.add.text(0, -200, 'Hidden Learning Engine', textStyle(31, '#6b4cc5')).setOrigin(0.5));
    overlay.add(this.add.text(0, -165, 'Questions change based on demonstrated mastery—not age or labels.', textStyle(16, '#46677c')).setOrigin(0.5));
    skills.forEach((skill, i) => {
      const y = -105 + i * 58;
      const value = Math.round(profile.mastery[skill] * 100);
      overlay.add(this.add.text(-300, y, skillNames[skill], textStyle(17)).setOrigin(0, 0.5));
      overlay.add(this.add.rectangle(65, y, 330, 22, 0xded8c8));
      overlay.add(this.add.rectangle(-100 + (330 * profile.mastery[skill]) / 2, y, 330 * profile.mastery[skill], 22, skill === lowestSkill() ? C.gold : C.mint));
      overlay.add(this.add.text(255, y, `${value}%`, textStyle(16)).setOrigin(0.5));
    });
    const close = this.add.rectangle(0, 195, 170, 48, C.purple).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
    overlay.add([close, this.add.text(0, 195, 'BACK TO WORLD', textStyle(16, '#ffffff')).setOrigin(0.5)]);
    close.on('pointerdown', () => { overlay.destroy(true); this.modalOpen = false; });
  }

  simpleModal(title, body, buttonText) {
    this.modalOpen = true;
    const overlay = this.add.container(W / 2, H / 2).setScrollFactor(0).setDepth(6500);
    overlay.add(this.add.rectangle(0, 0, W, H, C.ink, 0.62).setInteractive());
    overlay.add(this.add.rectangle(0, 0, 690, 390, C.cream).setStrokeStyle(8, 0xffffff));
    overlay.add(this.add.text(0, -145, title, textStyle(31, '#6b4cc5')).setOrigin(0.5));
    overlay.add(this.add.text(0, -20, body, { ...textStyle(19), align: 'center', wordWrap: { width: 580 }, lineSpacing: 8 }).setOrigin(0.5));
    const close = this.add.rectangle(0, 140, 180, 52, C.purple).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
    overlay.add([close, this.add.text(0, 140, buttonText, textStyle(18, '#ffffff')).setOrigin(0.5)]);
    close.on('pointerdown', () => { overlay.destroy(true); this.modalOpen = false; });
  }

  message(text, duration = 2500) {
    if (this.messageBox?.active) this.messageBox.destroy();
    this.messageBox = this.add.text(W / 2, 150, text, { ...textStyle(18), align: 'center', backgroundColor: '#fff8df', padding: { x: 20, y: 13 }, wordWrap: { width: 660 } }).setOrigin(0.5).setScrollFactor(0).setDepth(5000).setAlpha(0);
    this.tweens.add({ targets: this.messageBox, alpha: 1, y: 138, duration: 220 });
    this.time.delayedCall(duration, () => {
      if (!this.messageBox?.active) return;
      this.tweens.add({ targets: this.messageBox, alpha: 0, duration: 220, onComplete: () => this.messageBox?.destroy() });
    });
  }

  labelStyle() {
    return { ...textStyle(15), backgroundColor: '#fff8df', padding: { x: 8, y: 4 } };
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
