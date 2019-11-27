import { MannschaftController } from './mannschaft.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mannschaft } from './mannschaft.entity';
import { MannschaftService } from './mannschaft.service';
import { Score } from './score';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mannschaft]),
        Score
    ],
    providers: [
        MannschaftService
    ],
    exports: [
        MannschaftService
    ],
    controllers: [MannschaftController] 
})
export class MannschaftModule {}
