import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('server.port');
  await app.listen(port);

  const logConfig = configService.get<false | LogLevel[]>('logger.level');
  await app.useLogger(logConfig);
  Logger.log(`Application listening on port ${port}`);
}
bootstrap();
