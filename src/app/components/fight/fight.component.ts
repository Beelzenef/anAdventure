import { Component } from '@angular/core'
import { GameControllerService } from 'src/app/services/game-controller.service';
import { Router } from '@angular/router';
import { Hero, Enemy, FightOptions, BaseCharacter, Pilot, Newshound, Erudite, Guard, Soldier } from 'src/app/models/characters';

enum Teams {
    heroes,
    enemies,
    none
}

@Component({
    selector: "fight-component",
    templateUrl: "./fight.component.html",
    styleUrls: ["./fight.component.css"]
})
export class FightComponent {
    constructor(private gameController: GameControllerService, private router: Router) { }

    heroTurn: boolean = true;
    actionDelay: number = this.gameController.actionDelay;
    turnsBetweenSpecial: number = 2;
    characterIndex: number = 0;
    freezeActions: boolean = false;

    heroParty: Hero[] = this.gameController.heroParty;
    heroesIncapacitated: number = 0;
    enemyParty: Enemy[] = this.gameController.enemyParty;
    enemiesIncapacitated: number = 0;

    currentCharacter: BaseCharacter = this.heroParty[this.characterIndex];
    _fightOptions: typeof FightOptions = FightOptions;
    _teams: typeof Teams = Teams;
    selectedAction: FightOptions = FightOptions.none;
    availableTargets: Teams = Teams.none;
    selectedTargets: BaseCharacter[] = [];

    displayMessage: string = `${this.currentCharacter.name}'s turn`;
    sucessMessages: string[] = [];
    showNextChapterButton: boolean = false;
    showGameOverButton: boolean = false;

    selectOption(selectedOption: FightOptions): void {
        if (this.freezeActions && this.heroTurn) return;

        this.selectedAction = selectedOption;
        this.selectedTargets = [];

        if (this.selectedAction === FightOptions.attack) {
            this.availableTargets = Teams.enemies;
            this.displayMessage = "Select a target for your attack";
        } else if (this.selectedAction === FightOptions.specialAttack
            && this.currentCharacter instanceof Hero && this.currentCharacter.level < 3) {
            this.displayMessage = `Special attacks only available for level 3 heroes`;
        } else if (this.selectedAction === FightOptions.specialAttack
            && this.currentCharacter instanceof Hero && this.currentCharacter.level > 2) {
            if (this.currentCharacter.turnsUntilSpecialAvailableAgain) {
                this.displayMessage = `Cannot use special attack yet. ${this.currentCharacter.turnsUntilSpecialAvailableAgain} turn(s) until its available again`;
            } else {
                if (this.currentCharacter instanceof Newshound) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = ``;
                }
                if (this.currentCharacter instanceof Pilot) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = ``;
                }
                if (this.currentCharacter instanceof Guard) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = ``;
                }
                if (this.currentCharacter instanceof Erudite) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = ``;
                }
                if (this.currentCharacter instanceof Soldier) {
                    this.availableTargets = Teams.enemies;
                    this.displayMessage = ``;
                }
            }
        }

    }

    tryAttack(target: BaseCharacter): void {
        if (this.freezeActions) return;

        if (target.isIncapacitated) {
            this.displayMessage = "That target is already incapacitated";
            return;
        }

        if (this.currentCharacter instanceof Hero && target instanceof Hero) {
            // special attack logic
        }

        if (this.selectedAction === FightOptions.attack) {
            this.freezeActions = true;
            this.attack(target);
        } else if (this.currentCharacter instanceof Hero) {
             // MOAR special attack logic
        } else {
            this.displayMessage = ``;
        }
    }

    attack(target: BaseCharacter) {
        this.availableTargets = Teams.none;
        if (this.currentCharacter.attack() >= target.barriers.attack) {
            let damage = this.currentCharacter.dealDamage();
            target.currentHealth -= damage;
            this.displayMessage = `${this.currentCharacter.name} hit ${target.name} dealing ${damage} damage`;
            setTimeout(() => {
                if (target.currentHealth <= 0) {
                    target.isIncapacitated = true;
                    this.heroTurn ? this.enemiesIncapacitated++ : this.heroesIncapacitated++;
                    this.checkIfWin();
                } else {
                    this.nextTurn();
                }
            }, this.actionDelay);
        } else {
            this.displayMessage = `${this.currentCharacter.name} missed`;
            setTimeout(() => {
                this.nextTurn();
            }, this.actionDelay);
        }
    }

    checkIfWin(): void {
        this.selectedAction = FightOptions.none;

        if (this.enemiesIncapacitated === this.enemyParty.length) {
            this.displayMessage = "All enemies have been defeated!";
            this.sucessMessages = this.gameController.encounterSucess();
            this.showNextChapterButton = true;
            this.gameController.isFighting = false;
            return;
        }
        if (this.heroesIncapacitated === this.heroParty.length) {
            this.displayMessage = "All heroes have been defeated!";
            this.showGameOverButton = true;
            this.gameController.isFighting = false;
            return;
        }

        this.nextTurn();
    }

    nextTurn(): void {
        if (this.currentCharacter instanceof Enemy) {

        }

        this.availableTargets = Teams.none;
        this.selectedAction = FightOptions.none;
        this.characterIndex++;
        let nextCharacter;

        if (this.heroTurn) {
            nextCharacter = this.heroParty[this.characterIndex];
        } else {
            nextCharacter = this.enemyParty[this.characterIndex];
        }

        if (nextCharacter) {
            if (!nextCharacter.isIncapacitated) {
                this.currentCharacter = nextCharacter;
                this.displayMessage = `${this.currentCharacter.name} turn!`;
                if (this.currentCharacter instanceof Hero) {
                    this.freezeActions = false;
                    if (this.currentCharacter.turnsUntilSpecialAvailableAgain) {
                        this.currentCharacter.turnsUntilSpecialAvailableAgain--;
                    }
                } else {
                    setTimeout(() => {
                        this.takeEnemyTurn();
                    }, this.actionDelay);
                }
            } else {
                this.nextTurn();
            }
        } else {
            this.heroTurn = !this.heroTurn;
            this.characterIndex = -1;
            this.nextTurn();
        }
    }

    takeEnemyTurn(): void {
        if (this.currentCharacter instanceof Enemy && this.currentCharacter.isTrapped) {

        } else {
            let target: Hero;
            this.selectedAction = FightOptions.attack;

            while (!target) {
                let randomTargetIndex = Math.floor(Math.random() * this.heroParty.length);
                let potentialTarget = this.heroParty[randomTargetIndex];

                if (!potentialTarget.isIncapacitated) {
                    target = potentialTarget;
                }
            }

            this.displayMessage = `${this.currentCharacter.name} attacks ${target.name}!`;

            setTimeout(() => {
                this.tryAttack(target);
            }, this.actionDelay);
        }
    }

    gameOver() {
        this.gameController.gameOver();
    }

    nextChapter() {
        this.gameController.nextChapter();
        this.router.navigateByUrl("/story");
    }
}