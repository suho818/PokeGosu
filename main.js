let game;
const screenWidth = Math.max(window.innerWidth, 800);
const screenHeight = Math.max(window.innerHeight, 800);
const config = {
  type: Phaser.AUTO,
  width: 1200,//Math.min(screenHeight,screenWidth),
  height: 1200,//Math.min(screenHeight,screenWidth),
  backgroundColor: '#fffdd0',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,
    max: {
      width: Math.min(screenHeight,screenWidth),
      height: Math.min(screenHeight,screenWidth)
    },
    min: {
      width: 400,
      height: 400,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let player, cursors, timerText, startTime;
let obstacles;

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function preload() {
  this.load.image('dpad', 'image/dpad.png');
  this.load.image('ball-left', 'image/cuteghost2.png');
  this.load.image('ball-right', 'image/cuteghost-right2.png');
  this.load.image('emonga-left', 'image/emonga-left.png');
  this.load.image('emonga-right', 'image/emonga-right.png');
  this.load.image('pichu-left', 'image/pichu-left.png');
  this.load.image('pichu-right', 'image/pichu-right.png');
  this.load.spritesheet('pichu', 'image/pichu-spritesheet.png', {
    frameWidth:370,
    frameHeight:400,
  });
  this.load.spritesheet('torchic', 'image/torchic-spritesheet.png', {
    frameWidth:33,
    frameHeight:61,
  });
  this.load.spritesheet('emolga', 'image/emolga-spritesheet.png', {
    frameWidth:66,
    frameHeight:59,
  });
  this.load.spritesheet('pichu2', 'image/pichu-spritesheet2.png', {
    frameWidth:51,
    frameHeight:52,
  });
  this.load.spritesheet('eevee', 'image/eevee-spritesheet.png', {
    frameWidth:64,
    frameHeight:55,
  });
  this.load.spritesheet('pachirisu', 'image/pachirisu-spritesheet.png', {
    frameWidth:57,
    frameHeight:75,
  });

  this.load.image('obstacle-left', 'image/cuteghost9.png');
  this.load.image('obstacle-right', 'image/cuteghost-right9.png');
  this.load.image('monster-ball', 'image/monster-ball.png')
}
let player_img = {
  left: 'pichu-left',
  right: 'pichu-right'
}

function create() {
  this.anims.create({
    key: 'pichu',
    frames: this.anims.generateFrameNumbers('pichu', { start: 0, end: 47 }),
    frameRate: 24,
    repeat: -1
  })
  this.anims.create({
    key: 'torchic',
    frames: this.anims.generateFrameNumbers('torchic', { start: 0, end: 60 }),
    frameRate: 24,
    repeat: -1
  })
  this.anims.create({
    key: 'pichu2',
    frames: this.anims.generateFrameNumbers('pichu2', { start: 0, end: 46 }),
    frameRate: 24,
    repeat: -1
  })
  this.anims.create({
    key: 'eevee',
    frames: this.anims.generateFrameNumbers('eevee', { start: 0, end: 24 }),
    frameRate: 24,
    repeat: -1
  })
  this.anims.create({
    key: 'pachirisu',
    frames: this.anims.generateFrameNumbers('pachirisu', { start: 0, end: 48 }),
    frameRate: 24,
    repeat: -1
  })
  this.anims.create({
    key: 'emolga',
    frames: this.anims.generateFrameNumbers('emolga', { start: 0, end: 98 }),
    frameRate: 24,
    repeat: -1
  })

  player = this.physics.add.sprite(600, 600, 'pichu');
  player.anims.play('pichu');
  player.setScale(0.2);
  player.setSize(33, 61);
  //player.setOffset(100,130);
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  obstacles = this.physics.add.group();

  this.physics.add.overlap(player, obstacles, () => {
    this.scene.pause();
    alert('Game Over!');
    location.reload();
  });


 
 
 
  
  timerText = this.add.text(1000, 20, '0.0s', { fontSize: '40px', fill: '#000000' });
  startTime = this.time.now;
  
  patternManager(patternList, this);
  

}

function setPichuAnimationSpeed(player, targetFrameRate) {
  const animKey = 'pichu';

  const currentAnim = player.anims.currentAnim;
  const currentFrame = player.anims.currentFrame;

  // 애니메이션이 아직 재생된 적 없거나 다른 키라면 play만 실행
  if (!currentAnim || currentAnim.key !== animKey || !currentFrame) {
    player.anims.play({ key: animKey, frameRate: targetFrameRate }, true);
    return;
  }

  // 현재 프레임 인덱스 저장
  const currentIndex = currentFrame.index;

  // 안전하게 프레임 배열 존재 여부 확인
  player.anims.play({ key: animKey, frameRate: targetFrameRate }, true);

  const newAnim = player.anims.currentAnim;
  const frames = newAnim?.frames;

  if (frames && frames[currentIndex]) {
    player.anims.setCurrentFrame(frames[currentIndex]);
  }
}


let lastDir = 'left'; // 기본 방향

function update(time, delta) {
  movePlayer(this); // this는 Phaser.Scene
  timerText.setText(((time - startTime) / 1000).toFixed(1) + 's');
}

function spawnBasicShooter() {
  const side = Phaser.Math.Between(0, 3);
  let x, y;

  switch (side) {
    case 0: x = 0; y = Phaser.Math.Between(0, 1200); break;         // 왼쪽
    case 1: x = 1200; y = Phaser.Math.Between(0, 1200); break;       // 오른쪽
    case 2: x = Phaser.Math.Between(0, 1200); y = 0; break;         // 위쪽
    case 3: x = Phaser.Math.Between(0, 1200); y = 1200; break;       // 아래쪽
  }

  const dx = player.x - x;
  const dy = player.y - y;
  const angle = Math.atan2(dy, dx);
  const texture = dx < 0 ? 'monster-ball' : 'monster-ball';
  const speed = 300;
  createBall('monster-ball', x, y, Math.cos(angle) * speed, Math.sin(angle) * speed);
    
}

function spawnOctoBurst() {
  const center = { x: player.x, y: player.y };
  let offset = Phaser.Math.Between(0,44);

  for (let i = 0; i < 8; i++) {
    const x = 600+800*Math.cos(Phaser.Math.DegToRad(offset + i*45));
    const y = 600+800*Math.sin(Phaser.Math.DegToRad(offset + i*45));;

    const dx = player.x - x;
    const dy = player.y - y;
    const angle = Math.atan2(dy, dx);
    const speed = 300;
    createBall('monster-ball', x, y, Math.cos(angle) * speed, Math.sin(angle) * speed);
    
}
}

function spawnLineBurst(n) {
  const side = Phaser.Math.Between(0, 3);
  const speed = 300;
  let x, y;

  switch (side) {
    case 0: x = 0; y = 600; break;         // 왼쪽
    case 1: x = 1200; y = 600; break;       // 오른쪽
    case 2: x = 600; y = 0; break;         // 위쪽
    case 3: x = 600; y = 1200; break;       // 아래쪽
  }
  if (x==0 || x==1200) {
  let x_dir = (600-x)/600
  for (let i = 0; i < n; i++) {
    y = 1200/(n+1)*(i+1);
    createBall('monster-ball', x, y, x_dir*speed, 0, scale = 0.1, flipX=!(x_dir+1));
  }
}
  else if (y==0 || y==1200) {
    let y_dir = (600-y)/600
    for (let i = 0; i < n; i++) {
      x = 1200/(n+1)*(i+1);
      createBall('monster-ball', x, y, 0, y_dir*speed, scale = 0.1);
    }
  }
}


let joystick = {
  active: false,
  delta: { x: 0, y: 0 }
};

const stick = document.getElementById('joystickStick');
const base = document.getElementById('joystickBase');
const container = document.getElementById('joystickContainer');

function setupJoystick() {
  if (!isMobileDevice()) return;

  container.style.display = 'block';

  document.body.addEventListener('touchstart', (e) => {
    joystick.active = true;
    const touch = e.touches[0];
    const baseRect = base.getBoundingClientRect();
    const centerX = baseRect.left + baseRect.width / 2;
    const centerY = baseRect.top + baseRect.height / 2;

    // 방향 계산
    maxDist = 30;
    joystick.delta = {
      x: touch.clientX - centerX,
      y: touch.clientY - centerY
    }
    const angle = Math.atan2(joystick.delta.y, joystick.delta.x);
    const dist = Math.min(maxDist, Math.hypot(joystick.delta.x, joystick.delta.y));
    stick.style.left = `${30 + Math.cos(angle) * dist}%`;
    stick.style.top = `${30 + Math.sin(angle) * dist}%`;
  });

  document.body.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;
    const touch = e.touches[0];
    const baseRect = base.getBoundingClientRect();
    const centerX = baseRect.left + baseRect.width / 2;
    const centerY = baseRect.top + baseRect.height / 2;

    // 방향 계산
    maxDist = 30;
    joystick.delta = {
      x: touch.clientX - centerX,
      y: touch.clientY - centerY
    }
    const angle = Math.atan2(joystick.delta.y, joystick.delta.x);
    const dist = Math.min(maxDist, Math.hypot(joystick.delta.x, joystick.delta.y));
    stick.style.left = `${30 + Math.cos(angle) * dist}%`;
    stick.style.top = `${30 + Math.sin(angle) * dist}%`;
  });

  document.body.addEventListener('touchend', () => {
    joystick.active = false;
    joystick.delta = { x: 0, y: 0 };
    stick.style.left = '30%';
    stick.style.top = '30%';
  });
}

