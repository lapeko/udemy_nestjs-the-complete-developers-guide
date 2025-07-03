import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';

export const setupApp = (app: INestApplication) => {
  app.use(cookieSession({ keys: ['asdasdasd'] }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
