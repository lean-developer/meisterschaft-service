import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { Saison } from './saison.entity';
import { SaisonService } from './saison.service';
import { SaisonController } from './saison.controller';
import { MannschaftModule } from 'src/mannschaft/mannschaft.module';
import { TabelleService } from './tabelle.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Saison]),
        MannschaftModule,
        SharedModule,
    ],
    providers: [
        SaisonService,
        TabelleService,
    ],
    exports: [
        SaisonService,
    ],
    controllers: [SaisonController],
})
export class SaisonModule {}
