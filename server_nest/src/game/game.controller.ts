import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { SessionData } from 'express-session';
import { GameService } from './game.service';
import { GameDataRO } from './game.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('data')
  async roomData(@Session() session: SessionData): Promise<GameDataRO> {
    const { roomId, userId } = session.user;
    if (!roomId) return null;
    return await this.gameService.getGameData(roomId, userId);
  }

  @Get('roll')
  async rollTheDice(@Session() session: SessionData): Promise<number> {
    const { roomId, userId } = session.user;
    return await this.gameService.roll(roomId, userId);
  }

  @Post('movePawn')
  async movePawn(
    @Session() session: SessionData,
    @Body() body: { pawnId: number }
  ): Promise<any> {
    const { pawnId } = body;
    const { roomId, userId } = session.user;
    await this.gameService.movePawn(pawnId, roomId, userId);
  }
}
