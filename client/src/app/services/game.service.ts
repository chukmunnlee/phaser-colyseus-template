import {Injectable} from "@angular/core";
import {Game, Types, Scene} from "phaser";
import {Subject} from "rxjs";
import {PreloadScene} from "../scenes/preload.scene";

@Injectable()
export class GameService {

	game: Game = null

	events = new Subject<any>()

	constructor() { }

	createGame(scene: Scene[] = [], width = 700, height = 500, debug = false) {

		if (this.game)
			return

		this.game = new Game({
			width, height, scene,
			parent: 'game',
			physics: {
				default: 'arcade',
				arcade: {
					debug
				}
			}
		})
	}
}
