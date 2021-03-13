import {Injectable} from "@nestjs/common";

import { v4 as uuidv4 } from 'uuid'
import { sign, verify } from 'jsonwebtoken'
import {UserToken} from "src/models";

@Injectable()
export class AuthenticateService {
	private readonly secret: string

	constructor() {
		this.secret = uuidv4().toString().substring(0, 8)
	}

	authenticate(username: string, password: string): Promise<string> {
		
		//TODO authenticate username, password
		if (!password.startsWith(username))
			return Promise.resolve("")
		
		const payload: UserToken = {
			sub: username,
			iss: 'game-server',
			iat: Math.floor(Date.now() / 1000)
		}
		return Promise.resolve(sign(payload, this.secret))
	}

	verifyToken(token: string): UserToken {
		try {
			return verify(token, this.secret) as UserToken
		} catch(e) {
			return null
		}
	}
}
