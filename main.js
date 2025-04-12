let game;
const screenWidth = Math.max(window.innerWidth, 800);
const screenHeight = Math.max(window.innerHeight, 800);
const config = {
  type: Phaser.AUTO,
  width: Math.min(screenHeight,screenWidth),
  height: Math.min(screenHeight,screenWidth),
  backgroundColor: '#1e1e1e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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

function preload() {
  this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
  this.load.image('obstacle', 'https://labs.phaser.io/assets/sprites/red_ball.png');
}

function create() {
  player = this.physics.add.image(400, 300, 'ball');
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  obstacles = this.physics.add.group();

  this.physics.add.overlap(player, obstacles, () => {
    this.scene.pause();
    alert('Game Over!');
    location.reload();
  });

  timerText = this.add.text(650, 20, '0.0s', { fontSize: '20px', fill: '#fff' });
  startTime = this.time.now;

  this.time.addEvent({
    delay: 1000,
    callback: spawnObstacle,
    callbackScope: this,
    loop: true
  });
}

function update(time, delta) {
  const speed = 200;
  player.setVelocity(0);

  if (isMobileDevice() && joystick.active) {
    const norm = Math.hypot(joystick.delta.x, joystick.delta.y);
    if (norm > 10) {
      const vx = (joystick.delta.x / norm) * speed;
      const vy = (joystick.delta.y / norm) * speed;
      player.setVelocity(vx, vy);
    }
  } else {
    if (cursors.left.isDown) player.setVelocityX(-speed);
    if (cursors.right.isDown) player.setVelocityX(speed);
    if (cursors.up.isDown) player.setVelocityY(-speed);
    if (cursors.down.isDown) player.setVelocityY(speed);
  }

  timerText.setText(((time - startTime) / 1000).toFixed(1) + 's');
}
function spawnObstacle() {
  const side = Phaser.Math.Between(0, 3);
  let x, y;

  switch (side) {
    case 0: x = 0; y = Phaser.Math.Between(0, 600); break;         // 왼쪽
    case 1: x = 800; y = Phaser.Math.Between(0, 600); break;       // 오른쪽
    case 2: x = Phaser.Math.Between(0, 800); y = 0; break;         // 위쪽
    case 3: x = Phaser.Math.Between(0, 800); y = 600; break;       // 아래쪽
  }

  const obstacle = obstacles.create(x, y, 'obstacle');
  obstacle.setScale(0.5);

  const dx = player.x - x;
  const dy = player.y - y;
  const angle = Math.atan2(dy, dx);
  const speed = 150;
  obstacle.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
}

let joystick = {
  active: false,
  origin: { x: 0, y: 0 },
  delta: { x: 0, y: 0 }
};

const stick = document.getElementById('joystickStick');
const base = document.getElementById('joystickBase');
const container = document.getElementById('joystickContainer');

function setupJoystick() {
  if (!isMobileDevice()) return;

  container.style.display = 'block';

  base.addEventListener('touchstart', (e) => {
    joystick.active = true;
    const touch = e.touches[0];
    joystick.origin = { x: touch.clientX, y: touch.clientY };
  });

  base.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;
    const touch = e.touches[0];
    joystick.delta = {
      x: touch.clientX - joystick.origin.x,
      y: touch.clientY - joystick.origin.y
    };

    // 제한 반경 30px
    const maxDist = 30;
    const angle = Math.atan2(joystick.delta.y, joystick.delta.x);
    const dist = Math.min(maxDist, Math.hypot(joystick.delta.x, joystick.delta.y));
    stick.style.left = `${30 + Math.cos(angle) * dist}px`;
    stick.style.top = `${30 + Math.sin(angle) * dist}px`;
  });

  base.addEventListener('touchend', () => {
    joystick.active = false;
    joystick.delta = { x: 0, y: 0 };
    stick.style.left = '30px';
    stick.style.top = '30px';
  });
}



// 버튼 클릭 시 게임 시작
const btn = document.getElementById('startButton');
btn.onclick = () => {
  btn.remove();
  game = new Phaser.Game(config);
  setupJoystick();
};


