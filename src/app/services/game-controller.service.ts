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

    setMainCharacter(character: { name: string, profession: ProfessionOptions, species: SpeciesOptions }): void {
        switch (character.profession) {
            case ProfessionOptions.erudite:
                this.mainCharacter = new Erudite(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.erudite, SpeciesOptions.human, null, null, 1);
            case ProfessionOptions.guard:
                this.mainCharacter = new Guard(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.guard, SpeciesOptions.human, null, null, 1);
            case ProfessionOptions.newshound:
                this.mainCharacter = new Newshound(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.newshound, SpeciesOptions.human, null, null, 1);
            case ProfessionOptions.pilot:
                this.mainCharacter = new Pilot(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.pilot, SpeciesOptions.human, null, null, 1);
            case ProfessionOptions.soldier:
                this.mainCharacter = new Soldier(character.name, 10, { attack: 0, sneak: 0, knowledge: 0 },
                    ProfessionOptions.soldier, SpeciesOptions.human, null, null, 1);
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
                case SuccessOptions.rewardEquipment:
                case SuccessOptions.rewardExperience:
                    messages.push(`Each member of your party received ${this.currentChapter.rewards.experience}`);
                    this.heroParty.forEach(hero => {
                        hero.experience += this.currentChapter.rewards.experience;
                        if (hero.experience >= ExperienceToLevel[hero.level]) {
                            messages.push(`${hero.name} leveled up!`)
                        }
                    });
            }
        })
        return messages;
    }
}