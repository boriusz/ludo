import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from './room/room.module';

@Module({
  imports: [TypeOrmModule.forRoot(), RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
