import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding WAR PIGS database...');

  // Seed Characters
  const characters = [
    {
      characterId: 'grunt_bacon',
      name: 'Grunt Bacon',
      description: 'The standard infantry of the Swine Corps. Balanced, reliable, and always hungry for combat.',
      classType: 'ASSAULT',
      baseHealth: 100,
      baseSpeed: 5.0,
      passiveAbility: 'BATTLE_HARDENED: 10% damage reduction when HP below 50%',
      pricePigs: 0,
      unlockLevel: 1,
      rarity: 'COMMON',
    },
    {
      characterId: 'iron_tusk',
      name: 'Iron Tusk',
      description: 'Heavily armored warhog with titanium implants. Slow but nearly unkillable.',
      classType: 'TANK',
      baseHealth: 200,
      baseSpeed: 3.5,
      passiveAbility: 'UNBREAKABLE: Cannot be stunned. 20% max HP regen when not taking damage for 5s.',
      pricePigs: 500,
      unlockLevel: 3,
      rarity: 'RARE',
    },
    {
      characterId: 'swift_hoof',
      name: 'Swift Hoof',
      description: 'Scout specialist bred for speed. Hits fast, moves faster, dies if caught.',
      classType: 'SCOUT',
      baseHealth: 75,
      baseSpeed: 7.0,
      passiveAbility: 'ADRENALINE: Movement speed increases by 20% for 3s after dodging an attack.',
      pricePigs: 750,
      unlockLevel: 5,
      rarity: 'RARE',
    },
    {
      characterId: 'precision_squeal',
      name: 'Precision Squeal',
      description: 'Elite marksman with cybernetic targeting eye. One shot, one kill.',
      classType: 'SNIPER',
      baseHealth: 85,
      baseSpeed: 4.5,
      passiveAbility: 'HEADHUNTER: Critical hit chance increased by 25% when standing still for 2s.',
      pricePigs: 1200,
      unlockLevel: 8,
      rarity: 'EPIC',
    },
    {
      characterId: 'blast_ham',
      name: 'Blast Ham',
      description: 'Demolitions expert with a love for explosives. Leave nothing standing.',
      classType: 'DEMOLITION',
      baseHealth: 110,
      baseSpeed: 4.0,
      passiveAbility: 'CHAIN_REACTION: Explosions have 30% chance to trigger secondary blast.',
      pricePigs: 1500,
      unlockLevel: 10,
      rarity: 'EPIC',
    },
    {
      characterId: 'general_goldsnout',
      name: 'General Goldsnout',
      description: 'Legendary commander of the Bacon Battalion. Feared by enemies, respected by allies.',
      classType: 'ELITE',
      baseHealth: 150,
      baseSpeed: 5.5,
      passiveAbility: 'TACTICAL_GENIUS: All nearby allies deal 15% more damage. Personal shield regenerates.',
      pricePigs: 5000,
      unlockLevel: 20,
      rarity: 'LEGENDARY',
    },
  ];

  for (const char of characters) {
    await prisma.character.upsert({
      where: { characterId: char.characterId },
      update: char,
      create: char,
    });
  }

  // Seed Weapons
  const weapons = [
    {
      weaponId: 'oink_pistol',
      name: 'Oink-9 Pistol',
      description: 'Standard sidearm. Reliable, accurate, perfect for the discriminating pig.',
      type: 'PISTOL',
      damage: 15,
      fireRate: 3.0,
      cooldown: 0.33,
      ammoCapacity: 12,
      pricePigs: 0,
      unlockLevel: 1,
      rarity: 'COMMON',
    },
    {
      weaponId: 'sow_machinegun',
      name: 'Sow-MP5',
      description: 'Compact submachine gun for close quarters trench warfare.',
      type: 'SMG',
      damage: 12,
      fireRate: 10.0,
      cooldown: 0.1,
      ammoCapacity: 30,
      pricePigs: 300,
      unlockLevel: 2,
      rarity: 'COMMON',
    },
    {
      weaponId: 'boar_rifle',
      name: 'Boar-AR15',
      description: 'Assault rifle favored by frontline troops. Good balance of power and control.',
      type: 'RIFLE',
      damage: 25,
      fireRate: 6.0,
      cooldown: 0.17,
      ammoCapacity: 25,
      pricePigs: 600,
      unlockLevel: 4,
      rarity: 'RARE',
    },
    {
      weaponId: 'tusk_shotgun',
      name: 'Double-Tusk Shotgun',
      description: 'Devastating at close range. Turn enemies into bacon bits.',
      type: 'SHOTGUN',
      damage: 60,
      fireRate: 1.5,
      cooldown: 0.67,
      ammoCapacity: 8,
      pricePigs: 800,
      unlockLevel: 6,
      rarity: 'RARE',
    },
    {
      weaponId: 'sniper_swine',
      name: 'Longbore Sniper',
      description: 'High-caliber precision instrument. Silence before the squeal.',
      type: 'SNIPER',
      damage: 120,
      fireRate: 0.8,
      cooldown: 1.25,
      ammoCapacity: 5,
      pricePigs: 1200,
      unlockLevel: 8,
      rarity: 'EPIC',
    },
    {
      weaponId: 'belcha_minigun',
      name: 'Belcha Minigun',
      description: 'Rotary death machine. Heavy, slow to spin up, absolutely devastating.',
      type: 'HEAVY',
      damage: 20,
      fireRate: 20.0,
      cooldown: 0.05,
      ammoCapacity: 200,
      pricePigs: 2000,
      unlockLevel: 12,
      rarity: 'EPIC',
    },
    {
      weaponId: 'plasma_porker',
      name: 'Plasma Porker-X',
      description: 'Experimental energy weapon. Fires superheated plasma globules.',
      type: 'SPECIAL',
      damage: 45,
      fireRate: 4.0,
      cooldown: 0.25,
      ammoCapacity: 20,
      specialEffect: 'PLASMA_BURN: Targets take 5 damage per second for 3 seconds',
      pricePigs: 3500,
      unlockLevel: 15,
      rarity: 'LEGENDARY',
    },
    {
      weaponId: 'bacon_blaster',
      name: 'Bacon Blaster 9000',
      description: 'Ultimate weapon of the Swine Army. Launches explosive strips of justice.',
      type: 'SPECIAL',
      damage: 150,
      fireRate: 2.0,
      cooldown: 0.5,
      ammoCapacity: 10,
      specialEffect: 'EXPLOSIVE: Area damage on impact. 50% chance to heal user for 10 HP',
      pricePigs: 5000,
      unlockLevel: 20,
      rarity: 'LEGENDARY',
    },
  ];

  for (const weapon of weapons) {
    await prisma.weapon.upsert({
      where: { weaponId: weapon.weaponId },
      update: weapon,
      create: weapon,
    });
  }

  // Seed Enemy Types
  const enemies = [
    {
      enemyId: 'wolf_grunt',
      name: 'Wolf Conscript',
      health: 40,
      damage: 10,
      speed: 4.0,
      behavior: 'CHASER',
    },
    {
      enemyId: 'wolf_soldier',
      name: 'Wolf Regular',
      health: 70,
      damage: 15,
      speed: 4.5,
      behavior: 'SHOOTER',
    },
    {
      enemyId: 'wolf_heavy',
      name: 'Wolf Heavy Gunner',
      health: 150,
      damage: 25,
      speed: 2.5,
      behavior: 'TANK',
    },
    {
      enemyId: 'cyber_fox',
      name: 'Cyber Fox Assassin',
      health: 50,
      damage: 20,
      speed: 6.5,
      behavior: 'CHASER',
    },
    {
      enemyId: 'drone_bomber',
      name: 'Kamikaze Crow',
      health: 20,
      damage: 40,
      speed: 5.0,
      behavior: 'EXPLODER',
    },
    {
      enemyId: 'bear_commando',
      name: 'Ursine Commando',
      health: 200,
      damage: 30,
      speed: 3.0,
      behavior: 'SHOOTER',
    },
  ];

  for (const enemy of enemies) {
    await prisma.enemyType.upsert({
      where: { enemyId: enemy.enemyId },
      update: enemy,
      create: enemy,
    });
  }

  // Seed Bosses
  const bosses = [
    {
      bossId: 'alpha_wolfgang',
      name: 'Wolfgang the Ravager',
      title: 'Alpha of the Iron Paw',
      description: 'First boss of the Pig Campaign. Leads the wolf packs with savage fury.',
      baseHealth: 1000,
      damage: 25,
      speed: 4.0,
      abilities: ['HOWL: Summons 3 wolf grunts', 'LEAP: Jumps to player position', 'FRENZY: Attack speed +50% below 30% HP'],
      rewardMultiplier: 2.0,
    },
    {
      bossId: 'mecha_bruin',
      name: 'Bruin-Mech 7',
      title: 'The Iron Bear',
      description: 'A bear encased in experimental pork-tech armor. Slow but devastating.',
      baseHealth: 2500,
      damage: 50,
      speed: 2.0,
      abilities: ['ROCKET_SALVO: Fires 8 rockets in circle pattern', 'GROUND_POUND: Stuns nearby players', 'SHIELD_DRONE: Regenerates 50 HP per second while active'],
      rewardMultiplier: 3.0,
    },
    {
      bossId: 'shadow_fox_prime',
      name: 'Vixen Prime',
      title: 'Matriarch of Shadows',
      description: 'The final threat. A cybernetically enhanced fox with quantum stealth tech.',
      baseHealth: 5000,
      damage: 40,
      speed: 7.0,
      abilities: ['PHASE_SHIFT: Becomes invulnerable and teleports', 'CLONE_ARMY: Creates 5 mirror images', 'DEATH_FROM_ABOVE: Rains lasers from sky', 'TIME_WARP: Slows player movement by 50%'],
      rewardMultiplier: 5.0,
    },
  ];

  for (const boss of bosses) {
    await prisma.boss.upsert({
      where: { bossId: boss.bossId },
      update: boss,
      create: boss,
    });
  }

  // Seed Levels
  const levels = [];
  const levelNames = [
    'Trench Warfare 101',
    'No Swine Left Behind',
    'The Porkchop Hills',
    'Bacon Ridge Assault',
    'Iron Snout Crossing',
    'Wolf Den Infiltration',
    'The Squeal Deal',
    'Hammer Down Protocol',
    'Crimson Mud',
    'Steel Trough Offensive',
    'Operation: Hog Wild',
    'The Last Oink',
  ];

  for (let i = 1; i <= 12; i++) {
    const isBossLevel = i % 4 === 0;
    const bossId = isBossLevel ? 
      (i === 4 ? 'alpha_wolfgang' : i === 8 ? 'mecha_bruin' : 'shadow_fox_prime') 
      : null;
    
    const difficulty = Math.min(10, Math.floor(i / 1.2) + 1);
    const baseReward = 50 * i * (isBossLevel ? 2 : 1);
    const xpReward = 100 * i;

    levels.push({
      levelNumber: i,
      name: levelNames[i-1],
      description: `Mission ${i}: ${isBossLevel ? 'BOSS FIGHT - ' : ''}Eliminate all hostile forces in sector ${i}`,
      difficulty,
      enemyTypes: ['wolf_grunt', 'wolf_soldier', i > 3 ? 'wolf_heavy' : '', i > 6 ? 'cyber_fox' : '', i > 9 ? 'bear_commando' : ''].filter(Boolean),
      waves: 3 + Math.floor(i / 2),
      bossId,
      baseReward,
      xpReward,
      unlockRequirement: i === 1 ? 0 : i - 1,
      isBossLevel,
    });
  }

  for (const level of levels) {
    await prisma.level.upsert({
      where: { levelNumber: level.levelNumber },
      update: level,
      create: level,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  
