import {Scene} from "phaser";

export interface CreateGameOptions {
	scenes: Scene[]
	width?: number
	height?: number
	debug?: boolean
}

export interface RoomOptions {
	username: string
	token: string
	roomName?: string
	create?: boolean
}
