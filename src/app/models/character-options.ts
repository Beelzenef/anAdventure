export enum SpeciesOptions {
    human = "Human",
    sheller = "Sheller",
    lyxnel = "Lyxnel"
}

export enum ProfessionOptions {
    soldier = "Soldier",
    pilot = "Pilot",
    guard = "Guard",
    erudite = "Erudite",
    newshound = "Newshound"
}

export const CharacterOptions = {
    species: [
        SpeciesOptions.human,
        SpeciesOptions.sheller,
        SpeciesOptions.lyxnel
    ],
    professions: [
        ProfessionOptions.erudite,
        ProfessionOptions.guard,
        ProfessionOptions.soldier,
        ProfessionOptions.pilot,
        ProfessionOptions.newshound
    ]
}