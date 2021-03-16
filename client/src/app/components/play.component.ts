import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {IdentityService} from '../services/identity.service';
import { PreloadScene } from '../scenes/preload.scene'
import {StartScene} from '../scenes/start.scene';
import {GAME_SERVER} from '../constants';
import {ActivatedRoute} from '@angular/router';
import {CreateGameOptions, RoomOptions} from '../types';
import {BaseGameMessage} from 'common/messages';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {

	roomId = ''
	status = 'assets/icons/off.png'

	gameSvc$: Subscription

  constructor(private activatedRoute: ActivatedRoute, 
		  private gameSvc: GameService, private identSvc: IdentityService
  		, @Inject(GAME_SERVER) private readonly serverUrl: string) { }

  ngOnInit(): void {
	  this.roomId = this.activatedRoute.snapshot.params['roomId']
	  const opt: CreateGameOptions = {
		  // @ts-ignore
		  scenes: [ PreloadScene, StartScene ]
	  }

	  this.gameSvc$ = this.gameSvc.events.subscribe(this.messageHandler.bind(this))

	  // create the game screen
	  this.gameSvc.createGame(opt)

	  // connect to the server
	  this.gameSvc.connect(`ws://${this.serverUrl}`)

	  // this join room
	  const opts: RoomOptions = {
		  username: this.identSvc.username,
		  token: this.identSvc.token,
	  }
	  this.gameSvc.joinRoomWithId(this.roomId, opts)
	  	.then(room => {
			this.status = 'assets/icons/on.png'
		})
	  .catch(error => {
		  console.error('Error: ', error)
	  })
	}

	ngOnDestroy() {
		this.gameSvc$.unsubscribe()
	}

	private messageHandler(msg: BaseGameMessage) {
	}


}
