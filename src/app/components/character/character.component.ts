import { Component } from '@angular/core';
import { CharacterOptions } from '../../models/character-options';
import { GameControllerService } from 'src/app/services/game-controller.service';

@Component({
    selector: "character-component",
    templateUrl: "./character.component.html",
    styleUrls: ["./character.component.css"]
})
export class CharacterComponent {

    constructor(private gameController: GameControllerService) { }

    character = {
        species: '--Choose--',
        profession: '--Choose--',
        name: undefined
    }

    characterComplete: boolean = false;

    species = CharacterOptions.species;
    professions = CharacterOptions.professions;

    changeProfession(prof: string) {
        this.character.profession = prof;
        this.checkCompleted();
    }

    changeSpecies(spc: string) {
        this.character.species = spc;
        this.checkCompleted();
    }

    changeName() {
        this.checkCompleted();
    }

    checkCompleted() {
        this.characterComplete =
            this.character.profession != "--Choose--" &&
            this.character.species != "--Choose--" &&
            this.character.name;
    }

    createCharacter() {
        if (!this.characterComplete) return;

        console.log(this.character);
        this.gameController.setMainCharacter(this.character);
    }
}