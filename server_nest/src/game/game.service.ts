import { Injectable } from '@nestjs/common';
import { RedisCacheService } from './redisCache.service';
import {
  GameData,
  GameDataRO,
  PlayerData,
  PlayerDataRO,
} from './game.interface';

@Injectable()
export class GameService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async getGameData(gameId: number): Promise<GameDataRO> {
    let cachedData = await this.redisCacheService.get(gameId.toString());
    if (!cachedData) {
      await this.redisCacheService.cacheDbData(gameId);
      cachedData = await this.redisCacheService.get(gameId.toString());
    }

    const gameData: GameData = JSON.parse(cachedData);
    const mappedPlayers: PlayerDataRO[] = gameData.players.map(
      (player: PlayerData) => ({
        color: player.color,
        name: player.name,
        positions: player.positions,
      })
    );
    return {
      players: mappedPlayers,
      currentTurn: gameData.currentTurn,
      rolledNumber: gameData.rolledNumber,
      turnStatus: gameData.turnStatus,
    };
  }
}
