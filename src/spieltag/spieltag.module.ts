import { SharedModule } from './../shared/shared.module';
import { SpielModule } from './../spiel/spiel.module';
import { MannschaftModule } from './../mannschaft/mannschaft.module';
import { SpieltagController } from './spieltag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Spieltag } from './spieltag.entity';
import { SpieltagService } from './spieltag.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Spieltag]),
        SpielModule,
        MannschaftModule,
        SharedModule 
    ],
    providers: [
        SpieltagService
    ],
    exports: [
        SpieltagService
    ],
    controllers: [SpieltagController]  
})
export class SpieltagModule {}
