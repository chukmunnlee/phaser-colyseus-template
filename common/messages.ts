export const MESSAGE_TYPE = 'game-message'

export const CMD_LOGIN = 'login'
export const CMD_CREATE_ROOM_REQUEST = 'create-room-req'
export const CMD_CREATE_ROOM_RESPONSE = 'create-room-resp'
export const CMD_GET_ROOM_REQUEST = 'get-room-req'
export const CMD_GET_ROOM_RESPONSE = 'get-room-resp'

export const CMD_PLAYER_JOINED = 'player-joined'
export const CMD_PLAYER_LEFT = 'player-left'
export const CMD_GET_PLAYERS_REQUEST = 'get-players-req'
export const CMD_GET_PLAYERS_RESPONSE = 'get-players-resp'
export const CMD_ROOM_ERROR = 'room-error'

export interface BaseMessage {
	command: string
}

export interface LoginMessageRequest extends BaseMessage {
	username: string
	password: string
}
export interface LoginMessageResponse extends BaseMessage {
	username: string
	token: string
}

export interface CreateRoomRequest extends LoginMessageResponse { 
	roomName: string
}
export interface CreateRoomResponse extends BaseMessage {
	roomId: string
}

export interface GetRoomRequest extends BaseMessage {
	roomId: string
}
export interface GetRoomResponse extends GetRoomRequest { }

export const mkMessage = function<T extends BaseMessage>(command: string) {
	return { command } as T
}

export interface BaseGameMessage extends BaseMessage {
	gameId: string
}

export interface PlayerJoined extends BaseGameMessage {
	username: string
}

export interface PlayerLeft extends PlayerJoined { }

export interface GetPlayersRequest extends BaseGameMessage {
	includeSelf: boolean
}

export interface GetPlayersResponse extends BaseGameMessage {
	players: string[]
}

export interface RoomError extends BaseGameMessage { 
	errorCode: number
}
