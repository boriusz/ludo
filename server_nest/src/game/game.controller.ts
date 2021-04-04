import { Controller, Get, Put, Query, Session } from '@nestjs/common';
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
    return await this.gameService.getGameData(roomId, userId);
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
