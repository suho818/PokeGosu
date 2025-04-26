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
  },
  parent: 'phaser-container',
  dom: {
    createContainer: true, // dom요소를 사용하기 위해 반드시 필요
    behindCanvas: false
  }
};

let player, cursors, timerText, startTime, startUI, username, ssid, avoid_num = 0, distance = 0,
isGameStarted, isGameOver, gameOverUI, gameOverScoreText, gameOverHighScoreText;
let obstacles;
let elapsedTime;

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function preload() {
  this.load.image('dpad', 'image/dpad.png');
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
  this.load.scenePlugin({
    key: 'rexuiplugin',
    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
    sceneKey: 'rexUI'
  })
}
let player_img = {
  left: 'pichu-left',
  right: 'pichu-right'
}

function create() {
  this.scale.setGameSize(1200,1200);
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

  player = this.physics.add.sprite(600, 600, 'pichu2');
  player.anims.play('pichu2');
  player.setScale(1);
  player.setSize(22, 35);
  player.setOffset(14,16);
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  obstacles = this.physics.add.group();
  
  isGameStarted = false;
  isGameOver = false;
  startUI = this.add.container(0, 0);
  
  const title = this.add.text(600, 600 - 450, '포케고수', {
    fontFamily: 'GSC',
    fontSize: '120px',
    color: '#000'
  }).setOrigin(0.5);

  const startBtn = this.add.text(600 + 200, 600 - 70, '게임 시작', {
    fontFamily: 'GSC',
    fontSize: '60px',
    color: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();
  
  startBtn.on('pointerdown', () =>
    {
      if (isGameStarted) return;
      this.tweens.add({
        targets: title,
        y: title.y - 600,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: startBtn,
        x: startBtn.x + 600,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: changeBtn,
        x: startBtn.x - 600,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: rankingBtn,
        x: startBtn.x - 600,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: statisticBtn,
        x: startBtn.x + 600,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });

      
      timerText = this.add.text(1030, 20, '0.0s', { 
        fontSize: '40px', fill: '#000000', fontFamily: 'GSC', align: 'left' });
      startTime = this.time.now;
      isGameStarted = true;
      this.time.delayedCall(600, () => 
      {
        startUI.setVisible(true);
        
        patternManager(patternList, this);
      })
    })

  const changeBtn = this.add.text(600 - 200, 600 - 70, '  포켓몬  ', {
    fontFamily: 'GSC',
    fontSize: '60px',
    color: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  changeBtn.on('pointerdown', () => {
    alert('아직 포켓몬 교체를 할 수 없습니다.');
  });

  const rankingBtn = this.add.text(600 - 180, 670, '랭킹', {
    fontFamily: 'GSC',
    fontSize: '60px',
    color: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  rankingBtn.on('pointerdown', () => {
    alert('아직 랭킹기능이 없습니다.');
  });

  const statisticBtn = this.add.text(600 + 180, 670, '통계', {
    fontFamily: 'GSC',
    fontSize: '60px',
    color: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  statisticBtn.on('pointerdown', () => {
    alert('아직 통계기능이 없습니다.');
  });
  const userNameField = this.add.text(50, 20, `${username}`, {
    fontFamily: 'GSC',
    fontSize: '40px',
    color: '#000',
    align: 'left',
    backgroundColor: 'transparent'
  }).setOrigin(0);

  const version = this.add.text(50, 1140, "v0.1.0", {
    fontFamily: 'GSC',
    fontSize: '40px',
    color: '#000',
    align: 'left',
    backgroundColor: 'transparent'
  }).setOrigin(0);
  
  startUI.add([title, startBtn, changeBtn, rankingBtn, statisticBtn, userNameField]);
  createGameOverUI(this);
  


  this.physics.add.overlap(player, obstacles, () => {
    isGameOver = true;
    this.physics.world.pause();
    patternEvents.forEach(timer =>
      timer.remove()
    );
    patternEvents = [];
    
    if (navigator.vibrate) {
      navigator.vibrate(30); // 눌렀을 때 짧게 진동
    }
    const data = {
      ssid: ssid,
      nickname: username,
      time: elapsedTime,
      avoid_num: avoid_num,
      distance: distance
    }
    sendData(data);
    distance = 0;
    avoid_num = 0;
    showGameOverUI(this);
});
  function resetStartUIPosition() {
    title.setPosition(600, 600 - 450);
    title.setAlpha(1);

    startBtn.setPosition(600 + 200, 600 - 70);
    startBtn.setAlpha(1);

    changeBtn.setPosition(600 - 200, 600 - 70);
    changeBtn.setAlpha(1);

    rankingBtn.setPosition(600 + 180, 600 + 70);
    rankingBtn.setAlpha(1);

    statisticBtn.setPosition(600 - 180, 600 + 70);
    statisticBtn.setAlpha(1);

  }

  function restartGame() {
    player.setPosition(600, 600);
    player.setVelocity(0, 0);
    
    
    timerText?.destroy();

    isGameStarted = false;
    isGameOver = false;
    

    startUI.setVisible(true);
    obstacles.clear(true, true);
    resetStartUIPosition();
    
  }

 

  
  function createGameOverUI(scene) {
    const centerX = 600;
    const centerY = 600;
  
    gameOverUI = scene.add.container(centerX, centerY).setVisible(false).setAlpha(1);
  
    const bg = scene.add.rectangle(0, 0, 1000, 1000, 0xfbb917, 1)
      .setStrokeStyle(4, 0xffffff)
      .setOrigin(0.5)
      .setAlpha(0.8);
  
    gameOverScoreText = scene.add.text(0, -100, '현재 기록: 0.0s', {
      fontFamily: 'GSC',
      fontSize: '100px',
      color: '#ffffff'
    }).setOrigin(0.5);

    gameOverHighScoreText = scene.add.text(0, -220, '최고 기록: 0.0s', {
      fontFamily: 'GSC',
      fontSize: '100px',
      color: '#ffffff'
    }).setOrigin(0.5);

  
  
    const retryBtn = scene.add.text(150, 60, '다시하기', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    retryBtn.on('pointerdown', () => {
      obstacles.clear(true, true);
      scene.physics.world.resume();
      gameOverUI.setVisible(false);
      player.setPosition(600, 600);
      player.setVelocity(0, 0);  
    
      timerText?.destroy();
      isGameOver = false;
      timerText = scene.add.text(1030, 20, '0.0s', { 
        fontSize: '40px', fill: '#000000', fontFamily: 'GSC', align: "right" });
    startTime = scene.time.now;
    scene.time.delayedCall(600, () => 
    {
      
      isGameStarted = true;
      patternManager(patternList, scene);
    })
    });
  
    const submitBtn = scene.add.text(150, 180, '등록하기', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    submitBtn.on('pointerdown', () => {
      const score = elapsedTime.toFixed(1);
      console.log(`[등록] ${username} - ${score}s`);
    });

    const rankingBtn = scene.add.text(-150, 180, '랭킹보기', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({useHandCursor: true});
  
    rankingBtn.on('pointerdown', showTop5Ranking);

    const homeBtn = scene.add.text(-150, 60, '시작화면', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    homeBtn.on('pointerdown', () => {
      gameOverUI.setVisible(false);
      restartGame(); // 🚨 이 함수도 외부에 정의돼 있어야 합니다!
      scene.physics.world.resume(); 
    });
  
    gameOverUI.add([bg, gameOverScoreText, gameOverHighScoreText,
       retryBtn, submitBtn, rankingBtn, homeBtn]);
  }
  
  function showGameOverUI(scene) {
    gameOverScoreText.setText(`현재 기록: ${elapsedTime.toFixed(1)}s`);

    const best = getBestRecord();
    if (elapsedTime > best) {
      setBestRecord(elapsedTime);
    }
    gameOverHighScoreText.setText(`최고 기록: ${Math.max(elapsedTime, best).toFixed(1)}s`);

    scene.children.bringToTop(startUI);
    scene.children.bringToTop(gameOverUI);
    gameOverUI.setVisible(true);
    scene.tweens.add({
      targets: gameOverUI,
      alpha: 1,
      duration: 500,
      ease: 'Sine.easeOut'
    });
  }

  function getBestRecord() {
    return parseFloat(localStorage.getItem('bestRecord') || '0');
  }
  
  function setBestRecord(score) {
    const best = getBestRecord();
    if (elapsedTime > best) {
      localStorage.setItem('bestRecord', elapsedTime);
    }
  }

  
}

function setPichuAnimationSpeed(player, targetFrameRate) {
  const animKey = 'pichu2';

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
  if (!isGameStarted) {}
  else if (!isGameOver)
  {
    elapsedTime = (time - startTime)/1000;
    timerText.setText(elapsedTime.toFixed(1) + 's');
    
  }
  movePlayer(this); // this는 Phaser.Scene
  
  
}

function spawnBasicShooter() {
  // 원의 반지름 설정
  const radius = 850;
  
  // 0부터 2π 사이의 랜덤 각도 계산
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  
  // 원 둘레 위에서 랜덤 위치 계산 (x, y)
  const x = 600 + Math.cos(angle) * radius;  // 화면 중앙 (x: 600, y: 600)을 기준으로
  const y = 600 + Math.sin(angle) * radius;

  // 플레이어로 향하는 벡터 계산
  const dx = player.x - x;
  const dy = player.y - y;
  const angleToPlayer = Math.atan2(dy, dx);

  // 텍스처 선택 (왼쪽 또는 오른쪽)
  const texture = dx < 0 ? 'monster-ball' : 'monster-ball'; // 나중에 텍스처 다르게 설정 가능

  // 발사 속도 설정
  const speed = 320;

  // 몬스터 생성 (기존 로직 그대로)
  createBall('monster-ball', x, y, Math.cos(angleToPlayer) * speed, Math.sin(angleToPlayer) * speed);
}

function spawnOctoBurst() {
  const center = { x: player.x, y: player.y };
  let offset = Phaser.Math.Between(0,44);

  for (let i = 0; i < 8; i++) {
    const x = 600+850*Math.cos(Phaser.Math.DegToRad(offset + i*45));
    const y = 600+850*Math.sin(Phaser.Math.DegToRad(offset + i*45));;

    const dx = player.x - x;
    const dy = player.y - y;
    const angle = Math.atan2(dy, dx);
    const speed = 320;
    createBall('monster-ball', x, y, Math.cos(angle) * speed, Math.sin(angle) * speed);
    
}
}

function spawnLineBurst(n) {
  const side = Phaser.Math.Between(0, 3);
  const speed = 320;
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
    createBall('monster-ball', x, y, x_dir*speed, 0, scale = 0.08, flipX=!(x_dir+1));
  }
}
  else if (y==0 || y==1200) {
    let y_dir = (600-y)/600
    for (let i = 0; i < n; i++) {
      x = 1200/(n+1)*(i+1);
      createBall('monster-ball', x, y, 0, y_dir*speed, scale = 0.08);
    }
  }
}

let joystick = {
  active: false,
  delta: { x: 0, y: 0 }
};

function setupDynamicJoystick() {
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');
  const container = document.getElementById('dynamicJoystick');
  const maxDist = 50;

  let origin = { x: 0, y: 0 };

  function setPosition(el, x, y) {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  document.body.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    origin = { x: touch.clientX, y: touch.clientY };

    setPosition(base, origin.x, origin.y);
    setPosition(stick, origin.x, origin.y);
    base.style.display = 'block';
    stick.style.display = 'block';

    joystick.active = true;
  });

  document.body.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;

    const touch = e.touches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;

    const dist = Math.min(Math.hypot(dx, dy), maxDist);
    const angle = Math.atan2(dy, dx);

    const stickX = origin.x + Math.cos(angle) * dist;
    const stickY = origin.y + Math.sin(angle) * dist;

    setPosition(stick, stickX, stickY);

    joystick.delta = {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    };
  });

  document.body.addEventListener('touchend', () => {
    joystick.active = false;
    joystick.delta = { x: 0, y: 0 };
    base.style.display = 'none';
    stick.style.display = 'none';
  });
}



// 드래그 방지
document.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

function createBall (img, x, y, vx, vy, scale = 0.08, flipX = false, flipY = false) {
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
      distance += 1;
    }

  // 2️⃣ D-Pad 입력
  } 

  // 3️⃣ PC 키보드
  else {
    let dx = 0, dy = 0;
    if (cursors.left.isDown) dx = -1;
    if (cursors.right.isDown) dx = 1;
    if (cursors.up.isDown) dy = -1;
    if (cursors.down.isDown) dy = 1;

    const norm = dx !== 0 || dy !== 0 ? 1 / Math.hypot(dx, dy) : 0;
    vx = dx * speed * norm;
    vy = dy * speed * norm;
    if (norm!=0)distance += 1;
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
      const t1 = scene.time.delayedCall(triggerTime*1000, () => {patterns[patternName](...args)});
      patternEvents.push(t1);
    } 
  }
  // 기본 패턴: 1초마다
  patternEvents.push(scene.time.addEvent({
    delay: 300,
    loop: true,
    callback: () => patterns.basicShoot()
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





function initializeIdentity() {
  if(!localStorage.getItem('ssid'))
  {
    ssid = crypto.randomUUID();
    localStorage.setItem('ssid', ssid);
  }
  else{
    ssid = localStorage.getItem('ssid');
  }
  if(!localStorage.getItem('username')) {
    username = '피츄' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('username', username);
    console.log(username);
  }
  else{
    username = localStorage.getItem('username');
  }
}


async function sendData(data) {
  const response = await fetch('https://port-0-game-server-m9xqyfrx52a421f7.sel4.cloudtype.app/submit', {  // 서버 주소 + 엔드포인트
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result);
}

async function showTop5Ranking() {
  try {
    const response = await fetch('https://port-0-game-server-m9xqyfrx52a421f7.sel4.cloudtype.app/ranking');
    const rankings = await response.json();

    let message = '🏆 TOP 5 랭킹 🏆\n\n';
    rankings.forEach((player, idx) => {
      message += `${idx + 1}등: ${player.nickname} (${player.time.toFixed(1)}s)\n`;
    });

    alert(message);
  } catch (err) {
    console.error('랭킹 불러오기 실패:', err);
    alert('랭킹을 불러오지 못했습니다.');
  }
}



document.fonts.ready.then(() => {
  initializeIdentity();
  // ✅ 폰트가 전부 로드된 이후 Phaser 게임 시작
  game = new Phaser.Game(config);
  //setupDpad();
  setupDynamicJoystick();
});
