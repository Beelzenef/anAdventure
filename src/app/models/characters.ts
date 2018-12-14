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
    maxHeath: number;
    currentHealth: number;
    isIncapacitated: boolean;
    barriers: {
        attack: number,
        sneak: number,
    };
    skills: {
        attack: number,
        sneak: number
    };
    equippedWeapon: Weapon;
    equippedArmor: Armor;

    constructor(name: string, health: number, skills = {attack: 0, sneak: 0}) {
        this.name = name;
        this.maxHeath = health;
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