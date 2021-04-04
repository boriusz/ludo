import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SessionData } from 'express-session';
import { Request, Response } from 'express';
import { RoomService } from './room/room.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly roomService: RoomService
  ) {}

  @Get()
  async load(
    @Session() session: SessionData,
    @Res() res: Response
  ): Promise<Response | { url: string }> {
    const { user } = session;
    if (
      user &&
      user.inGame &&
      user.roomId &&
      !(await this.roomService.findOne(user.roomId))
    ) {
      user.inGame = false;
      user.roomId = null;
      res.redirect('/room/join');
      return;
    }
    res.sendFile(this.appService.getProperFile(user));
  }

  @Post('/setUsername')
  @Redirect('/room/join')
  setUser(
    @Session() session: SessionData,
    @Req() req: Request
  ): string | { url: string } {
    const { username } = req.body;
    const user = this.appService.setUser(username);
    if (typeof user === 'string') return { url: '/' };
    req.session.user = user;
    return 'ok';
  }
}
