import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import { CMD_LOGIN, LoginMessageRequest, LoginMessageResponse, mkMessage } from 'common/messages'

const BASE_URL = 'http://localhost:3000'

@Injectable()
export class IdentityService implements CanActivate {

	private token: string = null
	private _username: string = null

	get username() {
		return this._username
	}

	constructor(private http: HttpClient, private router: Router) { }

	performLogin(username: string, password: string): Promise<void> {
		const msg = mkMessage<LoginMessageRequest>(CMD_LOGIN)
		msg.username = username
		msg.password = password

		return this.http.post<LoginMessageResponse>(`${BASE_URL}/api/authenticate`, msg)
			.toPromise()
			.then(resp => {
				this.token = resp.token
				this._username = resp.username
			})
	}
	
	logout() {
		this.token = null
		this._username = null
	}

	isLogin() {
		return (this.token != null)
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.isLogin())
			return true
		return this.router.parseUrl('/')
	}


}