function setupDpad() {
  if (!isMobileDevice()) {
    document.getElementById('dpadOverlay').style.display = 'none';
    return;
  }
  const dpad = document.getElementById('dpadOverlay');
  dpad.addEventListener('contextmenu', e => e.preventDefault());
const dpadSize = 150;
function updateDpadDirection(e) {
  const rect = dpad.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const dir = getDirectionFromDpad(x, y, dpadSize);

  game.scene.keys.default.dpadDirection = dir;
}
dpad.addEventListener('pointerdown', updateDpadDirection);
dpad.addEventListener('pointermove', updateDpadDirection);
dpad.addEventListener('pointerup', () => {
  game.scene.keys.default.dpadDirection = null;
});
}




function getDirectionFromDpad(x, y, size) {
  const cell = size / 3;
  const col = Math.floor(x / cell);
  const row = Math.floor(y / cell);

  if (col === 1 && row === 1) {
    const offsetX = x % cell;
    const offsetY = y % cell;
    const margin = cell * 0.3;
    if (
      offsetX > margin && offsetX < cell - margin &&
      offsetY > margin && offsetY < cell - margin
    ) return 'center';
    return null;
  }

  const map = {
    '0,0': 'upLeft',
    '0,1': 'left',
    '0,2': 'downLeft',
    '1,0': 'up',
    '1,2': 'down',
    '2,0': 'upRight',
    '2,1': 'right',
    '2,2': 'downRight',
  };

  return map[`${col},${row}`] || null;
}


