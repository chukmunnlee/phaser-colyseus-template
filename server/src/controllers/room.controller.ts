import {Body, Controller, Get, Head, HttpCode, HttpStatus, NotFoundException, Param, Post, UnauthorizedException} from "@nestjs/common";

import {
	CMD_CREATE_ROOM, CMD_GET_ROOM,
	CreateRoomRequest, CreateRoomResponse, GetRoomResponse,  
	mkMessage
} from "common/messages";
import {AuthenticateService} from "src/services/authenticate.service";

import {GameService} from "src/services/game.service";

@Controller('room')
export class RoomController {

	constructor(private gameSvc: GameService, private authSvc: AuthenticateService) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async postRoom(@Body() req: CreateRoomRequest): Promise<CreateRoomResponse> {

		const jwt = this.authSvc.verifyToken(req.token)

		if (!jwt)
			throw new UnauthorizedException('Not authorized to create room')

		const resp = mkMessage<CreateRoomResponse>(CMD_CREATE_ROOM)

		resp.roomId = await this.gameSvc.createRoom(req.roomName)

		return resp
	}

	@Head(':roomId')
	@HttpCode(HttpStatus.OK)
	getRoom(@Param('roomId') roomId: string): Promise<GetRoomResponse> {
		if (!this.gameSvc.findRoom(roomId))
			throw new NotFoundException(`Room id ${roomId} not found`)

		const resp = mkMessage<GetRoomResponse>(CMD_GET_ROOM)
		resp.roomId = roomId
		return Promise.resolve(resp)
	}
}
