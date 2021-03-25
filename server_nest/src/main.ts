import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: UserSessionData;
  }
}

export interface UserSessionData {
  name: string;
  inGame: boolean;
  userId: string;
  roomId: number | null;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'secretsessionkeyhehe',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 },
    })
  );
  await app.listen(4000);
}
bootstrap();
