import {Injectable, OnApplicationShutdown} from "@nestjs/common";
import {Server, Room, matchMaker } from "colyseus";
import {RoomListingData} from "colyseus/lib/matchmaker/drivers/Driver";
import * as http from 'http'

type Type<T> = new (...args: any[]) => T

@Injectable()
export class GameService implements OnApplicationShutdown {

	server: Server

	rooms: string[] = []

	constructor() { }

	createServer(httpServer: http.Server) {

		if (this.server)
			return

		this.server = new Server({ server: httpServer })
	}

	defineRoom(name: string, room: Room<any, any>) {
		// @ts-ignore
		this.server.define(name, room)
	}

	listen(port: number): Promise<unknown> {
		return this.server.listen(port)
	}

	onApplicationShutdown(sig: string) {
		if (!this.server)
			return
		console.info(`Caught signal ${sig}. Shutting down game server on ${new Date()}`)
		this.server.gracefullyShutdown()
	}

	createRoom(roomName: string, opts = {}): Promise<string> {
		return matchMaker.createRoom(roomName, opts)
			.then(result => result.roomId)
	}

	findRoom(roomId: string): boolean {
		return this.rooms.findIndex(v => v == roomId) >= 0
	}

	removeRoom(roomId: string): Promise<boolean> {
		const idx = this.rooms.findIndex(v => v == roomId)
		if (idx <= -1)
			return Promise.resolve(false)
		const room = matchMaker.getRoomById(roomId)
		room.disconnect()
			.then(() =>  {
				this.rooms.splice(idx, 1) 
				return true
			})
	}
}
