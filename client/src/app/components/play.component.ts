import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {IdentityService} from '../services/identity.service';
import { PreloadScene } from '../scenes/preload.scene'
import {StartScene} from '../scenes/start.scene';
import {CONNECTED, DISCONNECTED, WSS_ENDPOINT} from '../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateGameOptions, RoomOptions} from '../types';
import {BaseGameMessage, CMD_GET_PLAYERS_REQUEST, CMD_GET_PLAYERS_RESPONSE, CMD_PLAYER_JOINED, CMD_PLAYER_LEFT, CMD_ROOM_ERROR, GetPlayersRequest, GetPlayersResponse, mkMessage, PlayerJoined, PlayerLeft} from 'common/messages';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {

	roomId = ''
	status = DISCONNECTED

	gameSvc$: Subscription

	players: string[] = []

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
		  private gameSvc: GameService, private identSvc: IdentityService
  		, @Inject(WSS_ENDPOINT) private readonly wssEndpoint: string) { }

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
	  this.gameSvc.connect(`${this.wssEndpoint}`)

	  // this join room
	  const opts: RoomOptions = {
		  username: this.identSvc.username,
		  token: this.identSvc.token,
	  }
	  this.gameSvc.joinRoomWithId(this.roomId, opts)
	  	.then(() => this.status = CONNECTED)
	  .catch(error => {
		  console.error('Error: ', error)
	  })
	}

	ngOnDestroy() {
		this.gameSvc$.unsubscribe()
	}

	leaveGame() {
		this.gameSvc.disconnect()
		this.identSvc.logout()

		this.router.navigate([ '/' ])
	}

	private messageHandler(msg: BaseGameMessage) {
		switch (msg.command) {
			case CMD_PLAYER_JOINED:
				const pj = msg as PlayerJoined
				this.players.push(pj.username)
				break

			case CMD_PLAYER_LEFT:
				const pl = msg as PlayerLeft
				const idx = this.players.findIndex(v => v == pl.username)
				if (idx >= 0)
					this.players.splice(idx, 1)
				break

			case CMD_GET_PLAYERS_RESPONSE:
				const gpResp = msg as GetPlayersResponse
				this.players = gpResp.players
				break

			case CMD_ROOM_ERROR:
				this.status = DISCONNECTED
				this.players = []
				break

			// ignore any message we cannot handle
			default:
		}
	}

}
