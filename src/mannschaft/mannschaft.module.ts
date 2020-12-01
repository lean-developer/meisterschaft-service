import { SharedModule } from './../shared/shared.module';
import { MannschaftController } from './mannschaft.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mannschaft } from './mannschaft.entity';
import { MannschaftService } from './mannschaft.service';
import { Score } from '../saison/score';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mannschaft]),
        Score,
        SharedModule,
    ],
    providers: [
        MannschaftService,
    ],
    exports: [
        MannschaftService,
    ],
    controllers: [MannschaftController],
})
export class MannschaftModule {}
