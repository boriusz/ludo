import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager-redis-store';
import { Repository } from 'typeorm';
import { RoomEntity } from './room/room.entity';
import {
  Color,
  colorsValues,
  GameData,
  PlayerData,
} from './game/game.interface';
import { RoomPlayersData } from './room/room.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }

  async cacheDbData(roomId: number): Promise<void> {
    const room = await this.roomRepository.findOne(roomId);
    if (!room) return null;
    const { id, players } = room;
    const playersData: PlayerData[] = players.map(
      (player: RoomPlayersData) => ({
        name: player.name,
        userId: player.userId,
        color: player.color,
        positions: [0, 0, 0, 0],
      })
    );
    const colorsInGame: Color[] = playersData
      .map((player: PlayerData) => player.color)
      .sort((a: Color, b: Color) => colorsValues[b] - colorsValues[a]);
    const gameData: GameData = {
      players: playersData,
      turnStatus: null,
      rolledNumber: null,
      currentTurn: colorsInGame[0],
    };
    await this.set(id.toString(), JSON.stringify(gameData));
    return null;
  }
}
