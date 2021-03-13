import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {Client, Room} from "colyseus.js";
import {Game, Scene} from "phaser";
import {Subject} from "rxjs";

import {GAME_SERVER } from "../constants";
import {CreateGameOptions, RoomOptions} from "../types";
import { CMD_CREATE_ROOM, CreateRoomRequest, CreateRoomResponse, mkMessage } from 'common/messages'
import {IdentityService} from "./identity.service";


@Injectable()
export class GameService {

	game: Game = null
	client: Client;
	room: Room
	roomId = '';
	debug = false

	events = new Subject<any>()

	constructor(private http: HttpClient, private identSvc: IdentityService
		, @Inject(GAME_SERVER) private readonly serverUrl: string) { }

	createGame(opts: CreateGameOptions) {

		const width = opts?.width || 700
		const height = opts?.height || 700
		this.debug = ('debug' in opts)? opts.debug: this.debug

		if (this.game)
			return

		this.game = new Game({
			width, height, 
			scene: opts.scene,
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

	createGameRoom(opts: RoomOptions): Promise<CreateRoomResponse> {
		const data = mkMessage<CreateRoomRequest>(CMD_CREATE_ROOM)
		data.roomName = opts.roomName
		data.username = opts.username
		data.token = opts.token

		return this.http.post<CreateRoomResponse>(`http://${this.serverUrl}/api/room`, data)
			.toPromise()
			.then(result => {
				this.roomId = result.roomId
				return result
			})
	}

	joinRoom(opts: RoomOptions): Promise<Room<unknown>> {
		if (this.client)
			return

		const create = ('create' in opts)? opts.create: true

		const joinOpts = {
			username: opts.username,
			token: opts.token
		}

		const p = create?  this.client.joinOrCreate(opts.roomName, joinOpts): 
				this.client.join(opts.roomName, joinOpts)

		return p.then(room => {
			this.room = room
			return room
		})
	}
}
