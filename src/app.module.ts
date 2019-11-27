import { CacheController } from './cache/cache.controller';
import { RedisService } from './redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MannschaftModule } from './mannschaft/mannschaft.module';
import { SpielModule } from './spiel/spiel.module';
import { SpieltagModule } from './spieltag/spieltag.module';
import { SaisonModule } from './saison/saison.module';
import { Mannschaft } from './mannschaft/mannschaft.entity';
import { Spiel } from './spiel/spiel.entity';
import { Spieltag } from './spieltag/spieltag.entity';
import { Saison } from './saison/saison.entity';
import { LigaModule } from './liga/liga.module';
import { CacheService } from './cache/cache.service';
const dotenv = require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,  
      port: 3306,
      username: process.env.DB_USER, 
      password: process.env.DB_PW, 
      database: process.env.DB_NAME,
      entities: [Mannschaft, Spiel, Spieltag, Saison],
      synchronize: true,
    }),
    MannschaftModule,
    SpielModule,
    SpieltagModule,
    SaisonModule,
    LigaModule,
  ],
  providers: [RedisService, CacheService],
  controllers: [CacheController]
})
export class AppModule {}
