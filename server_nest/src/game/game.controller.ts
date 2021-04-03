import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Session,
} from '@nestjs/common';
import { SessionData } from 'express-session';
import { GameService } from './game.service';
import { GameData } from './game.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('data')
  async getGameData(@Session() session: SessionData): Promise<GameData> {
    const { roomId, userId } = session.user;
    if (!roomId) return null;
    const gameData = await this.gameService.getGameData(roomId, userId);
    if (gameData.ended) {
      console.log('setting timeouts for ', session.user.name);
      setTimeout(() => {
        session.user.inGame = false;
        session.user.roomId = null;
        console.log(session.user);
      }, 1000 * 30);
    }
    return gameData;
  }

  @Get('roll')
  async roll(@Session() session: SessionData): Promise<number> {
    const { roomId, userId } = session.user;
    return await this.gameService.roll(roomId, userId);
  }

  @Put('movePawn')
  async movePawn(
    @Session() session: SessionData,
    @Query() query: { pawnId: number }
  ): Promise<string> {
    const { pawnId } = query;
    const { roomId, userId } = session.user;
    await this.gameService.movePawn(pawnId, roomId, userId);
    return 'ok';
  }
}
