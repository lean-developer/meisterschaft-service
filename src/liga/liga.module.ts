import { Module } from '@nestjs/common';
import { LigaController } from './liga.controller';
import { LigaService } from './liga.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liga } from './liga.entity';
import { SharedModule } from 'src/shared/shared.module';
import { SaisonModule } from 'src/saison/saison.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Liga]),
        SaisonModule,
        SharedModule,
    ],
    providers: [
        LigaService,
    ],
    exports: [
        LigaService,
    ],
    controllers: [LigaController],
})
export class LigaModule {}
