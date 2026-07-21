import Phaser from 'phaser';
import './style.css';

const W = 960;
const H = 540;
const SAVE_KEY = 'ascend_project_kayla_v4';

const C = {
  ink: 0x17324d,
  cream: 0xfff8df,
  sky: 0x8ee7ff,
  grass: 0x86dc72,
  grass2: 0x69c768,
  path: 0xf5d89a,
  purple: 0x8d72e8,
  mint: 0x73d8bd,
  gold: 0xffca57,
  pink: 0xff8fbd,
};

const skillNames = {
  placeValue: 'Place Value',
  multiplication: 'Multiplication',
  division: 'Division',
  fractions: 'Fractions',
  decimals: 'Decimals',
  percentages: 'Percentages',
  integers: 'Integers',
  algebra: 'Algebra',
  ratio: 'Ratio',
};
const skills = Object.keys(skillNames);

const freshProfile = () => ({
  stage: '',
  schoolYear: 7,
  egg: '',
  companion: '',
  diagnosticComplete: false,
  diagnosticIndex: 0,
  level: 1,
  xp: 0,
  coins: 0,
  crystals: 0,
  streak: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  mastery: Object.fromEntries(skills.map((s) => [s, 0.25])),
  workingLevel: Object.fromEntries(skills.map((s) => [s, 3])),
});

let profile = loadProfile();

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!saved) return freshProfile();
    const base = freshProfile();
    return {
      ...base,
      ...saved,
      mastery: { ...base.mastery, ...(saved.mastery || {}) },
      workingLevel: { ...base.workingLevel, ...(saved.workingLevel || {}) },
    };
  } catch {
    return freshProfile();
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(profile));
}

function style(size = 20, colour = '#17324d') {
  return { fontFamily: 'Nunito, Arial, sans-serif', fontSize: `${size}px`, fontStyle: 'bold', color: colour };
}

function shuffle(values) {
  return Phaser.Utils.Array.Shuffle([...values]);
}

function weakestSkill() {
  return [...skills].sort((a, b) => profile.mastery[a] - profile.mastery[b])[0];
}

function startingLevelFromYear() {
  const y = profile.schoolYear;
  if (y <= 2) return 1;
  if (y <= 4) return 2;
  if (y <= 6) return 3;
  if (y <= 8) return 4;
  return 5;
}

function makeDiagnosticPlan() {
  const start = startingLevelFromYear();
  const core = ['placeValue', 'multiplication', 'division', 'fractions', 'decimals'];
  const high = ['percentages', 'integers', 'algebra', 'ratio'];
  const ordered = profile.stage === 'secondary' ? [...core, ...high] : core;
  return ordered.map((skill, i) => ({ skill, level: Math.max(1, start - (i % 2)) }));
}

