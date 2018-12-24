import { Hero, Enemy, Weapon, Armor } from './characters';

export enum CharacterAction {
    attack = "Attack",
    sneak = "Sneak",
    doNothing = "Do nothing"
}

export enum FailureOptions {
    gameOver,
    nextChapter
}

export enum SuccessOptions {
    rewardExperience,
    rewardEquipment,
    addHeroToParty
}

export class Chapter {
    story: string[];
    options : CharacterAction[];
    enemyParty: Enemy[];
    sneakPersuadeFail: CharacterAction;
    ifFail: FailureOptions[];
    ifSucceed: SuccessOptions[];
    rewards: {
        experience: number,
        equipment: (Weapon | Armor)[],
        newHero: Hero;
    }
    nextChapter: Chapter;
}