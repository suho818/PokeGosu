import { preloadAssets } from './preload.js';

let game;
const screenWidth = Math.max(window.innerWidth, 800);
const screenHeight = Math.max(window.innerHeight, 800);
const ratio = 250/116
const config = {
  type: Phaser.AUTO,
  width: 1200,//Math.min(screenHeight,screenWidth),
  height: 1200,//Math.min(screenHeight,screenWidth),
  backgroundColor: '#fffdd0',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
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
    //behindCanvas: false
  }
};

let scene, player, cursors, timerText, startTime, startUI, username, ssid,
stat,
wallet = {'monsterball' : 0, 'superball' : 0, 'hyperball': 0, 'masterball' : 0},
avoid_num = {'monsterball': 0, 'superball': 0, 'hyperball': 0, 'masterball': 0},
avoid_num_now = {'monsterball': 0, 'superball': 0, 'hyperball': 0, 'masterball': 0},
distance = 0, pokedex = 172,
isGameStarted, isGameOver, windowManager, rankingState = 0, 
gameOverUI, gameOverScoreText, gameOverHighScoreText, gameSummaryText,
rankingUI, pokemonUI,
monsterball_text, superball_text, hyperball_text, masterball_text,
nicknameEditUI, inputDOM, setupUI, bgmList, bgm, currentBgmIndex;
let obstacles;
let elapsedTime;
const colorbox = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function preload() {
   preloadAssets(this);
}


