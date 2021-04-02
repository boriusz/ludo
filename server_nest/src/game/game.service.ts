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
    const isPlayersTurn = await this.checkIfIsPlayersTurn(cachedData, userId);
    const mappedPlayers: PlayerDataRO[] = cachedData.players.map(
      (player: PlayerData) => ({
        color: player.color,
        name: player.name,
        positions: player.positions,
      })
    );
    return {
      players: mappedPlayers,
      finished: [], // TODO: find all players that finished
      currentTurn: cachedData.currentTurn,
      rolledNumber: isPlayersTurn ? cachedData.rolledNumber : null,
      turnStatus: isPlayersTurn ? cachedData.turnStatus : null,
    };
  }

  async checkIfIsPlayersTurn(
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
      .sort((a: Color, b: Color) => colorsValues[a] - colorsValues[b]);
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
    const isPlayersTurn = await this.checkIfIsPlayersTurn(gameData, userId);
    if (isPlayersTurn) {
      const { rolledNumber } = gameData;
      if (rolledNumber) return rolledNumber;
      const player = await this.getCurrentPlayer(gameData, userId);
      const { positions } = player;
      const newlyRolledNum = Math.floor(Math.random() * 6) + 1;
      if (
        (positions.every((position: number) => position === 0) &&
          newlyRolledNum !== 1 &&
          newlyRolledNum !== 6) || // Cant move anything bc everything is at start
        positions.every((position: number) => position + rolledNumber > 105)
      ) {
        gameData.rolledNumber = newlyRolledNum as 1 | 2 | 3 | 4 | 5 | 6;
        gameData.turnStatus = 2;
        await this.redisCacheService.set(gameId, gameData);
        setTimeout(async () => {
          gameData.rolledNumber = null;
          gameData.turnStatus = 1;
          await this.redisCacheService.set(gameId, gameData);
          await this.passTurnToNextPlayer(gameId);
        }, 1500);

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
    const isPlayersTurn = await this.checkIfIsPlayersTurn(gameData, userId);
    if (!isPlayersTurn) return;
    const { rolledNumber } = gameData;
    const player = await this.getCurrentPlayer(gameData, userId);
    if (player && rolledNumber) {
      const movedPawn = player.positions[pawnId];
      if (rolledNumber !== 6 && rolledNumber !== 1 && movedPawn === 0) return;
      if (movedPawn === 0) player.positions[pawnId] = 1;
      else if (movedPawn + rolledNumber > 51 && movedPawn < 100)
        player.positions[pawnId] = movedPawn + rolledNumber - 52 + 100;
      else if (movedPawn + rolledNumber > 105) return;
      else player.positions[pawnId] += rolledNumber;
      gameData.turnStatus = 1;

      if (player.positions.every((position: number) => position === 105)) {
        const data = await this.playerFinished(player, gameData);
        await this.redisCacheService.set(gameId, data);
        return;
      }

      await this.killPawns(gameId, gameData, pawnId);
    }
  }

  async playerFinished(
    player: PlayerData,
    gameData: GameData
  ): Promise<GameData> {
    const placement = (gameData.finished.length + 1) as 1 | 2 | 3 | 4;
    gameData.finished.push({ player, placement });
    console.log(`Player ${player.name} finished game placing: ...`);
    return gameData;
  }

  async killPawns(
    gameId: number,
    gameData: GameData,
    pawnId: number
  ): Promise<void> {
    console.log('killer');
    const { players, currentTurn } = gameData;
    const otherPlayers = players.filter(
      (player: PlayerData) => player.color !== currentTurn
    );
    const player = players.find(
      (player: PlayerData) => player.color === currentTurn
    );
    const pawnPosition = player.positions[pawnId];
    const lastlyMovedPawn =
      colorsValues[currentTurn] * 13 + player.positions[pawnId] > 52
        ? colorsValues[currentTurn] * 13 + player.positions[pawnId] - 52
        : colorsValues[currentTurn] * 13 + player.positions[pawnId];
    if (lastlyMovedPawn % 13 !== 1) {
      console.log(`predator at pos ${lastlyMovedPawn}`);
      otherPlayers.forEach((player: PlayerData) => {
        player.positions = player.positions.map((position: number) => {
          const preyPosition =
            colorsValues[player.color] * 13 + position > 52
              ? colorsValues[player.color] * 13 + position - 52
              : colorsValues[player.color] * 13 + position;
          console.log(`prey position: ${preyPosition}`);
          if (preyPosition === lastlyMovedPawn) return 0;
          return position;
        });
      });
    }
    if (gameData.rolledNumber === 6 || pawnPosition === 105) {
      gameData.rolledNumber = null;
      gameData.turnStatus = 1;
      await this.redisCacheService.set(gameId, gameData);
      console.log(await this.redisCacheService.get(gameId));
      return;
    }
    gameData.rolledNumber = null;
    await this.redisCacheService.set(gameId, gameData);
    await this.passTurnToNextPlayer(gameId);
  }
}
