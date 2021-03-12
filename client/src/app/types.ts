import {Scene} from "phaser";

export interface CreateGameOptions {
	scene: Scene[]
	width?: number
	height?: number
	debug?: boolean
}

export interface RoomOptions {
	username: string
	roomName: string
	token: string
	create?: boolean
}
