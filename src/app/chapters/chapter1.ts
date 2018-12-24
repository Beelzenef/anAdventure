import { Chapter, FailureOptions, CharacterAction, SuccessOptions } from "../models/chapter";
import { Weapon, Armor, Enemy, Soldier } from "../models/characters";
import { SpeciesOptions, ProfessionOptions } from "../models/character-options";

export const Chapter1: Chapter = {
    story: [
        "Te introduces en el bosque, buscando al resto de tu compañía, de la que te separaste en el último combate."],
    options: [
        CharacterAction.attack,
        CharacterAction.sneak,
        CharacterAction.doNothing
    ],
    enemyParty: [
        new Enemy("Enemy", 5,
            { attack: 2, sneak: 0, knowledge: 0 },
            { attack: 10, sneak: 10 },
            10, 15, "")
    ],
    sneakPersuadeFail: CharacterAction.attack,
    ifFail: [FailureOptions.nextChapter],
    ifSucceed: [
        SuccessOptions.rewardEquipment,
        SuccessOptions.rewardExperience
    ],
    rewards: {
        experience: 500,
        equipment: [new Weapon("Rusty sword", 1, 6)],
        newHero: new Soldier("Roldier", 10, { attack: 2, sneak: 1, knowledge: 1 }, ProfessionOptions.soldier, SpeciesOptions.human,
            new Weapon("Rifle", 1, 4), new Armor("AFG34", 2), 1)
    },
    nextChapter: null
}