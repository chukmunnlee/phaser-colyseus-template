import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { monitor } from '@colyseus/monitor'

import * as morgan from 'morgan'

import { AppController } from './app.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import {AuthenticateService} from './services/authenticate.service';
import {GameService} from './services/game.service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticateController],
  providers: [ AuthenticateService, GameService ],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(morgan('combined')).forRoutes('*')
		consumer
			.apply(monitor()).forRoutes('monitor')
	}
}
