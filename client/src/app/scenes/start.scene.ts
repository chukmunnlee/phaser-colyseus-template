import {Scene, GameObjects, Scenes} from "phaser";
import {Subscription} from "rxjs";

import {BaseGameMessage, GetPlayersResponse,
	CMD_GET_PLAYERS_RESPONSE, CMD_PLAYER_JOINED, CMD_PLAYER_LEFT, mkMessage, GetPlayersRequest, CMD_GET_PLAYERS_REQUEST
} from "common/messages";
import {IMG_NUMBER, IMG_PHASER, SCENE_START} from "../constants";
import {Globals} from "../globals";
import {GameService} from "../services/game.service";
import { gameHeight, gameWidth, scaleToGameHeight } from "../utils/helpers";

export class StartScene extends Scene {

	img: GameObjects.Image
	gameSvc: GameService

	gameSvc$: Subscription

	playerCount = -1
	centX = 0
	centY = 0

	constructor() {
		super(SCENE_START)

		this.gameSvc = Globals.injector.get(GameService)
		this.gameSvc$ = this.gameSvc.events.subscribe(this.messageHandler.bind(this))
	}

	preload() { 
	}

	create() { 
		this.centX = gameWidth(this.game) / 2
		this.centY = gameHeight(this.game) / 2
		this.img = this.add.image(this.centX, this.centY, IMG_PHASER)
		scaleToGameHeight(this.img, this.game, .7)

		this.events.on(Scenes.Events.SHUTDOWN, 
			(() => this.gameSvc$.unsubscribe()).bind(this))

		const gpReq = mkMessage<GetPlayersRequest>(CMD_GET_PLAYERS_REQUEST)
		gpReq.gameId = this.gameSvc.roomId
		gpReq.includeSelf = false
		this.gameSvc.sendMessage(gpReq)
	}

	update(t: number, dt: number) {
	}

	messageHandler(msg: BaseGameMessage) {
		switch (msg.command) {
			case CMD_GET_PLAYERS_RESPONSE:
				const gpResp = msg as GetPlayersResponse
				this.playerCount = gpResp.players.length
				break;

			case CMD_PLAYER_LEFT:
				this.playerCount--
				break;

			case CMD_PLAYER_JOINED:
				this.playerCount++
				break

			default:
				return
		}

		this.img.destroy()
		this.img = this.add.image(this.centX, this.centY, `${IMG_NUMBER}${this.playerCount}`)
		scaleToGameHeight(this.img, this.game, .7)
	}

}
