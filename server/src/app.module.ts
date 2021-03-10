import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import * as morgan from 'morgan'

import { AppController } from './app.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import {AuthenticateService} from './services/authenticate.service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticateController],
  providers: [ 
	  AuthenticateService,
  ],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(morgan('combined')).forRoutes('*')
	}
}