function getDpadVector(direction) {
  const map = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
    upLeft: [-1, -1],
    upRight: [1, -1],
    downLeft: [-1, 1],
    downRight: [1, 1],
  };
  return map[direction] || [0, 0];
}




// 버튼 클릭 시 게임 시작
const btn = document.getElementById('startButton');
btn.onclick = () => {
  btn.remove();
  game = new Phaser.Game(config);
  //setupJoystick();
  setupDpad();
};

// 드래그 방지
document.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

function createBall (img, x, y, vx, vy, scale = 0.1, flipX = false, flipY = false) {
  const obstacle = obstacles.create(x, y, img);
      obstacle.setScale(scale);
      obstacle.setVelocity(vx,vy);
      obstacle.setCircle(125);
      obstacle.setFlipX(flipX);
      obstacle.setFlipY(flipY);
}
let patternEvents = [];

function movePlayer(scene) {
  const speed = 400;
  //const player = scene.player;
  const joystick = scene.joystick;
  //const cursors = scene.cursors;
  const isMobile = isMobileDevice();
  const threshold = 10;
  let vx = 0, vy = 0;

  player.setVelocity(0); // 기본 정지

  // 1️⃣ 모바일 + 조이스틱
  if (isMobile && joystick?.active) {
    const norm = Math.hypot(joystick.delta.x, joystick.delta.y);
    if (norm > threshold) {
      vx = (joystick.delta.x / norm) * speed;
      vy = (joystick.delta.y / norm) * speed;
    }

  // 2️⃣ D-Pad 입력
  } else if (isMobile && scene.dpadDirection) {
    const [dx, dy] = getDpadVector(scene.dpadDirection);
    const norm = dx !== 0 || dy !== 0 ? 1 / Math.hypot(dx, dy) : 0;
    vx = dx * speed * norm;
    vy = dy * speed * norm;

  // 3️⃣ PC 키보드
  } else {
    let dx = 0, dy = 0;
    if (cursors.left.isDown) dx = -1;
    if (cursors.right.isDown) dx = 1;
    if (cursors.up.isDown) dy = -1;
    if (cursors.down.isDown) dy = 1;

    const norm = dx !== 0 || dy !== 0 ? 1 / Math.hypot(dx, dy) : 0;
    vx = dx * speed * norm;
    vy = dy * speed * norm;
  }

  // 좌우 반전 방향 처리
  if (vx < 0 && scene.lastDir !== 'left') {
    player.setFlipX(false);
    scene.lastDir = 'left';
  } else if (vx > 0 && scene.lastDir !== 'right') {
    player.setFlipX(true);
    scene.lastDir = 'right';
  }

  player.setVelocity(vx, vy);

  // 애니메이션 속도 조절
  if (player.body.velocity.length() > 5) {
    setPichuAnimationSpeed(player, 48);
  } else {
    //setPichuAnimationSpeed(player, 24);
  }
}



