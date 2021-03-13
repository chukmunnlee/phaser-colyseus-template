import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import {Room} from 'colyseus';

import * as express from 'express'
import * as http from 'http'

import { AppModule } from './app.module';
import { MAIN_ROOM } from 'common/constants'

import {Globals} from './globals';
import {MainRoom} from './rooms/main.room';
import {GameService} from './services/game.service';

const PORT = parseInt(process.env.PORT) || 3000

const ROOMS = [ MainRoom ]

async function bootstrap(port: number) {

	const app = express() 

	const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(app));
	nestApp.enableShutdownHooks()
	nestApp.enableCors()
	nestApp.setGlobalPrefix('/api')

	await nestApp.init()

	const httpServer = http.createServer(app)

	const gameSvc = nestApp.get(GameService)
	Globals.gameService = gameSvc

	gameSvc.createServer(httpServer)

	console.info(`Register room '${MAIN_ROOM}'`)
	// @ts-ignore
	gameSvc.defineRoom(MAIN_ROOM, MainRoom)

	gameSvc.listen(port)
		.then(() => {
			console.info(`Game Server started on port ${port} at ${new Date()}`)
		})
}

bootstrap(PORT);
