import { CacheController } from './cache/cache.controller';
import { RedisService } from './redis.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '81.169.194.119',
      port: 3306,
      username: 'sa',
      password: '$123Not4All456#',
      database: 'icl_meisterschaft',
      entities: [Mannschaft, Spiel, Spieltag, Saison],
      synchronize: true,
    }),
    MannschaftModule,
    SpielModule,
    SpieltagModule,
    SaisonModule,
    LigaModule,
  ],
  providers: [AppService, RedisService, CacheService],
  controllers: [AppController, CacheController]
})
export class AppModule {}
