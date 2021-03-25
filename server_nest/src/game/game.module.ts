import { Module } from '@nestjs/common';
import { RedisCacheModule } from './redisCache.module';
import { GameService } from './game.service';

@Module({
  imports: [RedisCacheModule],
  providers: [GameService],
})
export class RoomModule {}