function create() {
  scene = this;
  // create 함수에서 음악 초기화
  bgmList = ['My World', 'Lake', 'Login', 'Infinite Stairs'];
  currentBgmIndex = 0;

  bgm = this.sound.add(bgmList[currentBgmIndex], {
  loop: true,
  volume: 0.2
});
  bgm.play();

  this.scale.setGameSize(1200,1200);
  this.anims.create({
    key: 'pichu',
    frames: this.anims.generateFrameNumbers('pichu', { start: 0, end: 46 }),
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
  this.anims.create({
    key: 'celebi',
    frames: this.anims.generateFrameNumbers('celebi', { start: 0, end: 98 }),
    frameRate: 24,
    repeat: -1
  })
  

  player = this.physics.add.sprite(600, 600, 'pichu');
  player.anims.play('pichu');
  player.setScale(1);
  player.setSize(22, 35);
  player.setOffset(14,16);
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  obstacles = this.physics.add.group();
  
  isGameStarted = false;
  isGameOver = false;
  windowManager = 'nothing';
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
      if (windowManager != 'nothing') return;
      isGameStarted = true;
      this.tweens.add({
        targets: title,
        y: title.y - 600,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: startBtn,
        x: startBtn.x + 500,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: changeBtn,
        x: changeBtn.x - 500,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: rankingBtn,
        x: rankingBtn.x + 500,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });
  
      this.tweens.add({
        targets: statisticBtn,
        x: statisticBtn.x - 500,
        alpha: 0,
        duration: 500,
        ease: 'Back.easeIn'
      });

      
      timerText = this.add.text(1180, 20, '0.0s', { 
        fontSize: '40px', fill: '#000000', fontFamily: 'GSC', align: 'left' }).setOrigin(1,0);
      startTime = this.time.now;
      
      editIcon.setVisible(0);
      setupIcon.setVisible(0);
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
    if (isGameStarted) return;
    if (windowManager != 'nothing') return;
    showPokemonUI(this);
  });

  const rankingBtn = this.add.text(600 + 180, 670, '랭킹', {
    fontFamily: 'GSC',
    fontSize: '60px',
    color: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  rankingBtn.on('pointerdown',  () => {
    if (isGameStarted) return;
    if (windowManager != 'nothing') return;
    windowManager = 'ranking';
    showRankingUI(this)});

  const statisticBtn = this.add.text(600 - 180, 670, '통계', {
    fontFamily: 'GSC',
    fontSize: '60px',
    color: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  statisticBtn.on('pointerdown', () => {
    if (isGameStarted) return;
    if (windowManager != 'nothing') return;
    alert('아직 통계기능이 없습니다.');
  });
  const userNameField = this.add.text(20, 20, `${username}`, {
    fontFamily: 'GSC',
    fontSize: '40px',
    color: '#000',
    align: 'left',
    backgroundColor: 'transparent'
  }).setOrigin(0);

  const editIcon = this.add.image(userNameField.x + userNameField.width + 10, 20, 'editicon')
  .setOrigin(0).setInteractive().setScale(0.045)
  .on('pointerdown', () => {
    if(windowManager!='nothing') return;
    showNicknameEditUI(this);
  });

  const setupIcon = this.add.image(1140, 20, 'setupicon')
  .setOrigin(0).setInteractive().setScale(0.08)
  .on('pointerdown', () => {
    if(windowManager!='nothing') return;
    showSetupUI(this);
  });

  const version = this.add.text(20, 1140, "v0.6.2", {
    fontFamily: 'GSC',
    fontSize: '40px',
    color: '#000',
    align: 'left',
    backgroundColor: 'transparent'
  }).setOrigin(0);
  
  startUI.add([title, startBtn, changeBtn, rankingBtn, statisticBtn, userNameField]);
  createNicknameEditUI(this);
  nicknameEditUI.setVisible(false);
  createSetupUI(this);
  createPokemonUI(this);
  pokemonUI.setVisible(false);
  createGameOverUI(this);
  createRankingUI(this);
  stat = initializeStat();
  
 

  

//충돌 감지
  this.physics.add.overlap(player, obstacles, (player, obstacle) => { 
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
      distance: distance,
      pokedex: pokedex
    }
    sendData(data);
    updateStat(stat, data);
    console.log(stat);
    distance = 0;
    updateWalletWithAvoids(avoid_num);
    console.log(wallet);
    avoid_num_now = avoid_num;    
    avoid_num = {'monsterball': 0, 'superball': 0, 'hyperball': 0, 'masterball': 0};
    
    animGameOver(this, obstacle);
    this.time.delayedCall(2100, ()=>{
      windowManager = 'gameover';
    showGameOverUI(this)});
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

  
  function createNicknameEditUI(scene) {
    if (nicknameEditUI && nicknameEditUI.visible) return; // 이미 열려있으면 무시
  
    const container = scene.add.container(600, 600).setDepth(1000);
    nicknameEditUI = container;
  
    // 반투명 배경
    const bg = scene.add.rectangle(0, 0, 700, 400, 0xfbb917, 0.95)
      .setStrokeStyle(4, 0xffffff)
      .setOrigin(0.5);
  
    // 타이틀
    const title = scene.add.text(0, -140, '닉네임을 변경하시겠습니까?', {
      fontFamily: 'GSC',
      fontSize: '50px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const explain = scene.add.text(0, -80, '※변경을 완료해도, 랭킹에 등록된 닉네임은 변하지 않습니다.', {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5);
  
    // 입력 필드
    inputDOM = scene.add.rexInputText(0, 10, 500, 75, { 
      id: 'nicknameInput',
      placeholder: `${username}`,
      maxLength: 10,
      fontFamily: 'GSC',
      fontSize: '45px',
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      borderRadius: 20,
      color: '#000000'})
    inputDOM.setOrigin(0.5, 0.5).setInteractive();
  
   
    // 취소 버튼
    const cancelBtn = scene.add.text(-80, 120, '취소', {
      fontFamily: 'GSC',
      fontSize: '45px',
      color: '#fff',
      backgroundColor: '#333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
  
    cancelBtn.on('pointerdown', () => {
      inputDOM.text = ''
      windowManager = 'nothing';
      container.setVisible(false); // 닫기
    });
  
    // 확인 버튼
    const confirmBtn = scene.add.text(80, 120, '변경', {
      fontFamily: 'GSC',
      fontSize: '45px',
      color: '#fff',
      backgroundColor: '#333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
  
    confirmBtn.on('pointerdown', () => {
      const newName = inputDOM.text;
      console.log(newName);
      if (newName) {
        localStorage.setItem('username', newName);
        if (userNameField) {
          userNameField.setText(newName);
          username = newName;
          // editIcon 위치 조정
          editIcon.setX(userNameField.x + userNameField.width + 10);
        }
      }
      document.getElementById('nicknameInput').blur();
      inputDOM.placeholder = `${username}`;
      windowManager = 'nothing';
      container.setVisible(false); // 닫기
    });
  
    container.add([bg, title, explain, inputDOM, cancelBtn, confirmBtn]);
  }
  
  function showNicknameEditUI(scene) {
    windowManager = 'nameEdit';
    console.log(windowManager);
    inputDOM.text = ''
    inputDOM.placeholder = `${username}`
    scene.children.bringToTop(nicknameEditUI);
    nicknameEditUI.setVisible(true);
    nicknameEditUI.setScale(0);
    scene.tweens.add({
      targets: nicknameEditUI,
      scale: 1,
      duration: 300,
      ease: 'Sine.easeOut'
    });
  }

function createSetupUI(scene) {
  const centerX = 600;
  const centerY = 600;

  setupUI = scene.add.container(centerX, centerY).setVisible(false).setAlpha(1);
  setupUI.scaleX = 0;

  const bg = scene.add.rectangle(0, 0, 700, 700, 0x333344)
    .setStrokeStyle(4, 0xffffff)
    .setOrigin(0.5)
    .setAlpha(0.95);

  // 타이틀
  const title = scene.add.text(0, -290, '설정', {
    fontFamily: 'GSC',
    fontSize: '75px',
    color: '#ffffff'
  }).setOrigin(0.5);

  const cancelBtn = scene.add.text(328, -325, 'X', {
      fontFamily: 'GSC',
      fontSize: '45px',
      color: '#333',
      backgroundColor: '#fff',
    }).setOrigin(0.5).setInteractive();
  cancelBtn.on('pointerdown', () =>
  {    
    windowManager='nothing'
    setupUI.setVisible(false);
  })

  // 🎚 배경음악 슬라이더
  const bgmVolumeText = scene.add.text(-240, -100, `음악`, {
    fontFamily: 'GSC',
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5);

  const slider1 = scene.rexUI.add.slider({
    x: 0,
    y: -100,
    width: 350,
    height: 20,
    orientation: 'x',
    track: scene.rexUI.add.roundRectangle(0,0,0,0,9, 0x888888),
    indicater: scene.rexUI.add.roundRectangle(0,0,0,0,8, 0xffffff),
    thumb: scene.rexUI.add.roundRectangle(0,0,0,36,10, 0xffffff),
    value: bgm.volume * 2,
    space: {
                top: 4,
                bottom: 4
            },
    
    input: 'drag',
    valuechangeCallback: function (value) {
      bgm.setVolume(value/2);
    },
    
  }).layout();

  // 🎚 배경음악 슬라이더
  const soundVolumeText = scene.add.text(-240, -200, `효과음`, {
    fontFamily: 'GSC',
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5);

  const slider2 = scene.rexUI.add.slider({
    x: 0,
    y: -200,
    width: 350,
    height: 20,
    orientation: 'x',
    track: scene.rexUI.add.roundRectangle(0,0,0,0,9, 0x888888),
    indicater: scene.rexUI.add.roundRectangle(0,0,0,0,8, 0xffffff),
    thumb: scene.rexUI.add.roundRectangle(0,0,0,36,10, 0xffffff),
    value: 1,
    space: {
                top: 4,
                bottom: 4
            },
    
    input: 'drag',
    valuechangeCallback: function (value) {
      
    },
    
  }).layout();

  // 🎶 배경음악 변경
  const bgmNameText = scene.add.text(0, 0, `${bgmList[currentBgmIndex]}`, {
    fontFamily: 'GSC',
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5);

  const bgmPrev = scene.add.text(-20, 80, '◀', {
    fontSize: '48px',
    color: '#ffffff'
  }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
    changeBgm(-1);
    bgmNameText.setText(`${bgmList[currentBgmIndex]}`);
  });

  const bgmNext = scene.add.text(20, 80, '▶', {
    fontSize: '48px',
    color: '#ffffff'
  }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
    changeBgm(1);
    bgmNameText.setText(`${bgmList[currentBgmIndex]}`);
  });

  // 🔁 반복 재생 ON/OFF 버튼
  let isLooping = bgm.loop;
  const loopBtn = scene.add.text(0, 140, `반복 재생: ${isLooping ? 'ON' : 'OFF'}`, {
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
    isLooping = !isLooping;
    bgm.setLoop(isLooping);
    loopBtn.setText(`반복 재생: ${isLooping ? 'ON' : 'OFF'}`);
  });

  

  setupUI.add([bg, title, bgmVolumeText, soundVolumeText, slider1, slider2, bgmNameText, bgmPrev, bgmNext, cancelBtn, loopBtn]);
}

function changeBgm(delta) {
  bgm.stop();
  currentBgmIndex = (currentBgmIndex + delta + bgmList.length) % bgmList.length;
  bgm = game.scene.keys.default.sound.add(bgmList[currentBgmIndex], {
    loop: true,
    volume: Math.min(1, Math.max(0, bgm.volume)) // 유지
  });
  bgm.play();
}

function showSetupUI(scene) {
  windowManager = 'setup';
  scene.children.bringToTop(setupUI);
  setupUI.setVisible(true);
  setupUI.setScale(0);
  scene.tweens.add({
    targets: setupUI,
    scale: 1,
    duration: 300,
    ease: 'Sine.easeOut'
  });
}


  
  function createGameOverUI(scene) {
    const centerX = 600;
    const centerY = 600;
  
    gameOverUI = scene.add.container(centerX, centerY).setVisible(false).setAlpha(1);
    gameOverUI.scale = 0;
    const bg = scene.add.rectangle(0, 0, 1000, 1000, 0xfbb917, 1)
      .setStrokeStyle(4, 0xffffff)
      .setOrigin(0.5)
      .setAlpha(0.8);
    const monsterball_img = scene.add.image(-140,30,'monsterball').setScale(0.12*ratio).setOrigin(0.5)
    monsterball_text =  scene.add.text(-120,30, `X${avoid_num_now['monsterball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)

    const superball_img = scene.add.image(-140,80,'superball').setScale(0.12*ratio).setOrigin(0.5)
    superball_text =  scene.add.text(-120,80, `X${avoid_num_now['superball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)
    
    const hyperball_img = scene.add.image(75,30,'hyperball').setScale(0.12*ratio).setOrigin(0.5)
    hyperball_text =  scene.add.text(95,30, `X${avoid_num_now['hyperball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)

    const masterball_img = scene.add.image(75,80,'masterball').setScale(0.12*ratio).setOrigin(0.5)
    masterball_text =  scene.add.text(95,80, `X${avoid_num_now['masterball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)


    const gameOverTitleText = scene.add.text(0, -410, '게임 오버', {
        fontFamily: 'GSC',
        fontSize: '115px',
        color: '#ffffff'
    }).setOrigin(0.5);


    gameOverScoreText = scene.add.text(0, -95, '현재 기록: 0.0s', {
      fontFamily: 'GSC',
      fontSize: '100px',
      color: '#ffffff'
    }).setOrigin(0.5);

    gameOverHighScoreText = scene.add.text(0, -215, '최고 기록: 0.0s', {
      fontFamily: 'GSC',
      fontSize: '100px',
      color: '#ffffff'
    }).setOrigin(0.5);

    

   
  
    const retryBtn = scene.add.text(150, 170, '다시하기', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    retryBtn.on('pointerdown', () => {
      if (windowManager!='gameover') return;
      obstacles.clear(true, true);
      scene.physics.world.resume();
      gameOverUI.setVisible(false);
      windowManager = 'nothing';
      gameOverUI.scale = 0;
      player.scale = 1;
      player.angle = 0;
      player.setPosition(600, 600);
      player.setVelocity(0, 0);  
    
      timerText?.destroy();
      isGameOver = false;
      timerText = scene.add.text(1180, 20, '0.0s', { 
        fontSize: '40px', fill: '#000000', fontFamily: 'GSC', align: "right" }).setOrigin(1,0);
    startTime = scene.time.now;
    scene.time.delayedCall(600, () => 
    {
      
      isGameStarted = true;
      patternManager(patternList, scene);
    })
    });

    const shareBtn = scene.add.text(150, 290, '공유하기', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    shareBtn.on('pointerdown', () => {
      if (windowManager!='gameover') return;
      alert('아직 공유하기 기능이 없습니다.');
    });
   

    const rankingBtn = scene.add.text(-150, 290, '랭킹보기', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    rankingBtn.on('pointerdown', ()=>{
      if (windowManager!='gameover') return;
      windowManager = 'ranking';
      showRankingUI(scene);
    });

    const homeBtn = scene.add.text(-150, 170, '시작화면', {
      fontFamily: 'GSC',
      fontSize: '60px',
      backgroundColor: '#473406',
      color: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();
  
    homeBtn.on('pointerdown', () => {
      if (windowManager!='gameover') return;
      windowManager = 'nothing';
      gameOverUI.setVisible(false);
      gameOverUI.scale = 0;
      player.scale = 1;
      player.angle = 0;
      editIcon.setVisible(true);
      setupIcon.setVisible(true);
      restartGame(); // 🚨 이 함수도 외부에 정의돼 있어야 합니다!
      scene.physics.world.resume(); 
    });
  
    gameOverUI.add([bg, gameOverTitleText, gameOverScoreText, gameOverHighScoreText, 
       retryBtn, rankingBtn, homeBtn, shareBtn, 
       monsterball_img, monsterball_text, superball_img, superball_text,
       hyperball_img, hyperball_text, masterball_img, masterball_text]);
  }
  
  function showGameOverUI(scene) {
    gameOverScoreText.setText(`현재 기록: ${elapsedTime.toFixed(1)}s`);
    monsterball_text.setText(`X${avoid_num_now['monsterball']}`);
    superball_text.setText(`X${avoid_num_now['superball']}`);
    hyperball_text.setText(`X${avoid_num_now['hyperball']}`);
    masterball_text.setText(`X${avoid_num_now['masterball']}`);

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
      scale: 1,
      duration: 300,
      ease: 'Sine.easeOut'
    });
  }

  function animGameOver(scene, hit_obstacle) {
    let dir = 1;
    if (hit_obstacle.xd > 0) {
      dir = -1
    }
    obstacles.getChildren().forEach( obstacle => {
      if (obstacle !== hit_obstacle) {
        scene.tweens.add({
          targets: obstacle,
          x: obstacle.x + Phaser.Math.Between(-500, 500), 
          y: obstacle.y + Phaser.Math.Between(1200, 3000),
          duration: Phaser.Math.Between(1000, 1500) ,
          ease: 'Back.easeIn'
        })
      }
    })
    
    scene.tweens.chain({
      tweens: [
        {targets: hit_obstacle,
          x: player.x + dir * 40,
          y: player.y - 50,
          angle: -360,
          duration: 400},
        {targets: player,
            angle: -1080,
            x: player.x + dir * 40,
            y: player.y - 50,
            scale: 0,
            duration: 1500}
      ]
    })
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


let hiddenAt = null;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 탭을 벗어난 순간 기록
    hiddenAt = Date.now();
  } else {
    // 다시 돌아온 경우
    if (hiddenAt && isGameStarted && !isGameOver) {
      const pauseDuration = Date.now() - hiddenAt;
      startTime += pauseDuration; // 게임 시간 보정
      hiddenAt = null;
    }
  }
});

let lastDir = 'left'; // 기본 방향

function update(time, delta) {
  if (!isGameStarted) {}
  else if (!isGameOver)
  {
    elapsedTime = (time - startTime)/1000;
    timerText.setText(elapsedTime.toFixed(1) + 's');
    
  }
  movePlayer(this); // this는 Phaser.Scene
  
  obstacles.getChildren().forEach(obstacle =>
  {
    if (
      (obstacle.x < -5 && obstacle.xd < 0)
      || (obstacle.x > 1205 && obstacle.xd > 0)
      || (obstacle.y < -5 && obstacle.yd < 0)
      || (obstacle.y > 1205 && obstacle.yd > 0)
    )
    {
      obstacle.destroy();
      if (!isGameOver){ 
      
      avoid_num[obstacle.balltype] += 1;
      
      }
    }
  }
  )

  if (this.hyperBalls) {
    for (let ball of this.hyperBalls) {
      ball.update?.();
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
    if (windowManager != 'nothing') return;
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

function createBall (img, x, y, vx, vy, scale = 0.08*ratio) {
  const obstacle = obstacles.create(x, y, img);
  let flip = 1;
      obstacle.setScale(scale);
      obstacle.setVelocity(vx,vy);
      obstacle.setCircle(58);
      if (vx > 0) {
        obstacle.setFlipX(true);
        flip = 0;
      };
      obstacle.setRotation(Math.atan2(vy,vx)-Math.PI*flip);
      if (vx*vy!= 0) {
      obstacle.yd = vy/Math.abs(vy);
      obstacle.xd = vx/Math.abs(vx);
      }
      else if (vx == 0) {
        obstacle.xd = 0;
        obstacle.yd = vy/Math.abs(vy);
      }
      else {
        obstacle.xd = vx/Math.abs(vx);
        obstacle.yd = 0;
      }
  obstacle.balltype = img;
  
  if(obstacle.balltype == 'hyperball') {

    const hyperBall = obstacle;
  hyperBall.setBounce(0, 0);
  hyperBall.setCollideWorldBounds(false);
  hyperBall.hasEntered = false;
  hyperBall.bounceCount = 0;

  hyperBall.update = function() {
    const bounds = scene.physics.world.bounds;

    if(!this.hasEntered && this.x >= 0 && this.x <= bounds.width &&
      this.y >= 0 && this.y <= bounds.height) {
        this.hasEntered = true;
        this.setBounce(1,1);

        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
      }

      if (this.bounceCount >= 5) {
          hyperBall.setBounce(0, 0);
  hyperBall.setCollideWorldBounds(false);
        const index = scene.hyperBalls.indexOf(this);
        if(index !== -1) {
          scene.hyperBalls.splice(index, 1);
        }
  
}
      
  }
  scene.physics.world.on('worldbounds', (body)=> {
    if (body.gameObject === hyperBall && hyperBall.hasEntered) {
      
      hyperBall.bounceCount++;
      
      if (body.blocked.up || body.blocked.down) {
            const thisRotation = hyperBall.rotation;
            hyperBall.setRotation(-thisRotation);
      } else if (body.blocked.left || body.blocked.right)
      { 
             hyperBall.setFlipX(!hyperBall.flipX);
      }
      
    }
  });

  scene.hyperBalls = scene.hyperBalls || [];
  scene.hyperBalls.push(hyperBall);
  }

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





function spawnBasicShooter(balltype='monsterball') {
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

  // 발사 속도 설정
  let co_speed = 1;
  switch (balltype) {
    case 'monsterball': co_speed = 1;break;
    case 'superball': co_speed = 1.5;break;
    case 'hyperball': co_speed = 1.2;break;
    case 'masterball': co_speed = 1;break;
  }
  const speed = 320 * co_speed;
  // 몬스터 생성 (기존 로직 그대로)
  createBall(balltype, x, y, Math.cos(angleToPlayer) * speed, Math.sin(angleToPlayer) * speed);
}

function spawnOctoBurst(balltype='monsterball') {
  let co_speed = 1;
  switch (balltype) {
    case 'monsterball': co_speed = 1;break;
    case 'superball': co_speed = 1.5;break;
    case 'hyperball': co_speed = 1.2;break;
    case 'masterball': co_speed = 1;break;
  }
  const speed = 400 * co_speed;
  const center = { x: player.x, y: player.y };
  let offset = Phaser.Math.Between(0,44);

  for (let i = 0; i < 8; i++) {
    const x = 600+850*Math.cos(Phaser.Math.DegToRad(offset + i*45));
    const y = 600+850*Math.sin(Phaser.Math.DegToRad(offset + i*45));;

    const dx = player.x - x;
    const dy = player.y - y;
    const angle = Math.atan2(dy, dx);
    
    createBall(balltype, x, y, Math.cos(angle) * speed, Math.sin(angle) * speed);
    
}
}

function spawnLineBurst(n, balltype='monsterball') {
  const side = Phaser.Math.Between(0, 3);
  let co_speed = 1;
  switch (balltype) {
    case 'monsterball': co_speed = 1;break;
    case 'superball': co_speed = 1.5;break;
    case 'hyperball': co_speed = 1.2;break;
    case 'masterball': co_speed = 1;break;
  }
  const speed = 400 * co_speed;
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
    createBall(balltype, x, y, x_dir*speed, 0, 0.08*ratio);
  }
}
  else if (y==0 || y==1200) {
    let y_dir = (600-y)/600
    for (let i = 0; i < n; i++) {
      x = 1200/(n+1)*(i+1);
      createBall(balltype, x, y, 0, y_dir*speed,0.08*ratio);
    }
  }
}




function patternManager(patternList, scene)
{ 
  const patterns = {
    basicShoot: function (balltype) {
      spawnBasicShooter(balltype);
    },
    octoBurst: function (balltype) {
      spawnOctoBurst(balltype);
    },
    lineBurst: function (n, balltype) {
      spawnLineBurst(n, balltype);
    },
    
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
    callback: () => patterns.basicShoot('monsterball')
  }));

}

const patternList = [ 
    ['lineBurst', 12, 5],['lineBurst', 24, 6], ['lineBurst', 36, 7],
    ['lineBurst', 48, 8],['lineBurst', 60, 9, 'superball'], 
    ['lineBurst', 66, 10, 'superball'], 
    ['lineBurst', 72, 10, 'superball'],
    ['lineBurst', 78, 10, 'superball'],
    ['lineBurst', 84, 10, 'superball'],
    ['lineBurst', 90, 5, 'hyperball'], ['lineBurst', 96, 10],
    ['lineBurst', 102, 7, 'hyperball'],
    ['lineBurst', 108, 10], 
    ['lineBurst', 114, 10, 'hyperball'],
    ['lineBurst', 120, 10, 'hyperball'],
    ['lineBurst', 126, 10, 'superball'], ['lineBurst', 132, 10, 'hyperball'],
    ['octoBurst', 7], ['octoBurst', 14], ['octoBurst', 21],
    ['octoBurst', 28], ['octoBurst', 35], ['octoBurst', 42, 'superball'],
    ['octoBurst', 45, 'superball'], ['octoBurst', 50, 'superball'],
    ['octoBurst', 55, 'superball'], ['octoBurst', 60, 'superball'],
    ['octoBurst', 65, 'superball'], ['octoBurst', 70, 'superball'],
    ['octoBurst', 75, 'superball'], ['octoBurst', 80, 'superball'],
    ['octoBurst', 85, 'superball'], ['octoBurst', 110, 'hyperball'],
    ['octoBurst', 115, 'superball'], ['octoBurst', 120, 'hyperball'],
    ['octoBurst', 125, 'superball'], ['octoBurst', 130, 'hyperball'],
    ['octoBurst', 135, 'superball'], ['octoBurst', 140, 'hyperball'],
    ['octoBurst', 145, 'superball'], ['octoBurst', 150, 'hyperball']
]



function updateWalletWithAvoids(avoid_num) {
  
  for (let key in avoid_num) {
    if (wallet.hasOwnProperty(key)) {
      wallet[key] += avoid_num[key];
    }
  }

  localStorage.setItem('wallet', JSON.stringify(wallet));
}


const pokemonList = [
  { id: 'pichu', name: '피츄', unlocked: true, image: 'pichu', condition: null , price: null , pokedex: 172 },
  { id: 'piplup', name: '팽도리', unlocked: false, image: 'piplup', condition: {best: 150} , price: { monsterball: 10000 }, pokedex: 393 },
  { id: 'torchic', name: '아차모', unlocked: false, image: 'torchic', condition: { best : 300 } , price: { monsterball: 5000, superball: 100 }, pokedex: 255},
  { id: 'pachirisu', name: '파치리스', unlocked: false, image: 'pachirisu', condition: { best : 300 } , price: { monsterball: 5000, superball: 100 }, pokedex: 255, frame: 15},
  { id: 'pikachu', name: '피카츄', unlocked: false, image: 'pikachu', condition: { best : 300 } , price: { monsterball: 5000, superball: 100 }, pokedex: 255},
  { id: 'mew', name: '뮤', unlocked: false, image: 'mew', condition: { best : 300 } , price: { monsterball: 5000, superball: 100 }, pokedex: 255},
  { id: 'porygon', name: '폴리곤', unlocked: false, image: 'porygon', condition: { best : 300 } , price: { monsterball: 5000, superball: 100 }, pokedex: 255},
  { id: 'victini', name: '비크티니', unlocked: false, image: 'victini', condition: { best : 300 } , price: { monsterball: 5000, superball: 100 }, pokedex: 255},

  // ...7마리 더 추가
];

let unlockedPokemon = JSON.parse(localStorage.getItem('unlockedPokemon') || '["pichu"]');
let ownedPokemon = JSON.parse(localStorage.getItem('ownedPokemon') || '["pichu"]');
let selectedPokemon = localStorage.getItem('selectedPokemon') || 'pichu';


function createPokemonUI(scene) {
  const centerX = 600;
  const centerY = 600;

  const ui = scene.add.container(centerX, centerY).setVisible(false).setDepth(100);
  const bg = scene.add.rectangle(0, 0, 1200, 1200, 0xfffdd0) //이쁜 하늘색 0xa2cffe
    .setStrokeStyle(4, 0xffffff)
    .setOrigin(0.5)
    .setAlpha(0.98);
    const monsterball_img = scene.add.image(-330,-550,'monsterball').setScale(0.12*ratio).setOrigin(0.5)
    const monsterball_text =  scene.add.text(-310,-550, `X${wallet['monsterball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)

    const superball_img = scene.add.image(-110,-550,'superball').setScale(0.12*ratio).setOrigin(0.5)
    const  superball_text =  scene.add.text(-90,-550, `X${wallet['superball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)
    
    const hyperball_img = scene.add.image(110,-550,'hyperball').setScale(0.12*ratio).setOrigin(0.5)
    const  hyperball_text =  scene.add.text(130,-550, `X${wallet['hyperball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)

    const masterball_img = scene.add.image(330,-550,'masterball').setScale(0.12*ratio).setOrigin(0.5)
    const masterball_text =  scene.add.text(350,-550, `X${wallet['masterball']}`, {
      fontFamily: 'GSC',
      fontSize: '30px',
      color: '#000000'
    }).setOrigin(0,0.5)
  const BackBtn = scene.add.text(-520, -550, '◀뒤로', {
    fontFamily: 'GSC',
    fontSize: '54px',
    color: '#000000',
  }).setOrigin(0.5).setInteractive();
  BackBtn.on('pointerdown', () =>
  {
    windowManager='nothing'
    
    pokemonUI.setVisible(false); 
  })
  scene.pokemonUI_prop = {
    monsterball_text,
    superball_text,
    hyperball_text,
    masterball_text
  };
  ui.add([bg, BackBtn, monsterball_img, superball_img, hyperball_img, masterball_img,
  monsterball_text, superball_text, hyperball_text, masterball_text
  ]);
  // 상단 포켓몬 정보 박스
  const infoBox = scene.add.container(0, -300);
  const infoBG = scene.add.rectangle(0, 50, 1000, 500, 0xffffff).setStrokeStyle(4, 0x000);
  const infoPokemonBoxBG = scene.add.rectangle(0, 25, 150, 150).setStrokeStyle(2, 0x000);
  const infoText = scene.add.text(0, -150, '피츄', { fontSize: '48px', color: '#000', fontFamily: 'GSC' }).setOrigin(0.5);
  const infoImage = scene.add.image(0, 25, 'pichu').setScale(2.2);
  const actionButton = scene.add.text(0, 220, '선택됨', { fontSize: '48px',  fontFamily: 'GSC', backgroundColor: '#333', color: '#fff', padding: 10 })
    .setInteractive().setOrigin(0.5);

  infoBox.add([infoBG, infoText, infoPokemonBoxBG,infoImage, actionButton ]);

  // 하단 포켓몬 박스 (5x2)
  const boxContainer = scene.add.container(0, 150);
  const cols = 5, rows = 2, spacing = 180;
  pokemonList.forEach((poke, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = (col - 2) * spacing;
    const y = row * spacing;

    const boxBG = scene.add.rectangle(x, y, 150, 150, 0xffffff).setStrokeStyle(2, 0x000);
    const image = scene.add.image(x, y, poke.image,poke.frame || 1).setScale(1);

    if (!unlockedPokemon.includes(poke.id)) {
      const lock = scene.add.text(x, y, '?', { fontSize: '42px', color:'#ffffff' }).setOrigin(0.5);
      image.setTint(0x000000);
      boxContainer.add([boxBG, image, lock]);
    } else {
      boxContainer.add([boxBG, image]);
    }

    boxBG.setInteractive().on('pointerdown', () => {
      renderPokemonInfo(poke);
    });
  });

  // 포켓몬 정보 갱신 함수
  function renderPokemonInfo(poke) {
    infoText.setText(poke.name);
    infoImage.setTexture(poke.image, poke.frame || 1);
    if (unlockedPokemon.includes(poke.id)) {
      infoImage.clearTint();

      actionButton.setText("구매하기");
      actionButton.removeAllListeners();
      actionButton.setInteractive().on('pointerdown', () => {
       purchase(poke.price);
       console.log('구매중');
         
      })

      if (ownedPokemon.includes(poke.id)){
      actionButton.setText(poke.id === selectedPokemon ? '선택됨' : '선택');
      actionButton.removeAllListeners();
      actionButton.setInteractive().on('pointerdown', () => {
        selectedPokemon = poke.id;
        localStorage.setItem('selectedPokemon', selectedPokemon);
        actionButton.setText('선택됨');
      
      });}
    } else {
      infoText.setText('???');
      infoImage.setTint(0x000000);
      const conditionText = Object.entries(poke.condition).map(([k, v]) => `${v}초 이상 생존시`).join(', ');
      actionButton.setText(`${conditionText} 잠금해제`);
      actionButton.removeAllListeners();
      actionButton.setInteractive().on('pointerdown', () => {
        if (canUnlock(poke.condition)) {
          unlockedPokemon.push(poke.id);
      localStorage.setItem('unlockedPokemon', JSON.stringify(unlockedPokemon));

          renderPokemonInfo(poke); // 다시 렌더링
        } else {
          alert('해금 조건을 만족하지 못했습니다!');
        }
      });
    }


  function canUnlock(condition) {
    console.log(stat)
    for (let key in condition) {
      if (stat[key] < condition[key]) return false;
    }
    return true;
  }

  function purchase(price){
    for (let cost in price) {
      if (wallet[cost] < price[cost]) {alert("구매실패"); return false};
    }
    for (let cost in price) {
      wallet[cost] -= price[cost];
      localStorage.setItem('wallet', JSON.stringify(wallet));
      updateWallet(scene);
      renderPokemonInfo(poke);
      ownedPokemon.push(poke.id);
      localStorage.setItem('ownedPokemon', JSON.stringify(ownedPokemon));
      alert("구매성공");
    }
  }
}

  ui.add([infoBox, boxContainer]);
  pokemonUI = ui;
}

function showPokemonUI(scene) {
  windowManager = 'pokemon';
  updateWallet(scene);
  pokemonUI.setVisible(true);
}

function updateWallet(scene) {
  scene.pokemonUI_prop.monsterball_text.setText(`X${wallet['monsterball']}`);
  scene.pokemonUI_prop.superball_text.setText(`X${wallet['superball']}`);
  scene.pokemonUI_prop.hyperball_text.setText(`X${wallet['hyperball']}`);
  scene.pokemonUI_prop.masterball_text.setText(`X${wallet['masterball']}`);
}

function initializeStat() {
  // 최신 구조 선언 (최신 포켓몬 목록 포함)
  let stat = {
    best: 0,
    totalDistance: 0,
    totalSurvivalTime: 0,
    totalPlayCount: 0,
    totalAvoid_p: 0,
    totalAvoid_s: 0,
    totalAvoid_h: 0,
    totalAvoid_m: 0,
    perPokemon: {}
  };

  for (const pokemon of pokemonList) {
    stat.perPokemon[pokemon.id] = {
      best: 0,
      playCount: 0,
      distance: 0,
      survivalTime: 0,
      Avoid_p: 0,
      Avoid_s: 0,
      Avoid_h: 0,
      Avoid_m: 0,
    };
  }

  // 기존 localStorage에서 가져와 병합
  let savedStat = JSON.parse(localStorage.getItem('stat') || 'null');
  if (savedStat) {
    console.log(savedStat);
    // 최상위 필드 병합
    for (let key in stat) {
      if (savedStat[key] !== undefined && key !== stat.perPokemon) {
        stat[key] = savedStat[key];
      }
    }

    // perPokemon 병합 (새 포켓몬이 추가되었을 때도 대비)
    for (let id in stat.perPokemon) {
      if (!savedStat.perPokemon || !savedStat.perPokemon[id]) continue;
      for (let subKey in stat.perPokemon[id]) {
        if (savedStat.perPokemon[id][subKey] !== undefined) {
          stat.perPokemon[id][subKey] = savedStat.perPokemon[id][subKey];
        }
      }
    }
  }

  // 항상 최신 구조 유지
  saveStat(stat);
  return stat;
}

function updateStat(stat, result) {
  stat.totalPlayCount += 1;
  stat.totalSurvivalTime += result.time;
  stat.totalDistance += result.distance;
  stat.totalAvoid_p += result.avoid_num['monsterball'];
  stat.totalAvoid_s += result.avoid_num['superball'];
  stat.totalAvoid_h += result.avoid_num['hyperball'];
  stat.totalAvoid_m += result.avoid_num['masterball'];
  stat.best = Math.max(stat.best, result.time);

  const pokedexMap = {'172': 'pichu' }
  const p = stat.perPokemon[pokedexMap[result.pokedex]];
  if (p) {
    p.best = Math.max(p.best, result.time);
    p.playCount += 1;
    p.distance += result.distance;
    p.survivalTime += result.time;
    p.Avoid_p += result.avoid_num['monsterball'];
    p.Avoid_s += result.avoid_num['superball'];
    p.Avoid_h += result.avoid_num['hyperball'];
    p.Avoid_m += result.avoid_num['masterball'];
  }

  saveStat(stat); // 저장
}

function saveStat(stat) {
  localStorage.setItem('stat', JSON.stringify(stat));
}


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
  wallet = JSON.parse(localStorage.getItem('wallet')) || {
    monsterball: 0,
    superball: 0,
    hyperball: 0,
    masterball: 0
  };
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

async function fetchTotalRanking() {
  try {
    const res = await fetch(`https://port-0-game-server-m9xqyfrx52a421f7.sel4.cloudtype.app/ranking?mode=all&ssid=${ssid}`);
    //const res = await fetch('./test.json'); //test용
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('전체 랭킹 오류:', err);
    return { rankings: [], myRank: null };
  }
}


async function fetchDailyRanking() {
  try {
    const res = await fetch(`https://port-0-game-server-m9xqyfrx52a421f7.sel4.cloudtype.app/ranking?mode=daily&ssid=${ssid}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('일간 랭킹 오류:', err);
    return { rankings: [], myRank: null };
  }
}

async function fetchMyRanking(ssid) {
  try {
    const res = await fetch(`https://port-0-game-server-m9xqyfrx52a421f7.sel4.cloudtype.app/ranking?mode=my&ssid=${ssid}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('내 랭킹 오류:', err);
    return { rankings: [], myRank: null };
  }
}

function updateRankingUI(scene) {
  const loadingText = scene.rankingEntries.loadingText;
  const my_rect = scene.my_rect;
  const my_check = scene.my_check;

  if (loadingText) loadingText.setVisible(true);
  if (my_rect) my_rect.setVisible(false);
  if (my_check) my_check.setVisible(false);
  if (scene.my_extra_rank_line) scene.my_extra_rank_line.destroy();
  if (scene.my_extra_rank) {
    scene.my_extra_rank.rankText.destroy();
    scene.my_extra_rank.nameText.destroy();
    scene.my_extra_rank.timeText.destroy();
    scene.my_extra_rank = null;
  }

  for (let entry of scene.rankingEntries.listEntries) {
    entry.rankText.setVisible(false);
    entry.nameText.setVisible(false);
    entry.timeText.setVisible(false);
  }

  const fetchers = [fetchTotalRanking, fetchDailyRanking, () => fetchMyRanking(ssid)];

  fetchers[rankingState]().then(data => {
    const rankings = data.rankings || data;
    const myRank = data.myRank;
    const myData = data.myData;
    const entries = scene.rankingEntries.listEntries;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const user = rankings[i];

      entry.rankText.setVisible(true);
      entry.nameText.setVisible(true);
      entry.timeText.setVisible(true);

      if (user) {
        entry.rankText.setText(`No.${String(i + 1).padStart(3, '0')}`);
        entry.nameText.setText(user.nickname.padEnd(10, '　'));
        entry.timeText.setText(`${user.time.toFixed(1)}s`);

        // 내 랭킹이면 강조
        if ((user._id === ssid || user.ssid === ssid) && rankingState !== 2) {
          my_rect.setPosition(0, entry.rankText.y).setVisible(true);
          //my_check.setPosition(-420, entry.rankText.y - 20).setAngle(-30).setVisible(true);
        }

      } else {
        entry.rankText.setText(`No.${String(i + 1).padStart(3, '0')}`);
        entry.nameText.setText(`-`);
        entry.timeText.setText(`-`);
      }
    }

      // ✅ 항상 내 순위 표시
      if (rankingState != 2) {
        const y = -225 + entries.length * 63;
  
        // 검은 줄
        scene.my_extra_rank_line = scene.add.rectangle(0, y - 30, 860, 4, 0x000000)
          .setOrigin(0.5);
        rankingUI.add(scene.my_extra_rank_line);
  
        const rankText = scene.add.text(-430, y, `No.${myRank?.toString().padStart(3, '0') || '???'}`, {
          fontFamily: 'GSC',
          fontSize: '48px',
          color: '#000000'
        }).setOrigin(0, 0.5);
  
        const nameText = scene.add.text(-170, y, myData?.nickname.padEnd(10, '　') || username, {
          fontFamily: 'GSC',
          fontSize: '48px',
          color: '#000000'
        }).setOrigin(0, 0.5);
  
        const timeText = scene.add.text(430, y, myData?.time ? `${myData.time.toFixed(1)}s` : '???s', {
          fontFamily: 'GSC',
          fontSize: '48px',
          color: '#000000'
        }).setOrigin(1, 0.5);
  
        rankingUI.add([rankText, nameText, timeText]);
  
        scene.my_extra_rank = {
          rankText, nameText, timeText
        };
      }

    if (loadingText) loadingText.setVisible(false);
  }).catch(err => {
    console.error('랭킹 불러오기 실패:', err);
    if (loadingText) loadingText.setVisible(false);
  });

}
  



function createRankingUI(scene) {
  const centerX = 600;
  const centerY = 600;

  rankingUI = scene.add.container(centerX, centerY).setVisible(false).setAlpha(1);
  rankingUI.scaleX = 0;

  // 배경
  const bg = scene.add.rectangle(0, 0, 1000, 1000, 0xfbb917) //이쁜 하늘색 0xa2cffe
    .setStrokeStyle(4, 0xffffff)
    .setOrigin(0.5)
    .setAlpha(0.98);

    const bg2 = scene.add.rectangle(0, 90, 880, 700, 0xfffdd0)
    .setOrigin(0.5)
    .setAlpha(0.98);
  
    const loadingText = scene.add.text(0, 0, '불러오는 중...', {
      fontFamily: 'GSC',
      fontSize: '50px',
      color: '#000000'
    }).setOrigin(0.5).setVisible(false);  // 기본은 숨김
  
    
  // 타이틀
  const title = scene.add.text(0, -410, '랭킹', {
    fontFamily: 'GSC',
    fontSize: '100px',
    color: '#ffffff'
  }).setOrigin(0.5);

  const BackBtn = scene.add.text(-420, -450, '◀뒤로', {
    fontFamily: 'GSC',
    fontSize: '54px',
    color: '#fff',
  }).setOrigin(0.5).setInteractive();
  BackBtn.on('pointerdown', () =>
  {
    if (isGameOver==true){
      windowManager = 'gameover'
    }
    else{
      windowManager='nothing'
    }
    rankingUI.setVisible(false);
    rankingUI.setScale(0,1);
  })


  // 순위 리스트 (1등~10등)
  const listEntries = [];

  const my_rect = scene.add.rectangle(0, 0, 860, 51, 0xEE8D98)
  .setOrigin(0.5)
  .setAlpha(0.33).setVisible(false);
  const my_check = scene.add.text(0, 0, 'New!!', {
    fontFamily: 'GSC',
    fontSize: '20px',
    color: "#000000",
  }).setOrigin(0.5).setVisible(false);
 
  
  for (let i = 0; i < 10; i++) {
    const y = -225+ i * 63;

    // 순위 텍스트 박스
    const rankText = scene.add.text(-430, y, `No.${String(i + 1).padStart(3, '0')}`, {
      fontFamily: 'GSC',
      fontSize: '48px',
      color: i === 0 ? '#FFD700' : (i === 1 ? '#C0C0C0' : (i === 2 ? '#CD7F32' : '#000000')),
      align: 'left'
    }).setOrigin(0,0.5);

    // 닉네임 텍스트 박스
    const nameText = scene.add.text(-170, y, '닉네임', {
      fontFamily: 'GSC',
      fontSize: '48px',
      color: i === 0 ? '#FFD700' : (i === 1 ? '#C0C0C0' : (i === 2 ? '#CD7F32' : '#000000')),
      align: 'left'
    }).setOrigin(0, 0.5);

    // 기록 텍스트 박스
    const timeText = scene.add.text(430, y, '30.0초', {
      fontFamily: 'GSC',
      fontSize: '48px',
      color: i === 0 ? '#FFD700' : (i === 1 ? '#C0C0C0' : (i === 2 ? '#CD7F32' : '#000000')),
      align: 'left'
    }).setOrigin(1, 0.5);


  


    // 순위, 닉네임, 기록을 각각의 텍스트 박스에 추가
    listEntries.push({ rankText, nameText, timeText});
  }

  const rankingStateTextList = [
    '전체', '일간', '나'
  ]

  const leftBut = scene.add.text(-70, -315,'◁', {
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5).setInteractive().on('pointerdown', () =>
    {
      if( rankingState > 0) {
  rankingState -= 1;
  rightBut.setText('▶');
  rankingStateText.setText(rankingStateTextList[rankingState]);
  updateRankingUI(scene);
  
      }
      if (rankingState == 0) {
        leftBut.setText('◁');
      }
    })

  const rightBut = scene.add.text(70, -315,'▶', {
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5).setInteractive().on('pointerdown', () =>
  {
    if( rankingState < rankingStateTextList.length-1) {
      rankingState += 1;
      leftBut.setText('◀');
      rankingStateText.setText(rankingStateTextList[rankingState]);
      updateRankingUI(scene);
      
          }
          if (rankingState == rankingStateTextList.length-1) {
            rightBut.setText('▷')
          }
  })

  const rankingStateText = scene.add.text(0, -317, '전체', {
    fontFamily: 'GSC',
    fontSize: '42px',
    color: '#ffffff'
  }).setOrigin(0.5)


  rankingUI.add([bg, bg2, title, loadingText,
    ...listEntries.map(entry => entry.rankText),
    ...listEntries.map(entry => entry.nameText), 
    ...listEntries.map(entry => entry.timeText),
  my_rect, my_check,
leftBut, rightBut, BackBtn, rankingStateText]);

  // 외부에서 접근 가능하게 참조
  scene.rankingEntries = {
    listEntries,
    loadingText
  };
  scene.my_rect = my_rect;
  scene.my_check = my_check;
}

function showRankingUI(scene) {
  updateRankingUI(scene);
  
  scene.children.bringToTop(rankingUI);
  rankingUI.setVisible(true);
  scene.tweens.add({
    targets: rankingUI,
    scale: 1,
    duration: 300,
    ease: 'Sine.easeOut'
  });
}




document.fonts.ready.then(() => {
  initializeIdentity();
  // ✅ 폰트가 전부 로드된 이후 Phaser 게임 시작
  game = new Phaser.Game(config);
  //setupDpad();
  setupDynamicJoystick();
  
});

