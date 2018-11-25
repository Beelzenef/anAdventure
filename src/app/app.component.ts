import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'anAdventure';

  names : string[] = ["Name1", "Name2", "Name3"]

  clickando(sentence : string) {
    console.log("clicking: " + sentence)
  }
}
