const pokemonList = [
  { name: 'celebi', width: 67, height: 65 },
  { name: 'charizard', width: 133, height: 140 },
  { name: 'darkrai', width: 124, height: 116 },
  { name: 'darumaka', width: 74, height: 61 },
  { name: 'eevee', width: 64, height: 55 },
  { name: 'emolga', width: 66, height: 59 },  
  { name: 'ho-oh', width: 157, height: 144 },
  { name: 'mew', width: 40, height: 51 },
  { name: 'mimikyu', width: 72, height: 92 },
  { name: 'mimikyu-busted', width: 85, height: 51 },
  { name: 'pachirisu', width: 57, height: 75 },
  { name: 'pichu', width: 32, height: 48 },
  { name: 'pikachu', width: 77, height: 60 },
  { name: 'pikachu-kaloscap', width: 60, height: 60 },
  { name: 'pikachu-kantocap', width: 60, height: 60 },
  { name: 'piplup', width: 54, height: 59 },
  { name: 'porygon', width: 47, height: 53 },  
  { name: 'torchic', width: 33, height: 61 },
  { name: 'victini', width: 53, height: 73 },  
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
  scene.load.spritesheet(pokemon.name, `image/ingame/pokemon-spritesheet/${pokemon.name}-spritesheet2.png`, {
    frameWidth: pokemon.width,
    frameHeight: pokemon.height,
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