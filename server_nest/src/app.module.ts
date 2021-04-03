import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      keepConnectionAlive: true,
      name: 'default',
      logging: false,
      entities: ['dist/**/**.entity{.ts,.js}'],
      url: process.env.DATABASE_URL || 'localhost',
    }),
    RoomModule,
    GameModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
