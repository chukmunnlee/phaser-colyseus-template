export const CMD_LOGIN = 'login'

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

export const mkMessage = function<T extends BaseMessage>(command: string) {
	return { command } as T
}
