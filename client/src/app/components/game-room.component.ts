import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import { MAIN_ROOM } from 'common/constants'

import {GameService} from '../services/game.service';
import {IdentityService} from '../services/identity.service';
import {RoomOptions} from '../types';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

	form: FormGroup

	constructor(private fb: FormBuilder, private router: Router
			, private identSvc: IdentityService, private gameSvc: GameService) { }
	
	ngOnInit(): void {
	  this.form = this.fb.group({
		  gameId: this.fb.control('', [ Validators.required, Validators.minLength(5) ])
		})
	}

	createRoom() {
		const opts: RoomOptions = {
			roomName: MAIN_ROOM,
			username: this.identSvc.username,
			token: this.identSvc.token
		}
		this.gameSvc.createRoom(opts)
			.then(result => {
				console.info('>>> room: ', result)
				this.router.navigate([ '/play', result.roomId ])
			})
			.catch(error => {
				console.error('Error: ', error)
			})
	}

	joinRoom() {
	}

}
