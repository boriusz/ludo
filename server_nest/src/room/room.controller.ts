import { Controller, Get, Redirect, Res, Session } from '@nestjs/common';
import { SessionData } from 'express-session';
import { RoomRO } from './room.interface';
import { RoomService } from './room.service';
import { Response } from 'express';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async roomData(
    @Session() session: SessionData,
    @Res() res: Response
  ): Promise<RoomRO> {
    const roomId = session?.user?.roomId;
    if (!roomId) res.redirect('/');
    const canStart = await this.roomService.checkIfCanStart(roomId);
    if (canStart) return await this.roomService.start(roomId);
    const responseData = await this.roomService.getResponseData(roomId);
    res.json(responseData);
  }

  @Get('join')
  @Redirect()
  async joinRoom(@Session() session: SessionData): Promise<{ url: string }> {
    const isUserInGame = await this.roomService.checkIfUserInGame(session);
    if (isUserInGame) return { url: 'http://192.168.1.8:4000/' };
    const roomToJoin = await this.roomService.findRoomWithPlaceForNextUser();
    const userCreds = { name: session.user.name, userId: session.user.userId };
    if (!roomToJoin) {
      const createdRoom = await this.roomService.createRoom();
      await this.roomService.joinRoom(createdRoom.id, userCreds);
      session.user.roomId = createdRoom.id;
    } else {
      await this.roomService.joinRoom(roomToJoin.id, userCreds);
      session.user.roomId = roomToJoin.id;
    }
    return { url: 'http://192.168.1.8:4000/' };
  }
}
