import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as Redis from 'ioredis';
import * as connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);

const redisClient = new Redis(process.env.REDIS_URL);

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
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['POST', 'GET', 'PUT'],
  });
  app.use(
    session({
      secret: 'secretsessionkeyhehe',
      store: new RedisStore({ client: redisClient }),
      resave: true,
      saveUninitialized: true,
      cookie: { secure: 'auto', httpOnly: true, maxAge: 1000 * 60 * 60 },
    })
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