function makeQuestion(skill, level = profile.workingLevel[skill] || 1) {
  const pick = (a, b) => Phaser.Math.Between(a, b);
  let prompt = '';
  let answer = '';
  let explanation = '';

  if (skill === 'placeValue') {
    const places = [10, 100, 1000, 10000, 100000];
    const place = places[Math.min(level - 1, places.length - 1)];
    const digit = pick(2, 9);
    const number = digit * place + pick(1, place - 1);
    prompt = `What is the value of ${digit} in ${number.toLocaleString()}?`;
    answer = String(digit * place);
    explanation = `${digit} is in the ${place.toLocaleString()}s place.`;
  } else if (skill === 'multiplication') {
    const max = [5, 10, 12, 15, 20][Math.min(level - 1, 4)];
    const a = pick(2, max);
    const b = pick(2, max);
    prompt = `${a} × ${b} = ?`;
    answer = String(a * b);
    explanation = `${a} groups of ${b} make ${answer}.`;
  } else if (skill === 'division') {
    const divisor = pick(2, level <= 2 ? 5 : level <= 4 ? 10 : 15);
    const quotient = pick(2, level <= 2 ? 6 : level <= 4 ? 12 : 18);
    prompt = `${divisor * quotient} ÷ ${divisor} = ?`;
    answer = String(quotient);
    explanation = `${divisor} fits into ${divisor * quotient} exactly ${quotient} times.`;
  } else if (skill === 'fractions') {
    const den = [4, 6, 8, 10, 12][Math.min(level - 1, 4)];
    const num = pick(1, den - 1);
    const mult = pick(2, 4);
    prompt = `Which fraction is equivalent to ${num}/${den}?`;
    answer = `${num * mult}/${den * mult}`;
    explanation = `Multiplying the numerator and denominator by ${mult} keeps the value equal.`;
  } else if (skill === 'decimals') {
    const value = level <= 2 ? pick(1, 9) / 10 : pick(11, 99) / 100;
    const n = Math.round(value * 100);
    prompt = `Which fraction matches ${value}?`;
    answer = level <= 2 ? `${Math.round(value * 10)}/10` : `${n}/100`;
    explanation = `${value} can be read using tenths or hundredths.`;
  } else if (skill === 'percentages') {
    const percent = Phaser.Utils.Array.GetRandom([10, 20, 25, 50, 75]);
    const base = Phaser.Utils.Array.GetRandom([20, 40, 60, 80, 100, 200]);
    prompt = `What is ${percent}% of ${base}?`;
    answer = String((percent / 100) * base);
    explanation = `${percent}% means ${percent} out of 100.`;
  } else if (skill === 'integers') {
    const a = pick(-12, 12);
    const b = pick(-12, 12);
    prompt = `${a} + (${b}) = ?`;
    answer = String(a + b);
    explanation = 'Move right for positive values and left for negative values.';
  } else if (skill === 'algebra') {
    const x = pick(2, 12);
    const add = pick(2, 15);
    prompt = `Solve: x + ${add} = ${x + add}`;
    answer = String(x);
    explanation = `Undo +${add} by subtracting ${add} from both sides.`;
  } else {
    const a = pick(2, 6);
    const b = pick(2, 6);
    const mult = pick(2, 5);
    prompt = `Which ratio is equivalent to ${a}:${b}?`;
    answer = `${a * mult}:${b * mult}`;
    explanation = `Multiply both parts of the ratio by ${mult}.`;
  }

  const options = buildOptions(answer, skill, level);
  return { skill, level, prompt, answer, explanation, options };
}

function buildOptions(answer, skill, level) {
  const correct = String(answer);
  let wrong = [];
  if (correct.includes('/')) {
    const [a, b] = correct.split('/').map(Number);
    wrong = [`${Math.max(1, a - 1)}/${b}`, `${a + 1}/${b}`, `${a}/${b + 1}`];
  } else if (correct.includes(':')) {
    const [a, b] = correct.split(':').map(Number);
    wrong = [`${a + 1}:${b}`, `${a}:${b + 1}`, `${Math.max(1, a - 1)}:${b}`];
  } else {
    const n = Number(correct);
    const step = Math.max(1, Math.round(Math.abs(n) * 0.1));
    wrong = [n + step, n - step, n + level + 1].map(String);
  }
  return shuffle([correct, ...wrong.filter((v) => v !== correct)]).slice(0, 4);
}

function record(q, correct, diagnostic = false) {
  profile.totalAttempts += 1;
  if (correct) {
    profile.totalCorrect += 1;
    profile.streak += 1;
    profile.mastery[q.skill] = Math.min(1, profile.mastery[q.skill] + (diagnostic ? 0.08 : 0.045));
    if (profile.mastery[q.skill] > 0.72) profile.workingLevel[q.skill] = Math.min(6, q.level + 1);
  } else {
    profile.streak = 0;
    profile.mastery[q.skill] = Math.max(0.08, profile.mastery[q.skill] - (diagnostic ? 0.04 : 0.018));
    if (diagnostic || profile.mastery[q.skill] < 0.22) profile.workingLevel[q.skill] = Math.max(1, q.level - 1);
  }
  save();
}

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff).fillRect(0, 0, 2, 2); g.generateTexture('pixel', 2, 2); g.clear();
    g.fillStyle(0x3977b3).fillEllipse(24, 39, 35, 19); g.fillStyle(0x5597d2).fillCircle(24, 24, 18); g.fillStyle(0xf3c39f).fillCircle(24, 17, 11); g.generateTexture('player', 48, 52); g.clear();
    g.fillStyle(0x6d56d8).fillEllipse(24, 35, 36, 23); g.fillStyle(0x9b83f4).fillCircle(24, 21, 17); g.fillTriangle(10, 15, 17, 0, 21, 16).fillTriangle(27, 16, 32, 0, 39, 15); g.fillStyle(0xffe78a).fillCircle(19, 20, 3).fillCircle(29, 20, 3); g.generateTexture('companion', 48, 48); g.clear();
    g.fillStyle(0xffd1a8).fillCircle(22, 16, 11); g.fillStyle(0x7e4a2f).fillEllipse(22, 10, 24, 13); g.fillStyle(0x7bcb70).fillRoundedRect(8, 25, 28, 24, 8); g.generateTexture('mira', 44, 52); g.clear();
    g.fillStyle(0xc6f8ff).fillTriangle(18, 0, 36, 34, 0, 34); g.fillStyle(0xffffff, 0.8).fillTriangle(18, 5, 28, 28, 10, 28); g.generateTexture('crystal', 36, 36); g.destroy();
    this.scene.start(!profile.stage ? 'Learner' : !profile.companion ? 'Egg' : !profile.diagnosticComplete ? 'Diagnostic' : 'World');
  }
}

