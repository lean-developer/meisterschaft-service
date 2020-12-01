import { Controller, Logger, Get, Post, Query, Body, Param } from '@nestjs/common';
import { SaisonService } from './saison.service';
import { Saison } from './saison.entity';
import { MannschaftRaw, Mannschaft } from 'src/mannschaft/mannschaft.entity';
import { TabelleService } from './tabelle.service';
import { Score } from './score';

@Controller('saison')
export class SaisonController {
    private readonly logger = new Logger(SaisonController.name);

    constructor(private readonly saisonService: SaisonService,
                private readonly tabelleService: TabelleService) {}

    @Get()
    async getSaisons(): Promise<Saison[]> {
        return this.saisonService.findAll();
    }

    @Get(':id/tabelle')
    async getSaisonTabelle(@Param('id') id: number): Promise<Score[]> {
        return this.tabelleService.getScores(id);
    }

    @Get(':id/tabelle/:spieltagNr')
    async getSaisonTabelleBySpieltag(@Param('id') id: number, @Param('spieltagNr') spieltagNr: number): Promise<Score[]> {
        return this.tabelleService.getScoresBySpieltag(id, spieltagNr);
    }

    @Post()
    async createSaison(@Query('name') name: string): Promise<Saison> {
        return this.saisonService.create(name);
    }

    @Post(':id')
    async addMannschaften(@Param('id') id: number, @Body() mannschaften: Mannschaft[]): Promise<Saison> {
        return this.saisonService.addMannschaften(id, mannschaften);
    }
}