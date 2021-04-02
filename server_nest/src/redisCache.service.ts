import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
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
export class RedisCacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) {}

  onModuleInit(): void {
    this.roomRepository.clear().then(() => console.log('cleared'));
  }

  async set(key: number, value: GameData): Promise<void> {
    await this.cacheManager.set(key.toString(), JSON.stringify(value));
  }

  async get(key: number): Promise<GameData> {
    let data = await this.cacheManager.get(key.toString());
    if (!data) await this.cacheDbData(key);
    data = await this.cacheManager.get(key.toString());
    const gameData: GameData = JSON.parse(data);
    return gameData;
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
      .sort((a: Color, b: Color) => colorsValues[a] - colorsValues[b]);
    const gameData: GameData = {
      players: playersData,
      finished: [],
      turnStatus: 1,
      rolledNumber: null,
      currentTurn: colorsInGame[0],
    };
    await this.set(id, gameData);
    return null;
  }
}
