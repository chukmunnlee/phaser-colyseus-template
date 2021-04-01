import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {Client, Room} from "colyseus.js";
import {Game } from "phaser";
import {Subject} from "rxjs";

import {REST_ENDPOINT } from "../constants";
import {CreateGameOptions, RoomOptions} from "../types";
import { 
	CMD_CREATE_ROOM_REQUEST, MESSAGE_TYPE, CMD_ROOM_ERROR,
	CreateRoomRequest, CreateRoomResponse, GetRoomResponse, 
	RoomError, BaseGameMessage,
	mkMessage, 
} from 'common/messages'
import {IdentityService} from "./identity.service";


@Injectable()
export class GameService {

	game: Game = null
	client: Client;
	room: Room
	roomId = '';
	debug = false

	events = new Subject<BaseGameMessage>()

	constructor(private http: HttpClient, private identSvc: IdentityService
		, @Inject(REST_ENDPOINT) private readonly restEndpoint: string) { }

	createGame(opts: CreateGameOptions) {

		const width = opts?.width || 700
		const height = opts?.height || 700
		this.debug = ('debug' in opts)? opts.debug: this.debug

		if (this.game)
			return

		this.game = new Game({
			width, height, 
			scene: opts.scenes,
			parent: 'game',
			physics: {
				default: 'arcade',
				arcade: {
					debug: this.debug
				}
			}
		})
	}

	connect(connection: string) {
		if (this.client)
			return

		this.client = new Client(connection)
	}

	disconnect() {
		if (!this.client)
			return

		this.room.removeAllListeners()
		this.room.leave(true)
		this.game.destroy(false, false)
	}

	sendMessage(msg: BaseGameMessage) {
		this.room.send(MESSAGE_TYPE, msg)
	}

	createRoom(opts: RoomOptions): Promise<CreateRoomResponse> {
		const data = mkMessage<CreateRoomRequest>(CMD_CREATE_ROOM_REQUEST)
		data.roomName = opts.roomName
		data.username = opts.username
		data.token = opts.token

		return this.http.post<CreateRoomResponse>(`${this.restEndpoint}/api/room`, data)
			.toPromise()
			.then(result => {
				this.roomId = result.roomId
				return result
			})
	}

	getRoom(roomId: string): Promise<boolean> {
		return this.http.head<GetRoomResponse>(`${this.restEndpoint}/api/room/${roomId}`)
			.toPromise()
			.then(() => true)
			.catch(error => {
				console.error('Error: ', error)
				return false
			})
	}

	joinRoomWithId(roomId: string, opts: RoomOptions): Promise<Room<unknown>> {
		return this.client.joinById(roomId, opts)
			.then(room => this.setup(room))
	}

	joinRoom(opts: RoomOptions): Promise<Room<unknown>> {

		const create = ('create' in opts)? opts.create: true

		const joinOpts = {
			username: opts.username,
			token: opts.token
		}

		const p = create?  this.client.joinOrCreate(opts.roomName, joinOpts): 
				this.client.join(opts.roomName, joinOpts)

		return p.then(room => {
			this.setup(room)
			return room
		})
	}

	private setup(room: Room<unknown>) {
		this.room = room
		this.roomId = room.id
		//this.room.onMessage(MESSAGE_TYPE, this.messageHandler.bind(this))
		this.room.onMessage(MESSAGE_TYPE, this.messageHandler.bind(this))
		this.room.onLeave(code => {
			const rmError = mkMessage<RoomError>(CMD_ROOM_ERROR)
			rmError.gameId = this.roomId
			rmError.errorCode = code
			this.messageHandler(rmError)
		})
		this.room.onError((code, msg) => {
			// TODO do something here
			console.error(`Error: ${code} - ${msg}`)
		})
		return room
	}

	private messageHandler(msg: BaseGameMessage) {
		console.info('>> ', msg)
		this.events.next(msg)
	}
}
