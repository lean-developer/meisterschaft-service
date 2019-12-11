import { CacheModule } from './../cache/cache.module';
import { CacheService } from './../cache/cache.service';
import { SharedModule } from './../shared/shared.module';
import { SpielService } from './spiel.service';
import { Spiel } from './spiel.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MannschaftModule } from './..//mannschaft/mannschaft.module';
import { SpielController } from './spiel.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Spiel]),
        MannschaftModule,
        SharedModule,
        CacheModule
    ],
    providers: [
        SpielService
    ],
    exports: [
        SpielService
    ],
    controllers: [SpielController]
})
export class SpielModule {}
