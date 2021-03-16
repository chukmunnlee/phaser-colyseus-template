import {GameObjects, Scene} from "phaser";
import {IMG_PHASER, SCENE_PRELOAD, SCENE_START} from "../constants";
import {gameHeight, gameWidth} from "../utils/helpers";

export class PreloadScene extends Scene {

	progressText: GameObjects.Text

	constructor() {
		super(SCENE_PRELOAD)
	}

	preload() {

		this.createText()

		this.load.on('progress', this.onProgress.bind(this))

		this.load.image(IMG_PHASER, 'assets/phaser.png')
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
