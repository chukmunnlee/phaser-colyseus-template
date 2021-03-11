import {Game} from 'phaser';

export const gameWidth = (game: Game) => game.config.width as number
export const gameHeight = (game: Game) => game.config.height as number

export const scaleToGameWidth = (obj: any, game: Game, scale: number) => {
  return scaleObjectWidth(obj, gameWidth(game), scale)
}
export const scaleToGameHeight = (obj: any, game: Game, scale: number) => {
  return scaleObjectHeight(obj, gameHeight(game), scale)
}
export const scaleObjectWidth = (obj: any, size: number, scale: number) => {
  obj.displayWidth = Math.floor(size * scale)
  obj.scaleY = obj.scaleX
  return obj
}
export const scaleObjectHeight = (obj: any, size: number, scale: number) => {
  obj.displayHeight = Math.floor(size * scale)
  obj.scaleX = obj.scaleY
  return obj
}
