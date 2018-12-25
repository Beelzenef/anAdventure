import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './components/app.component';
import { StartComponent } from './components/start/start.component';
import { CharacterComponent } from './components/character/character.component';
import { FightComponent } from './components/fight/fight.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { StoryComponent } from './components/story/story.component';
import { GameControllerService } from './services/game-controller.service';

const routes: Routes = [
  { path: "", component: StartComponent },
  { path: "story", component: StoryComponent },
  { path: "character", component: CharacterComponent },
  { path: "fight", component: FightComponent },
  { path: "inventory", component: InventoryComponent },
  { path: "story", component: StoryComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    CharacterComponent,
    FightComponent,
    InventoryComponent,
    StoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GameControllerService],
  bootstrap: [AppComponent]
})
export class AppModule { }