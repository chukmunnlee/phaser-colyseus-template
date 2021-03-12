import {Client, Room} from "colyseus";

export class MainRoom extends Room {

	roomName = 'MainRoon'

	onCreate(options: any) {
		console.info('>> onCreate: ', options)
		if ('roomName' in options)
			this.roomName = options['roomName']
	}

	onJoin(client: Client, options: any, auth: any) {
		console.info('>> onJoin: ', options)
	}

	onLeave(client: Client, constened: boolean) {
		console.info('>> onLeave: ', client)
	}

	onDispose() {
		console.info('>> onDispose: ', this.roomName)
	}

}
