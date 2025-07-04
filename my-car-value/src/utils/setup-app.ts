import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

export const setupApp = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  app.use(cookieSession({ keys: [configService.get('COOKIE_KEY')] }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
