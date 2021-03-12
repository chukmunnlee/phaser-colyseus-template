import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { CMD_LOGIN, LoginMessageRequest, LoginMessageResponse, mkMessage } from 'common/messages'
import {AuthenticateService} from 'src/services/authenticate.service';

@Controller('authenticate')
export class AuthenticateController {

	constructor(private authSvc: AuthenticateService) { }

	@Post()
	async authenticate(@Body() req: LoginMessageRequest): Promise<LoginMessageResponse> {
		//TODO: perform login
		const token = await this.authSvc.authenticate(req.username, req.password)
		if (!token)
			throw new UnauthorizedException({ message: 'Incorrect login' }, 'Incorrect login')

		const msg = mkMessage<LoginMessageResponse>(CMD_LOGIN)
		msg.username = req.username
		msg.token = token

		return msg
	}
}
