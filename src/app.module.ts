import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, HttpModule } from '@nestjs/common';
import { MannschaftModule } from './mannschaft/mannschaft.module';
import { SpielModule } from './spiel/spiel.module';
import { SpieltagModule } from './spieltag/spieltag.module';
import { SaisonModule } from './saison/saison.module';
import { Mannschaft } from './mannschaft/mannschaft.entity';
import { Spiel } from './spiel/spiel.entity';
import { Spieltag } from './spieltag/spieltag.entity';
import { Saison } from './saison/saison.entity';
import { LigaModule } from './liga/liga.module';
import { CacheModule } from './cache/cache.module';
import { RedisModule } from './redis/redis.module';
import { TurnierModule } from './turnier/turnier.module';
import { Turnier } from './turnier/turnier.entity';
import { Liga } from './liga/liga.entity';
import { Match } from './match/match.entity';
import { MatchModule } from './match/match.module';
// tslint:disable-next-line: no-var-requires
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
      entities: [Mannschaft, Spieltag, Saison, Turnier, Liga, Match],
      synchronize: true,
    }),
    MatchModule,
    SpieltagModule,
    MannschaftModule,
    SaisonModule,
    TurnierModule,
    LigaModule,
    HttpModule,
    /* RedisModule,
    CacheModule, */
    TurnierModule,
  ]
})
export class AppModule {}
