import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../redisCache.service';
import {
  Color,
  colorsValues,
  GameData,
  GameDataRO,
  PlayerData,
  PlayerDataRO,
} from './game.interface';

@Injectable()
export class GameService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async getGameData(gameId: number, userId: string): Promise<GameDataRO> {
    const cachedData = await this.redisCacheService.get(gameId);
    const isPlayersTurn = await this.checkIfIsPlaresTurn(cachedData, userId);
    const mappedPlayers: PlayerDataRO[] = cachedData.players.map(
      (player: PlayerData) => ({
        color: player.color,
        name: player.name,
        positions: player.positions,
      })
    );
    return {
      players: mappedPlayers,
      currentTurn: cachedData.currentTurn,
      rolledNumber: isPlayersTurn ? cachedData.rolledNumber : null,
      turnStatus: isPlayersTurn ? cachedData.turnStatus : null,
    };
  }

  async checkIfIsPlaresTurn(
    gameData: GameData,
    userId: string
  ): Promise<boolean> {
    const player = await this.getCurrentPlayer(gameData, userId);
    return player.color === gameData.currentTurn;
  }

  async passTurnToNextPlayer(gameId: number): Promise<void> {
    const gameData = await this.redisCacheService.get(gameId);
    const { currentTurn, players } = gameData;
    const colorsInGame: Color[] = players
      .map((player: PlayerData) => player.color)
      .sort((a: Color, b: Color) => colorsValues[b] - colorsValues[a]);
    const currentTurnIndex = colorsInGame.findIndex(
      (item: Color) => currentTurn === item
    );
    if (currentTurnIndex === colorsInGame.length - 1)
      gameData.currentTurn = colorsInGame[0];
    else gameData.currentTurn = colorsInGame[currentTurnIndex + 1];
    await this.redisCacheService.set(gameId, gameData);
  }

  async roll(gameId: number, userId: string): Promise<number> {
    const gameData = await this.redisCacheService.get(gameId);
    const isPlayersTurn = await this.checkIfIsPlaresTurn(gameData, userId);
    if (isPlayersTurn) {
      const { rolledNumber } = gameData;
      if (rolledNumber) return rolledNumber;
      const player = await this.getCurrentPlayer(gameData, userId);
      const { positions } = player;
      const newlyRolledNum = Math.floor(Math.random() * 6) + 1;
      if (
        positions.every((position: number) => position === 0) &&
        newlyRolledNum !== 1 &&
        newlyRolledNum !== 6
      ) {
        await this.passTurnToNextPlayer(gameId);
        return newlyRolledNum;
      }
      gameData.rolledNumber = newlyRolledNum as 1 | 2 | 3 | 4 | 5 | 6;
      gameData.turnStatus = 2;
      await this.redisCacheService.set(gameId, gameData);
      return newlyRolledNum;
    }
  }

  async getCurrentPlayer(
    gameData: GameData,
    userId: string
  ): Promise<PlayerData> {
    return gameData.players.find(
      (player: PlayerData) => player.userId === userId
    );
  }

  async movePawn(
    pawnId: number,
    gameId: number,
    userId: string
  ): Promise<void> {
    const gameData = await this.redisCacheService.get(gameId);
    const isPlayersTurn = await this.checkIfIsPlaresTurn(gameData, userId);
    if (!isPlayersTurn) return;
    const { rolledNumber } = gameData;
    const player = await this.getCurrentPlayer(gameData, userId);
    if (player && rolledNumber) {
      const movedPawn = player.positions[pawnId];
      if (rolledNumber !== 6 && rolledNumber !== 1 && movedPawn === 0) return;
      if (movedPawn === 0) player.positions[pawnId] = 1;
      else player.positions[pawnId] += rolledNumber;

      gameData.turnStatus = 1;
      gameData.rolledNumber = null;
      await this.redisCacheService.set(gameId, gameData);
      await this.passTurnToNextPlayer(gameId);
    }
  }
}
