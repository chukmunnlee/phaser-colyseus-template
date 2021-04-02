import {GameObjects, Scene} from "phaser";
import {IMG_PHASER, IMG_NUMBER, NUMBER,
	SCENE_PRELOAD, SCENE_START} from "../constants";
import {gameHeight, gameWidth, scaleToGameHeight} from "../utils/helpers";

export class PreloadScene extends Scene {

	progressText: GameObjects.Text

	constructor() {
		super(SCENE_PRELOAD)
	}

	preload() {

		this.createText()

		this.load.on('progress', this.onProgress.bind(this))

		this.load.image(IMG_PHASER, 'assets/phaser.png')

		for (let i = 0; i < 5; i++) 
			this.load.image(`${IMG_NUMBER}${i}`, `${NUMBER}/number${i}.jpg`)
	}

	create() {
		const centX = gameWidth(this.game) / 2
		const centY = gameHeight(this.game) / 2
		const img = this.add.image(centX, centY, IMG_PHASER)
		scaleToGameHeight(img, this.game, .7)
	}

	onProgress(value: number) {
		const progress = Math.floor(value * 100)
		this.progressText.setText(`Progress: ${progress}%`)
		if (progress >= 100)
			this.time.delayedCall(1000,
				(() => this.scene.start(SCENE_START)).bind(this))
	}

	createText() {
		this.progressText = this.add.text(0, 0, 'Progress: 0%', {
			color: '#ffff00',
			fontSize: '5.5em',
			fontStyle: 'bolder'
		})
		this.progressText.setOrigin(.5, .5)
		const centX = gameWidth(this.game) / 2
		const centY = gameHeight(this.game) / 2
		this.progressText.setPosition(centX, centY)
	}
}
