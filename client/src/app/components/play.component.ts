import { Component, Inject, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {IdentityService} from '../services/identity.service';
import { PreloadScene } from '../scenes/preload.scene'
import {StartScene} from '../scenes/start.scene';
import {GAME_SERVER} from '../constants';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(private gameSvc: GameService, private identSvc: IdentityService
  		, @Inject(GAME_SERVER) private readonly serverUrl: string) { }

  ngOnInit(): void {
	  // @ts-ignore
	  this.gameSvc.createGame([ PreloadScene, StartScene ])
  }

}
