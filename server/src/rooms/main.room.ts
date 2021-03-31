import {Client, Room} from "colyseus";
import {BaseGameMessage, MESSAGE_TYPE, mkMessage, 
	PlayerJoined, PlayerLeft,
	CMD_PLAYER_JOINED, CMD_PLAYER_LEFT
} from "common/messages";

import * as http from 'http'

export class MainRoom extends Room {

	roomName = 'MainRoon'

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
		const username = options['username'] || 'anon'
		client.userData = { username }

		const msg = mkMessage<PlayerJoined>(CMD_PLAYER_JOINED)
		msg.gameId = this.roomId
		msg.username = username

		this.broadcast(MESSAGE_TYPE, msg, { except: client })
	}

	onLeave(client: Client, constened: boolean) {
		const msg = mkMessage<PlayerLeft>(CMD_PLAYER_LEFT)
		msg.gameId = this.roomId
		msg.username = client.userData['username']

		this.broadcast(MESSAGE_TYPE, msg, { except: client })
	}

	onDispose() {
		console.info('>> onDispose: ', this.roomName)
	}

	messageHandler(client: Client, msg: BaseGameMessage) {
		switch (msg.command) {
			default:
				console.error('Unknown message: ', msg)
		}
	}

}
