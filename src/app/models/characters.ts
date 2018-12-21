import  { SpeciesOptions, ProfessionOptions } from './character-options';

export class Armor {
    name: string;
    attackBarrierBonus: number;

    constructor(name: string, attackBarrierBonus: number) {
        this.name = name;
        this.attackBarrierBonus = attackBarrierBonus;
    }
}

export class Weapon {
    name: string;
    minDamage: number;
    maxDamage: number;

    constructor(name: string, minDamage: number, maxDamage: number) {
        this.name = name;
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
    }
}

export enum CharacterSkills {
    attack = "attack",
    sneak = "sneak"
}

export enum FightOptions {
    attack = "Attack",
    specialAttack = "Special attack",
    steal = "Steal",
    none = "None"
}

export const ExperienceToLevel = {
    1: 1000,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 5000,
    6: 6000,
    7: 7000,
    8: 8000,
    9: 9000,
    10: 10000
}

export class BaseCharacter {
    name: string;
    maxHealth: number;
    currentHealth: number;
    isIncapacitated: boolean;
    spriteUrl: string;
    barriers: {
        attack: number,
        sneak: number,
    };
    skills: {
        attack: number,
        sneak: number,
        knowledge: number
    };
    equippedWeapon: Weapon;
    equippedArmor: Armor;

    constructor(name: string, health: number, skills = {attack: 0, sneak: 0, knowledge: 0}) {
        this.name = name;
        this.maxHealth = health;
        this.currentHealth = health;
        this.isIncapacitated = false;
        this.skills = skills;
        this.barriers = {
            attack: 10,
            sneak: 10
        }
    }

    attack() {
        return Math.floor(Math.random() * 20) + 1 + this.skills.attack;
    }

    sneak() {
        return Math.floor(Math.random() * 20) + 1 + this.skills.sneak;
    }

    dealDamage() {
        return Math.floor(Math.random() * 
            (this.equippedWeapon.maxDamage - this.equippedWeapon.minDamage + 1) * this.equippedWeapon.minDamage);
    }
}

export class Enemy extends BaseCharacter {
    isTrapped: boolean = false;
    poisonStacks: number = 0;
    isStrongPoison: boolean = false;
    hasTakenPoisonDamageThisTurn: boolean = false;

    constructor(name, health, skills, barriers: {attack: number, sneak: number}, minDamage, maxDamage, spriteUrl ) {
        super(name, health, skills);
        this.barriers = barriers;
        this.equippedWeapon = new Weapon(undefined, minDamage, maxDamage);
        this.spriteUrl = spriteUrl;
    }
}

export class Hero extends BaseCharacter {
    profession: string;
    species: string;
    characterRole: string;
    experience: number;
    level: number;
    availableSkillPoints: number;
    hasTrapDefence: boolean;
    hasDamaginTrap: boolean;
    turnsUntilSpecialAvailableAgain: number;

    constructor(name, health, skills, profession, species, weapon, armor, level) {
        super(name, health, skills);

        this.profession = profession;
        this.species = species;
        this.level = level;
        this.experience = 0;
        this.equipNewArmor(armor);
        this.equipNewWeapon(weapon);
    }

    levelUp() : void {
        this.experience -= ExperienceToLevel[this.level];
        this.level++;
        this.availableSkillPoints += 2;
        if (this.experience >= ExperienceToLevel[this.level]) {
            this.levelUp();
        }
    } 

    equipNewArmor(armor : Armor) : void {
        if (this.equippedArmor) {
            this.barriers.attack -= this.equippedArmor.attackBarrierBonus;
        }
        this.equippedArmor = armor;
        this.barriers.attack += armor.attackBarrierBonus;
    }

    equipNewWeapon(weapon : Weapon) : void {
        this.equippedWeapon = weapon;
    }

    rest() : void {
        this.currentHealth = this.maxHealth;
        this.isIncapacitated = false;
        this.turnsUntilSpecialAvailableAgain = 0;
    }
}

export class Soldier extends Hero {
    constructor(name, health, skills, profession, species, weapon, armor, level) {
        super(name, health, skills, profession, species, weapon, armor, level);
        this.characterRole = ProfessionOptions.soldier;
        this.skills.attack += 3;
        this.skills.sneak -= 2;
        this.spriteUrl = "../assets/medievalUnit_20.png";
    }

    levelUp() : void {
        this.maxHealth = Math.floor(Math.random() * 10) + 1;
        this.currentHealth = this.maxHealth;
        super.levelUp();
    }
}

export class Pilot extends Hero {
    constructor(name, health, skills, profession, species, weapon, armor, level) {
        super(name, health, skills, profession, species, weapon, armor, level);
        this.characterRole = ProfessionOptions.pilot;
        this.skills.attack--;
        this.skills.sneak += 3;
        this.spriteUrl = "../assets/medievalUnit_04.png";
    }

    levelUp() : void {
        this.maxHealth = Math.floor(Math.random() * 7) + 1;
        this.currentHealth = this.maxHealth;
        super.levelUp();
    }
}

export class Guard extends Hero {
    constructor(name, health, skills, profession, species, weapon, armor, level) {
        super(name, health, skills, profession, species, weapon, armor, level);
        this.characterRole = ProfessionOptions.guard;
        this.skills.attack += 2;
        this.skills.sneak += 2;
        this.spriteUrl = "../assets/medievalUnit_15.png";
    }

    levelUp() : void {
        this.maxHealth = Math.floor(Math.random() * 9) + 1;
        this.currentHealth = this.maxHealth;
        super.levelUp();
    }
}

export class Erudite extends Hero {
    constructor(name, health, skills, profession, species, weapon, armor, level) {
        super(name, health, skills, profession, species, weapon, armor, level);
        this.characterRole = ProfessionOptions.erudite;
        this.skills.knowledge += 3;
        this.skills.attack -= 2;
        this.spriteUrl = "../assets/medievalUnit_01.png";
    }

    levelUp() : void {
        this.maxHealth = Math.floor(Math.random() * 4) + 1;
        this.currentHealth = this.maxHealth;
        super.levelUp();
    }
}

export class Newshound extends Hero {
    constructor(name, health, skills, profession, species, weapon, armor, level) {
        super(name, health, skills, profession, species, weapon, armor, level);
        this.characterRole = ProfessionOptions.newshound;
        this.skills.knowledge += 2;
        this.skills.sneak++;
        this.spriteUrl = "../assets/medievalUnit_07.png";
    }

    levelUp() : void {
        this.maxHealth = Math.floor(Math.random() * 5) + 1;
        this.currentHealth = this.maxHealth;
        super.levelUp();
    }
}

export const CheckSpecies = (hero : Hero) => {
    switch (hero.species) {
        case SpeciesOptions.human:
            hero.skills.knowledge++;
            break;
        case SpeciesOptions.lyxnel:
            hero.skills.sneak++;
            break;
        case SpeciesOptions.sheller:
            hero.skills.attack++;
            break;
        default:
            break;
    }
};