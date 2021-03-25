import { CacheModule, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RedisCacheService } from '../redisCache.service';
import { GameController } from './game.controller';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../room/room.entity';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: null,
    }),
    TypeOrmModule.forFeature([RoomEntity]),
  ],
  providers: [GameService, RedisCacheService],
  controllers: [GameController],
})
export class GameModule {}