class LearnerScene extends Phaser.Scene {
  constructor() { super('Learner'); }
  create() {
    this.cameras.main.setBackgroundColor(C.sky);
    this.add.rectangle(W / 2, 430, W, 220, C.grass);
    this.add.text(W / 2, 64, 'WHO IS BEGINNING THIS ADVENTURE?', { ...style(36, '#6b4cc5'), fontFamily: 'Baloo 2, Arial' }).setOrigin(0.5);
    this.add.text(W / 2, 112, 'School year helps us choose where to begin. It never limits what you can learn.', style(18)).setOrigin(0.5);
    this.button(330, 210, 260, 82, 'PRIMARY\nYears 1–6', C.mint, () => this.chooseStage('primary'));
    this.button(630, 210, 260, 82, 'SECONDARY\nYears 7–12', C.purple, () => this.chooseStage('secondary'));
    this.yearText = this.add.text(W / 2, 314, 'Choose a section first', style(22, '#315b65')).setOrigin(0.5);
  }
  chooseStage(stage) {
    profile.stage = stage;
    const years = stage === 'primary' ? [1,2,3,4,5,6] : [7,8,9,10,11,12];
    this.yearText.setText('Choose the learner’s current school year');
    years.forEach((year, i) => {
      const x = 255 + (i % 3) * 225;
      const y = 375 + Math.floor(i / 3) * 65;
      this.button(x, y, 170, 48, `Year ${year}`, year === 7 ? C.gold : C.cream, () => {
        profile.schoolYear = year;
        save();
        this.scene.start('Egg');
      });
    });
  }
  button(x, y, w, h, label, colour, action) {
    const b = this.add.rectangle(x, y, w, h, colour).setStrokeStyle(5, 0xffffff).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, { ...style(20, colour === C.purple ? '#ffffff' : '#17324d'), align: 'center' }).setOrigin(0.5);
    b.on('pointerdown', action);
  }
}

class EggScene extends Phaser.Scene {
  constructor() { super('Egg'); }
  create() {
    this.cameras.main.setBackgroundColor(C.sky);
    this.add.rectangle(W / 2, 420, W, 250, C.grass);
    this.add.text(W / 2, 60, 'ASCEND', { ...style(60), fontFamily: 'Baloo 2, Arial', stroke: '#fff', strokeThickness: 8 }).setOrigin(0.5);
    this.add.text(W / 2, 122, 'Choose the egg that feels like yours', style(28, '#6b4cc5')).setOrigin(0.5);
    const eggs = [['Bloom Egg',270,C.pink,0xffe0ef],['Starlight Egg',480,0x9b83f4,0xffe57d],['Tide Egg',690,C.mint,0xd9fff6]];
    eggs.forEach(([name,x,base,spots]) => {
      const box = this.add.container(x, 320);
      box.add([this.add.circle(0,5,82,base,0.25),this.add.ellipse(0,88,112,24,0x315b65,0.22),this.add.ellipse(0,0,112,150,base).setStrokeStyle(7,0xffffff),this.add.ellipse(-24,-18,25,17,spots).setAngle(-20),this.add.ellipse(25,18,30,20,spots).setAngle(15),this.add.text(0,116,name,{...style(20),backgroundColor:'#fff8df',padding:{x:12,y:6}}).setOrigin(0.5)]);
      box.setSize(150,230).setInteractive({ useHandCursor: true });
      box.on('pointerdown', () => { profile.egg = name; save(); this.scene.start('Name'); });
    });
  }
}

