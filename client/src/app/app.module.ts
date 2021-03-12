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
import {GameService} from './services/game.service';
import {SERVER_URL} from './constants';

const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'login', component: MainComponent },
	{ path: 'play', component: PlayComponent, 
	  canActivate: [ IdentityService ] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PlayComponent
  ],
  imports: [
		BrowserModule, HttpClientModule,
		FormsModule, ReactiveFormsModule,
		RouterModule.forRoot(ROUTES)
  ],
  providers: [ IdentityService, GameService,
	  { provide: SERVER_URL, useValue: 'http://localhost:3000' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
	constructor(injector: Injector) {
		Globals.injector = injector
	}
}
