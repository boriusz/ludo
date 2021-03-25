import { Controller, Get, Session } from '@nestjs/common';
import { SessionData } from 'express-session';
import { GameService } from './game.service';
import { GameDataRO } from './game.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async roomData(@Session() session: SessionData): Promise<GameDataRO> {
    const { roomId } = session.user;
    if (!roomId) return null;

    return await this.gameService.getGameData(roomId);
  }
}
