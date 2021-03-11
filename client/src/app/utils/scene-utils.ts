import {Scene} from "phaser";
import {gameHeight, gameWidth} from "./helpers";

export interface SceneGridConfig {
  scene: Scene
  rows: number
  columns: number,
}
export class SceneGrid {
  private scrWidth = 0
  private scrHeight = 0
  private gridWidth = 0
  private gridHeight = 0
  private gridHalfWidth = 0
  private gridHalfHeight = 0
  private scene: Scene

  constructor(private config: SceneGridConfig) {
    this.scrWidth = gameWidth(config.scene.game)
    this.scrHeight = gameHeight(config.scene.game)
    this.gridWidth = Math.floor(this.scrWidth / config.columns)
    this.gridHeight = Math.floor(this.scrHeight / config.rows)
    this.gridHalfWidth = Math.floor(this.gridWidth / 2)
    this.gridHalfHeight = Math.floor(this.gridHeight / 2)
    this.scene = this.config.scene
  }

  createImageAt(x, y, key: string) {
    return this.scene.add.image(this.gridToScreenX(x), this.gridToScreenY(y), key)
  }

  createSpriteAt(x, y, key: string) {
    return this.scene.physics.add.sprite(
      this.gridToScreenX(x), this.gridToScreenY(y), key
    )
  }

  placeAt(x: number, y: number, obj: any) {
    obj.setPosition(this.gridToScreenX(x), this.gridToScreenY(y))
  }

  placeAtCenter(obj: any) {
    const cx = Math.floor(this.config.columns / 2) + (this.config.columns % 2) > 0? 1: 0
    const cy = Math.floor(this.config.rows / 2) + (this.config.rows % 2) > 0? 1: 0
    this.placeAt(cx, cy, obj)
  }

  gridToScreenX(x: number) {
    return (x * this.gridWidth) + this.gridHalfWidth
  }
  gridToScreenY(y: number) {
    return (y * this.gridHeight) + this.gridHalfHeight
  }
  screenToGridX(x: number) {
    return (Math.floor(x / this.gridWidth) + (x % this.gridWidth) > 0? 1: 0)
  }
  screenToGridY(y: number) {
    return (Math.floor(y / this.gridHeight) + (y % this.gridHeight) > 0? 1: 0)
  }

  drawGrid(colour = 0x00ff00) {
    const gc = this.scene.add.graphics()
    gc.lineStyle(2, colour)

    for (let i = 0; i < this.config.columns; i++) {
      const x = i * this.gridWidth
      gc.moveTo(x, 0)
      gc.lineTo(x, this.scrHeight)
    }

    for (let i = 0; i < this.config.rows; i++) {
      const y = i * this.gridHeight
      gc.moveTo(0, y)
      gc.lineTo(this.scrWidth, y)
    }

    gc.strokePath()
  }
}
