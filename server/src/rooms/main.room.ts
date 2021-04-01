import {Client, Room} from "colyseus";
import {BaseGameMessage, MESSAGE_TYPE, mkMessage, 
	PlayerJoined, PlayerLeft, GetPlayersRequest, GetPlayersResponse,
	CMD_PLAYER_JOINED, CMD_PLAYER_LEFT, 
	CMD_GET_PLAYERS_REQUEST, CMD_GET_PLAYERS_RESPONSE,
} from "common/messages";

import * as http from 'http'
import { v4 as uuid4 } from 'uuid'

export class MainRoom extends Room {

	roomName = 'MainRoon'

	players: string[] = []

	onAuth(client: Client, options: any, req: http.IncomingMessage) {
		console.info('>> onAuth: ', options)
		return true
	}

	onCreate(options: any) {

		if ('roomName' in options)
			this.roomName = options['roomName']

		this.onMessage(MESSAGE_TYPE, this.messageHandler.bind(this))
	}

	onJoin(client: Client, options: any, auth: any) {
		const username = options['username'] || uuid4().toString().substring(0, 8)
		client.userData = { username }

		this.players.push(username)

		const msg = mkMessage<PlayerJoined>(CMD_PLAYER_JOINED)
		msg.gameId = this.roomId
		msg.username = username

		this.broadcast(MESSAGE_TYPE, msg, { except: client })
	}

	onLeave(client: Client, constened: boolean) {
		const msg = mkMessage<PlayerLeft>(CMD_PLAYER_LEFT)
		msg.gameId = this.roomId
		msg.username = client.userData['username']

		const idx = this.players.findIndex(v => v == msg.username)
		if (idx >= 0)
			this.players.splice(idx, 1)

		this.broadcast(MESSAGE_TYPE, msg, { except: client })
	}

	onDispose() {
		console.info('>> onDispose: ', this.roomName)
	}

	messageHandler(client: Client, msg: BaseGameMessage) {
		switch (msg.command) {
			case CMD_GET_PLAYERS_REQUEST:
				const gpReq = msg as GetPlayersRequest
				const gpResp = mkMessage<GetPlayersResponse>(CMD_GET_PLAYERS_RESPONSE)
				gpResp.gameId = this.roomId
				let pl = this.players
				if (!gpReq.includeSelf)
					pl = pl.filter(v => v != client.userData['username'])
				gpResp.players = pl
				client.send(MESSAGE_TYPE, gpResp)
				break

			default:
				console.error('Unknown message: ', msg)
		}
	}

}
