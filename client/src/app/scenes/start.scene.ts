import {Scene} from "phaser";
import {IMG_PHASER, SCENE_START} from "../constants";
import { gameHeight, gameWidth, scaleToGameHeight } from "../utils/helpers";

export class StartScene extends Scene {

	constructor() {
		super(SCENE_START)
	}

	preload() { }

	create() { 
		const centX = gameWidth(this.game) / 2
		const centY = gameHeight(this.game) / 2
		const img = this.add.image(centX, centY, IMG_PHASER)
		scaleToGameHeight(img, this.game, .7)
	}

	update(t: number, dt: number) {
	}

}
