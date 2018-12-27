import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Hero, Weapon, Armor, Enemy, Erudite, Guard, Newshound, Pilot, Soldier, CheckSpecies, ExperienceToLevel } from '../models/characters';
import { Chapter, SuccessOptions } from '../models/chapter';
import { Chapter1 } from '../chapters/chapter1';
import { ProfessionOptions, SpeciesOptions } from '../models/character-options';

@Injectable()
export class GameControllerService {
    constructor(private router: Router) { }

    mainCharacter: Hero;
    currentChapter: Chapter = Chapter1;
    isFighting: boolean = false;

    actionDelay: number = 1500;

    heroParty: Hero[] = [];
    partyInventory: (Weapon | Armor)[] = [];
    availableHeroes: Hero[] = [];
    enemyParty: Enemy[] = this.currentChapter.enemyParty;

    setMainCharacter(character): void {
        switch (character.profession) {
            case ProfessionOptions.erudite:
                this.mainCharacter = new Erudite(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.erudite, character.species, new Weapon("W1", 1, 5), new Armor("A1", 1), 1);
            case ProfessionOptions.guard:
                this.mainCharacter = new Guard(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.guard, character.species, new Weapon("W1", 1, 5), new Armor("A1", 1), 1);
            case ProfessionOptions.newshound:
                this.mainCharacter = new Newshound(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.newshound, character.species, new Weapon("W1", 1, 5), new Armor("A1", 1), 1);
            case ProfessionOptions.pilot:
                this.mainCharacter = new Pilot(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.pilot, character.species, new Weapon("W1", 1, 5), new Armor("A1", 1), 1);
            case ProfessionOptions.soldier:
                this.mainCharacter = new Soldier(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.soldier, character.species, new Weapon("W1", 1, 5), new Armor("A1", 1), 1);
        }

        CheckSpecies(this.mainCharacter);
        this.heroParty.push(this.mainCharacter);

        this.router.navigateByUrl('/story');
    }

    encounterSucess(): string[] {
        let messages: string[] = [];
        this.currentChapter.ifSucceed.forEach(reward => {
            switch (reward) {
                case SuccessOptions.addHeroToParty:
                    let newHero: Hero = this.currentChapter.rewards.newHero;
                    if (this.heroParty.length < 3) {
                        messages.push(`A new hero joined your party: ${newHero.name}, 
                        a level ${newHero.level} ${newHero.profession}!`)
                        this.heroParty.push(newHero);
                    }
                    else {
                        messages.push(`A new hero is available for your party: ${newHero.name}, 
                        a level ${newHero.level} ${newHero.profession}!`)
                        this.availableHeroes.push(newHero);
                    }
                    break;
                case SuccessOptions.rewardEquipment:
                    messages.push("You receive the following equipment: ")
                    this.currentChapter.rewards.equipment.forEach(item => {
                        if (item instanceof Armor) {
                            messages.push(`${item.name} -- Attack barrier bonus: ${item.attackBarrierBonus}`);
                        }
                        else {
                            messages.push(`${item.name} -- Min damage: ${item.minDamage}, max damage: ${item.maxDamage}`);
                        }
                        this.partyInventory.push(item);
                    })
                    break;
                case SuccessOptions.rewardExperience:
                    messages.push(`Each member of your party received ${this.currentChapter.rewards.experience}`);
                    this.heroParty.forEach(hero => {
                        hero.experience += this.currentChapter.rewards.experience;
                        if (hero.experience >= ExperienceToLevel[hero.level]) {
                            messages.push(`${hero.name} leveled up! Upgrade the character in the inventory screen`);
                            hero.levelUp();
                        }
                    });
                    break;
            }
        })
        return messages;
    }

    nextChapter(): void {
        this.heroParty.forEach(hero => {
            hero.rest();
            this.currentChapter = this.currentChapter.nextChapter;
            this.enemyParty = this.currentChapter.enemyParty;
        });
    }

    gameOver(): void {
        this.mainCharacter = undefined;
        this.currentChapter = Chapter1;
        this.heroParty = [];
        this.partyInventory = [];
        this.availableHeroes = [];
        this.enemyParty = this.currentChapter.enemyParty;
    }
}