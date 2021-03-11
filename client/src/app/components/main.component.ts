import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {IdentityService} from '../services/identity.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

	loginForm: FormGroup;

	constructor(private fb: FormBuilder, private router: Router
		, private identSvc: IdentityService) { }

	ngOnInit(): void {
		this.loginForm = this.fb.group({
		  username: this.fb.control('', [ Validators.required ]),
		  password: this.fb.control('', [ Validators.required ]),
		})
	}

	performLogin() {
		const values = this.loginForm.value
		console.info('>>> values: ', values)
		this.identSvc.performLogin(values['username'], values['password'])
			.then(() => {
				console.info('>>> navigating to play')
				this.router.navigate([ '/play' ])
			})
			.catch(error => {
				console.error('Login: ', error)
			})
	}

}