function patternManager(patternList, scene)
{ 
  const patterns = {
    basicShoot: function (scene) {
      spawnBasicShooter(scene);
    },
    octoBurst: function (scene) {
      spawnOctoBurst(scene);
    },
    lineBurst: function (n) {
      spawnLineBurst(n);
    }
  }

  for (const pattern of patternList) {
    const [patternName, triggerTime, ...args] = pattern;
    if (patterns[patternName]) {
      scene.time.delayedCall(triggerTime*1000, () => {patterns[patternName](...args)});

    } 
  }
  // 기본 패턴: 1초마다
  patternEvents.push(scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => patterns.octoBurst()
  }));

}

const patternList = [
    ['lineBurst', 15, 5],
    ['octoBurst', 30],
    ['lineBurst', 45, 6],
    ['octoBurst', 52.5],    
    ['octoBurst', 60],
    ['octoBurst', 67.5],
    ['lineBurst', 75, 7],
    ['octoBurst', 90],
    ['lineBurst', 105, 8],
    ['octoBurst', 110],
    ['octoBurst', 115],
    ['octoBurst', 120],
    ['lineBurst', 120, 10],
    ['lineBurst', 122.5, 10],
    ['lineBurst', 125, 10],
    ['lineBurst', 127.5, 10],
    ['lineBurst', 130, 10],
    ['octoBurst', 132],
    ['octoBurst', 134],
    ['octoBurst', 136],
    ['octoBurst', 138],
    ['octoBurst', 140]
]