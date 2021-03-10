import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { CMD_LOGIN, LoginMessageRequest, LoginMessageResponse, mkMessage } from 'common/messages'

const BASE_URL = 'http://localhost:3000'

@Injectable()
export class IdentityService {

	private token: string = null
	private username: string = null

	constructor(private http: HttpClient) { }

	performLogin(username: string, password: string): Promise<void> {
		const msg = mkMessage<LoginMessageRequest>(CMD_LOGIN)
		msg.username = username
		msg.password = password

		return this.http.post<LoginMessageResponse>(`${BASE_URL}/api/authenticate`, msg)
			.toPromise()
			.then(resp => {
				this.token = resp.token
				this.username = resp.username
			})
	}
	
	logout() {
		this.token = null
		this.username = null
	}

	isLogin() {
		return (this.token != null)
	}

}
