import { Controller, Get, Session } from '@nestjs/common';
import { SessionData } from 'express-session';
import { RoomRO } from './room.interface';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async roomData(@Session() session: SessionData): Promise<RoomRO> {
    const { roomId } = session.user;
    if (!roomId) return null;

    const canStart = await this.roomService.checkIfCanStart(roomId);
    if (canStart) return await this.roomService.start(roomId);

    return await this.roomService.getResponseData(roomId);
  }
}
