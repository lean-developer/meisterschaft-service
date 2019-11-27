import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis.service';

@Controller('redis')
export class AppController {
  constructor(private readonly redisService: RedisService) {}

  @Get(':key')
  getHello(@Param('key') key: string): Promise<string> {
    return this.redisService.get(key);
  }
}
