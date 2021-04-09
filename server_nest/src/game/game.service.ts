import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../redisCache.service';
import {
  Color,
  colorsValues,
  Finish,
  GameData,
  PlayerData,
  PlayerDataRO,
} from './game.interface';

@Injectable()
export class GameService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async getGameData(gameId: number, userId: string): Promise<GameData> {
    const gameData = await this.redisCacheService.get(gameId);
    const isPlayersTurn = await this.checkIfIsPlayersTurn(gameData, userId);
    const {
      finished,
      turnTime,
      currentTurn,
      rolledNumber,
      turnStatus,
    } = gameData;
    const mappedPlayers: PlayerDataRO[] = gameData.players.map(
      (player: PlayerData) => ({
        color: player.color,
        name: player.name,
        positions: player.positions,
      })
    );
    const mappedFinished = finished.map((item: Finish) => {
      const { userId, ...data } = item.player as PlayerData;
      return { player: data as PlayerDataRO, placement: item.placement };
    });
    if (gameData.players.length === gameData.finished.length) {
      gameData.ended = true;
      await this.redisCacheService.set(gameId, gameData);
      return {
        players: mappedPlayers,
        finished: mappedFinished,
        turnTime: null,
        ended: true,
        currentTurn: null,
        rolledNumber: null,
        turnStatus: null,
      };
    }
    if (new Date(turnTime).getTime() <= Date.now()) {
      const currPlayer = gameData.players.find(
        (player: PlayerData) => player.color === gameData.currentTurn
      ) as PlayerData;
      currPlayer.isAFK = true;
      await this.redisCacheService.set(gameId, gameData);
      await this.passTurnToNextPlayer(gameId);
      const data = await this.redisCacheService.get(gameId);
      return {
        players: mappedPlayers,
        finished: mappedFinished,
        turnTime: data.turnTime,
        currentTurn: data.currentTurn,
        rolledNumber: isPlayersTurn ? data.rolledNumber : null,
        turnStatus: isPlayersTurn ? data.turnStatus : null,
      };
    }
    return {
      players: mappedPlayers,
      finished,
      turnTime,
      currentTurn,
      rolledNumber: isPlayersTurn ? rolledNumber : null,
      turnStatus: isPlayersTurn ? turnStatus : null,
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
      .filter(
        (player: PlayerData) =>
          !player.positions.every((position: number) => position === 105)
      )
      .map((player: PlayerData) => player.color)
      .sort((a: Color, b: Color) => colorsValues[a] - colorsValues[b]);
    const currentTurnIndex = colorsInGame.findIndex(
      (item: Color) => currentTurn === item
    );
    if (currentTurnIndex === colorsInGame.length - 1)
      gameData.currentTurn = colorsInGame[0];
    else gameData.currentTurn = colorsInGame[currentTurnIndex + 1];

    const nextPlayer = gameData.players.find(
      (player: PlayerData) => player.color === gameData.currentTurn
    ) as PlayerData;
    if (!nextPlayer) {
      console.log('game ended');
      return;
    }
    if (nextPlayer.isAFK) gameData.turnTime = new Date(Date.now() + 1000 * 10);
    else gameData.turnTime = new Date(Date.now() + 1000 * 60);
    await this.redisCacheService.set(gameId, gameData);
  }

  async roll(gameId: number, userId: string): Promise<number> {
    const gameData = await this.redisCacheService.get(gameId);
    const isPlayersTurn = await this.checkIfIsPlayersTurn(gameData, userId);
    if (isPlayersTurn) {
      const { rolledNumber } = gameData;
      if (rolledNumber) return rolledNumber;
      const player = await this.getCurrentPlayer(gameData, userId);
      player.isAFK = false;
      const { positions } = player;
      const newlyRolledNum = Math.floor(Math.random() * 6) + 1;
      if (
        (positions.every((position: number) => position === 0) &&
          newlyRolledNum !== 1 &&
          newlyRolledNum !== 6) || // Cant move anything bc everything is at start
        positions.every(
          (position: number) =>
            position + newlyRolledNum > 105 ||
            (position === 0 && newlyRolledNum !== 1 && newlyRolledNum !== 6)
        )
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
    ) as PlayerData;
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
        const data = await this.playerFinished(player, gameData, gameId);
        await this.redisCacheService.set(gameId, data);
        await this.passTurnToNextPlayer(gameId);
        return;
      }
      await this.killPawns(gameId, gameData, pawnId);
    }
  }

  async playerFinished(
    player: PlayerData,
    gameData: GameData,
    gameId: number
  ): Promise<GameData> {
    const placement = (gameData.finished.length + 1) as 1 | 2 | 3 | 4;
    gameData.finished.push({ player, placement });
    gameData.rolledNumber = null;
    console.log(`Player ${player.name} finished game placing: ${placement}`);
    if (gameData.finished.length === gameData.players.length) {
      console.log('game ended');
      setTimeout(() => this.redisCacheService.remove(gameId, true), 1000 * 30); // remove both from db and redis
    }

    return gameData;
  }

  async killPawns(
    gameId: number,
    gameData: GameData,
    pawnId: number
  ): Promise<void> {
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
      otherPlayers.forEach((player: PlayerData) => {
        player.positions = player.positions.map((position: number) => {
          const preyPosition =
            colorsValues[player.color] * 13 + position > 52
              ? colorsValues[player.color] * 13 + position - 52
              : colorsValues[player.color] * 13 + position;
          if (preyPosition === lastlyMovedPawn) return 0;
          return position;
        });
      });
    }
    if (gameData.rolledNumber === 6 || pawnPosition === 105) {
      gameData.rolledNumber = null;
      gameData.turnStatus = 1;
      await this.redisCacheService.set(gameId, gameData);
      return;
    }
    gameData.rolledNumber = null;
    await this.redisCacheService.set(gameId, gameData);
    await this.passTurnToNextPlayer(gameId);
  }
}
