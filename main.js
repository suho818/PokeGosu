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
      debug: false
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
  this.load.image('ball-left', 'image/cuteghost2.png');
  this.load.image('ball-right', 'image/cuteghost-right2.png');
  this.load.image('pachirisu', 'image/pachirisu-left.png');
  this.load.image('emonga-left', 'image/emonga-left.png');
  this.load.image('emonga-right', 'image/emonga-right.png');
  this.load.image('pichu-left', 'image/pichu-left.png');
  this.load.image('pichu-right', 'image/pichu-right.png');

  this.load.image('obstacle-left', 'image/cuteghost9.png');
  this.load.image('obstacle-right', 'image/cuteghost-right9.png');
  this.load.image('monster-ball', 'image/monster-ball.png')
}
let player_img = {
  left: 'pichu-left',
  right: 'pichu-right'
}

const patterns = {
  basicShooter: function (scene) {
    spawnObstacleTowardPlayer(scene);
  },
  octoBurst: function (scene) {
    spawnEightDirectionalBurst(scene);
  },
}

let patternEvents = [];

function create() {
  player = this.physics.add.image(400, 300, player_img.right);
  player.setScale(0.15);
  player.setSize(220, 510);
  player.setOffset(285,265);
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

  // 기본 패턴: 1초마다
  patternEvents.push(this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => patterns.basicShooter(this)
  }));

   // 30초부터 팔각 패턴 시작
   this.time.delayedCall(30000, () => {
    patterns.octoBurst(this);
    patternEvents.push(this.time.addEvent({
      delay: 15000,
      loop: true,
      callback: () => patterns.octoBurst(this)
    }));
  });

  //60초부터 기본 패턴 하나 더 추가
  this.time.delayedCall(60500, () => {
    patterns.basicShooter(this);
    patternEvents.push(this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => patterns.basicShooter(this)
    }));
  });

}
let lastDir = 'right'; // 기본 방향

function update(time, delta) {
  const speed = 400;
  player.setVelocity(0);
  

  if (isMobileDevice() && joystick.active) {
    const norm = Math.hypot(joystick.delta.x, joystick.delta.y);
    if (norm > 10) {
      const vx = (joystick.delta.x / norm) * speed;
      const vy = (joystick.delta.y / norm) * speed;
      if (vx < 0 && lastDir !== 'left'){
        player.setTexture(player_img.left);
        
        lastDir = 'left';
      }
      else if (vx > 0 && lastDir !== 'right') {
        player.setTexture(player_img.right);
        
        lastDir = 'right';

      }
      player.setVelocity(vx, vy);
    }
  } else {
    if (cursors.left.isDown) {
      player.setVelocityX(-speed);
      if (lastDir !== 'left'){
        player.setTexture(player_img.left);
        lastDir = 'left';
      }
    }
    if (cursors.right.isDown) {
      player.setVelocityX(speed);
      if (lastDir !== 'right'){
        player.setTexture(player_img.right);
        lastDir = 'right';
      }
    }
    if (cursors.up.isDown) player.setVelocityY(-speed);
    if (cursors.down.isDown) player.setVelocityY(speed);
  }

  timerText.setText(((time - startTime) / 1000).toFixed(1) + 's');
}
function spawnObstacleTowardPlayer() {
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
  const obstacle = obstacles.create(x, y, texture);
  obstacle.setScale(0.1);
  
  //obstacle.setScale(0.1);
  //obstacle.setSize(390, 500);
  //obstacle.setOffset(300,200);
  const speed = 300;
  obstacle.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
}

function spawnEightDirectionalBurst() {
  const center = { x: player.x, y: player.y };
  

  for (let i = 0; i < 8; i++) {
    const x = 600+800*Math.cos(Phaser.Math.DegToRad(i*45));
    const y = 600+800*Math.sin(Phaser.Math.DegToRad(i*45));;

    const dx = player.x - x;
    const dy = player.y - y;
    const angle = Math.atan2(dy, dx);

    const obstacle = obstacles.create(x, y, 'monster-ball');
    obstacle.setScale(0.1);

    const speed = 300;
    obstacle.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

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



// 버튼 클릭 시 게임 시작
const btn = document.getElementById('startButton');
btn.onclick = () => {
  btn.remove();
  game = new Phaser.Game(config);
  setupJoystick();
};

// 드래그 방지
document.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

