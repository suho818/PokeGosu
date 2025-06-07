const pokemonList = [
  { name: 'celebi', width: 24, height_w: 48, height_i:56 },
  { name: 'charizard', width: 133, height: 140 },
  { name: 'darkrai', width: 40, height: 80  },
  { name: 'darumaka', width: 74, height: 61 },
  { name: 'eevee', width: 40, height: 48 },
  { name: 'emolga', width: 32, height_w: 32, height_i:48 },  
  { name: 'empoleon', width: 32, height: 56 },
  { name: 'ho-oh', width: 72, height: 112 },
  { name: 'mew', width_w: 40, height_w: 64 , width_i: 32, height_i: 56},
  { name: 'mimikyu', width: 32, height: 48 },
  { name: 'mimikyu-busted', width: 32, height: 32 },
  { name: 'pachirisu', width: 40, height: 56 },
  { name: 'pichu', width: 32, height: 48 },
  { name: 'pikachu', width_w: 32, height_w: 40 , width_i:25, height_i: 48},
  { name: 'piplup', width: 24, height_w: 32, height_i: 40 },
  { name: 'prinplup', width: 24, height_w: 40, height_i: 48 },
  { name: 'porygon', width: 32, height: 40 },  
  { name: 'torchic', width: 24, height_w: 32 ,height_i:40},
  { name: 'victini', width: 24, height: 48 },  
];

export function preloadAssets(scene) {
    scene.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    scene.load.scenePlugin({
  key: 'rexuiplugin',
  url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
  sceneKey: 'rexUI'
});

  scene.load.image('editicon', 'image/editicon.png');
  scene.load.image('setupicon', 'image/setupicon.png');
  pokemonList.forEach(pokemon => {
  
  scene.load.image(`${pokemon.name}-icon`, `image/ingame/pokemon-icon/${pokemon.name}.png`);
  scene.load.spritesheet(`${pokemon.name}_w`, `image/ingame/pokemon-spritesheet/walk/${pokemon.name}-walk-spritesheet.png`, {
    frameWidth: pokemon.width || pokemon.width_w,
    frameHeight: pokemon.height || pokemon.height_w,
  });
  scene.load.spritesheet(`${pokemon.name}_i`, `image/ingame/pokemon-spritesheet/idle/${pokemon.name}-idle-spritesheet.png`, {
    frameWidth: pokemon.width || pokemon.width_i,
    frameHeight: pokemon.height || pokemon.height_i,
  });
});
  scene.load.image('monster-ball', 'image/monster-ball.png');
  scene.load.image('monsterball', 'image/monsterball.png');
  scene.load.image('superball', 'image/superball.png');
  scene.load.image('hyperball', 'image/hyperball.png');
  scene.load.image('masterball', 'image/masterball.png');


  scene.load.audio('My World', 'audio/bgm/My World.mp3');
  scene.load.audio('Infinite Stairs', 'audio/bgm/Infinite Stairs.mp3');
  scene.load.audio('Lake', 'audio/bgm/Lake.mp3');
  scene.load.audio('Login', 'audio/bgm/Login.mp3');

  scene.load.audio('Champion Cynthia', 'audio/bgm/Champion Cynthia.mp3');
  scene.load.audio('Champion Red', 'audio/bgm/Champion Red.mp3');
}