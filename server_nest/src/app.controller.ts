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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  load(
    @Session() session: SessionData,
    @Res() res: Response
  ): Response | { url: string } {
    const { user } = session;
    console.log(user);
    if (user && !user.inGame && !user.roomId) return { url: '/room/join' };
    res.sendFile(this.appService.getProperFile(user));
  }

  @Post('/setUsername')
  @Redirect('/room/join')
  setUsername(
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
