import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import { CMD_LOGIN, LoginMessageRequest, LoginMessageResponse, mkMessage } from 'common/messages'
import {REST_ENDPOINT} from "../constants";

@Injectable()
export class IdentityService implements CanActivate {

	token: string = null
	username: string = null

	constructor(private http: HttpClient, private router: Router
		 , @Inject(REST_ENDPOINT) private readonly restEndpoint: string) { }

	performLogin(username: string, password: string): Promise<void> {
		const msg = mkMessage<LoginMessageRequest>(CMD_LOGIN)
		msg.username = username
		msg.password = password

		return this.http.post<LoginMessageResponse>(`${this.restEndpoint}/api/authenticate`, msg)
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

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.isLogin())
			return true
		return this.router.parseUrl('/')
	}

}
