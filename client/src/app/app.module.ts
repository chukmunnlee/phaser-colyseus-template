import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import {IdentityService} from './services/identity.service';

const ROUTES: Routes = [
	{ path: '', component: MainComponent },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
		BrowserModule, HttpClientModule,
		FormsModule, ReactiveFormsModule,
		RouterModule.forRoot(ROUTES)
  ],
  providers: [ IdentityService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
