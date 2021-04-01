import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { environment } from '../environments/environment'

import { Globals } from './globals';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { IdentityService } from './services/identity.service';
import { PlayComponent } from './components/play.component';
import { GameRoomComponent } from './components/game-room.component';
import {GameService} from './services/game.service';
import {REST_ENDPOINT, WSS_ENDPOINT} from './constants';

const wssUrl = () => {

	if (!environment.production)
		return 'ws://localhost:3000'

	const l = window.location
	return (l.protocol == 'https:'? 'wss://': 'ws://') + l.host 
			+ (!!l.port? `:${l.port}`: '')
}
const httpUrl = () => ''

const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'login', component: MainComponent },
	{ path: 'game', component: GameRoomComponent, canActivate: [ IdentityService ] },
	{ path: 'play/:roomId', component: PlayComponent, canActivate: [ IdentityService ] },
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
	  { provide: WSS_ENDPOINT, useFactory: wssUrl },
	  { provide: REST_ENDPOINT, useFactory: httpUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
	constructor(injector: Injector) {
		Globals.injector = injector
	}
}
