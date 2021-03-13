import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { Globals } from './globals';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { IdentityService } from './services/identity.service';
import { PlayComponent } from './components/play.component';
import { GameRoomComponent } from './components/game-room.component';
import {GameService} from './services/game.service';
import {GAME_SERVER} from './constants';

const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'login', component: MainComponent },
	{ path: 'game', component: GameRoomComponent, canActivate: [ IdentityService ] },
	{ path: 'play/:gameId', component: PlayComponent, canActivate: [ IdentityService ] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,  GameRoomComponent, PlayComponent, 
  ],
  imports: [
		BrowserModule, HttpClientModule,
		FormsModule, ReactiveFormsModule,
		RouterModule.forRoot(ROUTES)
  ],
  providers: [ IdentityService, GameService,
	  { provide: GAME_SERVER, useValue: 'localhost:3000' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
	constructor(injector: Injector) {
		Globals.injector = injector
	}
}
