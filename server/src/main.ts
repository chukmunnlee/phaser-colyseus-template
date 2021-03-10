import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'

import * as express from 'express'
import * as http from 'http'

import { AppModule } from './app.module';

const PORT = parseInt(process.env.PORT) || 3000

async function bootstrap(port: number) {

	const app = express() 

	const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(app));
	nestApp.enableShutdownHooks()
	nestApp.enableCors()
	nestApp.setGlobalPrefix('/api')

	await nestApp.init()

	await nestApp.listen(port);
}

bootstrap(PORT);
