import {
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Res,
  Session,
} from '@nestjs/common';
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
    if (!roomId) {
      res.redirect('/room/join');
      return;
    }
    const canStart = await this.roomService.checkIfCanStart(roomId);
    if (canStart) {
      await this.roomService.start(roomId);
      const responseData = await this.roomService.getResponseData(roomId);
      res.json(responseData);
      return;
    }
    const responseData = await this.roomService.getResponseData(roomId);
    res.json(responseData);
    return;
  }

  @Get('join')
  @Redirect()
  async joinRoom(@Session() session: SessionData): Promise<{ url: string }> {
    const isUserInGame = await this.roomService.checkIfUserInGame(session);
    if (isUserInGame || !session.user)
      return { url: 'http://192.168.1.8:4000/' };
    const roomToJoin = await this.roomService.findRoomWithPlaceForNextUser();
    const userCreds = { name: session.user.name, userId: session.user.userId };
    if (!roomToJoin) {
      const createdRoom = await this.roomService.createRoom();
      await this.roomService.joinRoom(createdRoom.id, userCreds, session);
    } else {
      await this.roomService.joinRoom(roomToJoin.id, userCreds, session);
    }
    return { url: 'http://192.168.1.8:4000/' };
  }

  @Post('/ready/:isReady')
  async switchReady(
    @Param() params,
    @Session() session: SessionData,
    @Res() res: Response
  ): Promise<void> {
    const { isReady } = params;
    const { user } = session;
    if (!user || !user.inGame || !user.roomId) {
      res.redirect('/room/join');
      return;
    }
    await this.roomService.switchReady(isReady, user);
  }
}
