export const MESSAGE_TYPE = 'game-message'

export const CMD_LOGIN = 'login'
export const CMD_CREATE_ROOM = 'create-room'
export const CMD_GET_ROOM = 'get-room'

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
