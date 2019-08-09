import { Component } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';
import { Router } from '@angular/router';
import { CharacterAction } from 'src/app/models/chapter';
import { Hero, Enemy } from 'src/app/models/characters';

@Component({
    selector: "story-component",
    templateUrl: "./story.component.html",
    styleUrls: ["./story.component.css"]
})

export class StoryComponent {
    constructor(private gameController: GameControllerService, private router: Router) { }

    currentChapter = this.gameController.currentChapter;
    heroParty: Hero[] = this.gameController.heroParty;
    enemyParty: Enemy[] = this.gameController.enemyParty;

    actionDelay: number = this.gameController.actionDelay;
    displayMessage: string = "";
    successMessages: string[] = [];
    showNextChapterButton: boolean = false;

    chooseAction(action: string): void {
        if (this.successMessages.length) {
            return;
        }

        this.displayMessage = `You decide to ${action}`;
        setTimeout(() => {
            switch (action) {
                case CharacterAction.attack:
                    this.tryAttack();
                    break;
                case CharacterAction.sneak:
                    this.trySneak();
                    break;
                case CharacterAction.doNothing:
                    this.doNothing();
                    break;
                default:
                    console.log("The horror begins...")
            }
        }, this.actionDelay);
    }

    tryAttack(): void {
        this.gameController.isFighting = true;
        this.router.navigateByUrl("/fight");
    }

    trySneak(): void {
        let sneakBarrier = 0;
        let sneakPower = 5;
        
        this.enemyParty.forEach(e => {
            sneakBarrier += e.barriers.sneak;
        });
        this.heroParty.forEach(h => {
            sneakPower += h.sneak();
        });

        if (sneakPower >= sneakBarrier) {
            this.displayMessage = "Your attempt at sneaking was a success!";
            setTimeout(() => {
                this.onSuccess();
            }, this.actionDelay);
        } else {
            this.displayMessage = "Your attempt at sneak failed!";
            setTimeout(() => {
                this.onSneakFailure();
            }, this.actionDelay);
        }
    }

    doNothing(): void {
        this.displayMessage = "You decide to move on!";
        setTimeout(() => {
            this.nextChapter();
        }, this.actionDelay);
    }

    onSuccess(): void {
        this.successMessages = this.gameController.encounterSucess();
        this.showNextChapterButton = true;
    }

    onSneakFailure(): void {
        switch (this.currentChapter.sneakPersuadeFail) {
            case CharacterAction.attack:
            default:
                this.displayMessage = "The enemy attacks you";
                setTimeout(() => {
                    this.tryAttack();
                }, this.actionDelay);
                break;
            case CharacterAction.doNothing:
                this.displayMessage = "Your failure spoiled the opportunity and your party moves on";
                setTimeout(() => {
                    this.nextChapter();
                }, this.actionDelay);
                break;
        }
    }

    nextChapter(): void {
        this.gameController.nextChapter();
        this.currentChapter = this.gameController.currentChapter;
        this.heroParty = this.gameController.heroParty;
        this.enemyParty = this.currentChapter.enemyParty;
        this.displayMessage = "";
        this.successMessages = [];
        this.showNextChapterButton = false;
    }
}