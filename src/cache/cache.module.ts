import { RedisModule } from './../redis/redis.module';
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Module({
    imports: [
        RedisModule
    ],
    providers: [
        CacheService
    ],
    exports: [
        CacheService
    ],
    controllers: [CacheController]  
})
export class CacheModule {}
