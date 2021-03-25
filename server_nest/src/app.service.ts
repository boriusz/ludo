import { Injectable } from '@nestjs/common';
import { UserSessionData } from './main';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  getProperFile(user: UserSessionData): string {
    if (!user) return join(__dirname, '../', 'public', 'username.html');
    return join(__dirname, '../', 'public', 'lobby.html');
  }

  setUser(username: string): UserSessionData | string {
    if (username.length === 0 || username.length > 10)
      return 'invalid username';
    return {
      name: encodeURIComponent(username),
      inGame: false,
      userId: v4(),
      roomId: null,
    };
  }
}