class NameScene extends Phaser.Scene {
  constructor() { super('Name'); }
  create() {
    this.cameras.main.setBackgroundColor(0xc8f4ff);
    this.add.rectangle(W / 2, H - 70, W, 140, C.grass);
    this.add.sprite(W / 2, 220, 'companion').setScale(2.5);
    this.add.text(W / 2, 65, `${profile.egg} has awakened!`, style(38, '#6b4cc5')).setOrigin(0.5);
    this.add.text(W / 2, 112, 'Choose your companion’s name', style(22)).setOrigin(0.5);
    ['Nova','Pip','Lumi','Mochi','Spark','Echo'].forEach((name,i) => {
      const x = 260 + (i % 3) * 220; const y = 360 + Math.floor(i / 3) * 70;
      const b = this.add.rectangle(x,y,175,52,i===0?C.gold:C.cream).setStrokeStyle(4,0xffffff).setInteractive({ useHandCursor: true });
      this.add.text(x,y,name,style(21)).setOrigin(0.5);
      b.on('pointerdown', () => { profile.companion = name; save(); this.scene.start('Diagnostic'); });
    });
  }
}

class DiagnosticScene extends Phaser.Scene {
  constructor() { super('Diagnostic'); }
  create() {
    this.plan = makeDiagnosticPlan();
    this.index = Math.min(profile.diagnosticIndex || 0, this.plan.length - 1);
    this.cameras.main.setBackgroundColor(C.sky);
    this.add.text(W / 2, 44, 'THE AWAKENING PATH', style(31, '#6b4cc5')).setOrigin(0.5);
    this.add.text(W / 2, 82, 'These encounters quietly find the best place to begin. They are not a test or a grade.', style(17)).setOrigin(0.5);
    this.showNext();
  }
  showNext() {
    if (this.card) this.card.destroy(true);
    if (this.index >= this.plan.length) {
      profile.diagnosticComplete = true;
      profile.diagnosticIndex = this.plan.length;
      save();
      this.scene.start('World');
      return;
    }
    const item = this.plan[this.index];
    const q = makeQuestion(item.skill, item.level);
    this.card = this.add.container(W / 2, 310);
    this.card.add(this.add.rectangle(0,0,760,390,C.cream).setStrokeStyle(8,0xffffff));
    this.card.add(this.add.text(0,-162,`Encounter ${this.index + 1} of ${this.plan.length}`,style(18,'#6b4cc5')).setOrigin(0.5));
    this.card.add(this.add.text(0,-125,skillNames[q.skill],style(18,'#397a68')).setOrigin(0.5));
    this.card.add(this.add.text(0,-66,q.prompt,{...style(28),align:'center',wordWrap:{width:650}}).setOrigin(0.5));
    const feedback = this.add.text(0,150,'Choose the answer that makes the most sense.',style(17,'#46677c')).setOrigin(0.5);
    this.card.add(feedback);
    q.options.forEach((option,i) => {
      const x = -235 + (i % 2) * 470; const y = 20 + Math.floor(i / 2) * 78;
      const b = this.add.rectangle(x,y,210,58,i===0?C.mint:0xd9d0ff).setStrokeStyle(4,0xffffff).setInteractive({ useHandCursor: true });
      this.card.add([b,this.add.text(x,y,option,style(22)).setOrigin(0.5)]);
      b.on('pointerdown', () => {
        const correct = String(option) === q.answer;
        record(q, correct, true);
        feedback.setText(correct ? `Good thinking. ${q.explanation}` : `That helps us find the right starting point. ${q.explanation}`).setColor(correct ? '#37835a' : '#b24d64');
        this.card.list.forEach((obj) => obj.disableInteractive?.());
        profile.diagnosticIndex = ++this.index;
        save();
        this.time.delayedCall(950, () => this.showNext());
      });
    });
  }
}

