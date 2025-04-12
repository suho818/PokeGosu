let game;
const screenWidth = Math.min(window.innerWidth, 800);
const screenHeight = Math.min(window.innerHeight, 800);
const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 1200,
  backgroundColor: '#1e1e1e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    max: {
      width: 1200,
      height: 1200
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

  if (cursors.left.isDown) player.setVelocityX(-speed);
  if (cursors.right.isDown) player.setVelocityX(speed);
  if (cursors.up.isDown) player.setVelocityY(-speed);
  if (cursors.down.isDown) player.setVelocityY(speed);

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

// 버튼 클릭 시 게임 시작
const btn = document.getElementById('startButton');
btn.onclick = () => {
  btn.remove();
  game = new Phaser.Game(config);
};

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}



if (isMobileDevice()) {
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  gameWidth = shortEdge;
  gameHeight = shortEdge;
}

