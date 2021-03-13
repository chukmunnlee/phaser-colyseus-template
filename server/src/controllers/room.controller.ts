import {Controller, Post} from "@nestjs/common";
import {GameService} from "src/services/game.service";

@Controller('room')
export class RoomController {
	constructor(private gameSvc: GameService) { }

	//@Post()
}