class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }
  create() {
    this.modalOpen = false;
    this.physics.world.setBounds(0,0,1800,1050);
    this.cameras.main.setBounds(0,0,1800,1050);
    const g = this.add.graphics();
    g.fillStyle(C.grass).fillRect(0,0,1800,1050);
    g.fillStyle(C.path).fillRoundedRect(80,420,1640,190,80);
    g.fillRoundedRect(220,680,1150,250,100);
    this.player = this.physics.add.sprite(260,520,'player').setCollideWorldBounds(true);
    this.pet = this.add.sprite(215,560,'companion');
    this.nodes = [this.node('mira',650,520,'mira','Mira'),this.node('training',520,800,'crystal','Focused Training'),this.node('rift',1040,800,'crystal','Adaptive Rift')];
    this.cameras.main.startFollow(this.player,true,0.08,0.08);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
    this.touch = new Phaser.Math.Vector2();
    this.add.rectangle(16,16,600,112,C.cream,0.96).setOrigin(0).setScrollFactor(0).setDepth(3000).setStrokeStyle(4,0xffffff);
    this.hud = this.add.text(32,28,'',style(17)).setScrollFactor(0).setDepth(3001);
    this.prompt = this.add.text(W/2,H-34,'',{...style(20),backgroundColor:'#fff8df',padding:{x:18,y:8}}).setOrigin(0.5).setScrollFactor(0).setDepth(3200).setVisible(false);
    this.makeTouchControls();
    this.refreshHud();
  }
  node(id,x,y,texture,label) {
    const sprite = this.add.sprite(x,y,texture).setDepth(y);
    this.add.text(x,y-50,label,{...style(15),backgroundColor:'#fff8df',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(y+10);
    return { id, sprite };
  }
  makeTouchControls() {
    const pad=(x,y,s,vx,vy)=>{const b=this.add.circle(x,y,33,0xffffff,0.6).setStrokeStyle(3,0x6b86a1).setScrollFactor(0).setDepth(3300).setInteractive();this.add.text(x,y,s,style(23)).setOrigin(0.5).setScrollFactor(0).setDepth(3301);b.on('pointerdown',()=>this.touch.set(vx,vy));b.on('pointerup',()=>this.touch.set(0,0));b.on('pointerout',()=>this.touch.set(0,0));};
    pad(78,H-72,'◀',-1,0);pad(148,H-72,'▶',1,0);pad(113,H-110,'▲',0,-1);pad(113,H-34,'▼',0,1);
    const act=this.add.circle(W-76,H-68,43,C.gold).setStrokeStyle(5,0xffffff).setScrollFactor(0).setDepth(3300).setInteractive();this.add.text(W-76,H-68,'ACT',style(19)).setOrigin(0.5).setScrollFactor(0).setDepth(3301);act.on('pointerdown',()=>this.interact());
  }
  refreshHud() {
    const focus=weakestSkill();
    this.hud.setText(`${profile.companion} • Level ${profile.level} • Year ${profile.schoolYear}\nXP ${profile.xp}   Coins ${profile.coins}   Crystals ${profile.crystals}   Streak ${profile.streak}\nAdaptive focus: ${skillNames[focus]} • Working level ${profile.workingLevel[focus]}`);
  }
  update() {
    if (this.modalOpen) { this.player.setVelocity(0); return; }
    let x=0,y=0;if(this.cursors.left.isDown||this.keys.A.isDown)x--;if(this.cursors.right.isDown||this.keys.D.isDown)x++;if(this.cursors.up.isDown||this.keys.W.isDown)y--;if(this.cursors.down.isDown||this.keys.S.isDown)y++;x+=this.touch.x;y+=this.touch.y;
    const dir=new Phaser.Math.Vector2(x,y).normalize();this.player.setVelocity(dir.x*210,dir.y*210);this.pet.x=Phaser.Math.Linear(this.pet.x,this.player.x-(dir.x||1)*48,0.075);this.pet.y=Phaser.Math.Linear(this.pet.y,this.player.y-dir.y*45+22,0.075);
    this.near=null;for(const n of this.nodes){if(Phaser.Math.Distance.Between(this.player.x,this.player.y,n.sprite.x,n.sprite.y)<120){this.near=n.id;break;}}
    const labels={mira:'Talk to Mira',training:'Start focused training',rift:'Enter adaptive rift'};this.prompt.setText(this.near?`Press E / ACT — ${labels[this.near]}`:'').setVisible(Boolean(this.near));if(Phaser.Input.Keyboard.JustDown(this.keys.E)||Phaser.Input.Keyboard.JustDown(this.keys.SPACE))this.interact();
  }
  interact() {
    if(this.modalOpen||!this.near)return;
    if(this.near==='mira')this.infoModal();
    else this.startSession(this.near==='training'?3:5);
  }
  infoModal() {
    this.modalOpen=true;const overlay=this.add.container(W/2,H/2).setScrollFactor(0).setDepth(6000);overlay.add(this.add.rectangle(0,0,W,H,C.ink,0.62));overlay.add(this.add.rectangle(0,0,700,400,C.cream).setStrokeStyle(8,0xffffff));overlay.add(this.add.text(0,-145,'Mira’s Guidance',style(31,'#6b4cc5')).setOrigin(0.5));overlay.add(this.add.text(0,-20,`You are in Year ${profile.schoolYear}, but ASCEND does not trap you at Year ${profile.schoolYear} work.\n\nIt strengthens missing foundations first, then moves forward as soon as you demonstrate mastery.\n\nCurrent focus: ${skillNames[weakestSkill()]}.`,{...style(19),align:'center',wordWrap:{width:580}}).setOrigin(0.5));const close=this.add.rectangle(0,145,190,52,C.purple).setStrokeStyle(4,0xffffff).setInteractive({useHandCursor:true});overlay.add([close,this.add.text(0,145,'CONTINUE',style(18,'#ffffff')).setOrigin(0.5)]);close.on('pointerdown',()=>{overlay.destroy(true);this.modalOpen=false;});
  }
  startSession(rounds) {
    this.modalOpen=true;const session={rounds,index:0,correct:0};this.showQuestion(session);
  }
  showQuestion(session) {
    const skill=Math.random()<0.7?weakestSkill():Phaser.Utils.Array.GetRandom(skills.filter((s)=>profile.stage==='secondary'||!['percentages','integers','algebra','ratio'].includes(s)));
    const q=makeQuestion(skill,profile.workingLevel[skill]);
    const overlay=this.add.container(W/2,H/2).setScrollFactor(0).setDepth(7000);
    overlay.add(this.add.rectangle(0,0,W,H,C.ink,0.65));
    overlay.add(this.add.rectangle(0,0,740,455,C.cream).setStrokeStyle(8,0xffffff));
    overlay.add(this.add.text(0,-190,`ADAPTIVE RIFT • ${session.index+1}/${session.rounds}`,style(20,'#6b4cc5')).setOrigin(0.5));
    overlay.add(this.add.text(0,-150,`${skillNames[q.skill]} • Working level ${q.level}`,style(17,'#397a68')).setOrigin(0.5));
    overlay.add(this.add.text(0,-80,q.prompt,{...style(27),align:'center',wordWrap:{width:620}}).setOrigin(0.5));
    const feedback=this.add.text(0,160,'Choose the answer that makes sense.',{...style(17,'#46677c'),align:'center',wordWrap:{width:620}}).setOrigin(0.5);overlay.add(feedback);
    q.options.forEach((option,i)=>{const x=-240+(i%2)*480;const y=20+Math.floor(i/2)*82;const b=this.add.rectangle(x,y,215,62,i===0?C.mint:0xd9d0ff).setStrokeStyle(4,0xffffff).setInteractive({useHandCursor:true});overlay.add([b,this.add.text(x,y,option,style(22)).setOrigin(0.5)]);b.on('pointerdown',()=>{const correct=String(option)===q.answer;record(q,correct,false);if(!correct){feedback.setText(`Not yet. ${q.explanation}\nChoose another answer.`).setColor('#b24d64');b.disableInteractive();return;}session.correct++;feedback.setText(`Correct. ${q.explanation}`).setColor('#37835a');overlay.list.forEach((o)=>o.disableInteractive?.());this.time.delayedCall(850,()=>{overlay.destroy(true);session.index++;if(session.index<session.rounds)this.showQuestion(session);else this.finishSession(session);});});});
  }
  finishSession(session) {
    const ratio=session.correct/session.rounds;profile.xp+=Math.round(30+ratio*50);profile.coins+=Math.round(10+ratio*25);profile.crystals+=ratio>=0.6?2:0;while(profile.xp>=profile.level*100){profile.xp-=profile.level*100;profile.level++;}save();this.modalOpen=false;this.refreshHud();
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
  scene: [BootScene, LearnerScene, EggScene, NameScene, DiagnosticScene, WorldScene],
});