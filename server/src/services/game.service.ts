import {Injectable, OnApplicationShutdown} from "@nestjs/common";
import {Server, Room} from "colyseus";
import * as http from 'http'

type Type<T> = new (...args: any[]) => T

@Injectable()
export class GameService implements OnApplicationShutdown {

	server: Server

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
}
