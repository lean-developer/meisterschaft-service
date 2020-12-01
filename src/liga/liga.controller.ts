import { Logger, Controller, Get, Post, Param, Query, Delete } from '@nestjs/common';
import { Liga } from './liga.entity';
import { LigaService } from './liga.service';
import { DeleteResult } from 'typeorm';

@Controller('liga')
export class LigaController {
    private readonly logger = new Logger(LigaController.name);

    constructor(private readonly ligaService: LigaService) {}

    @Get()
    async getLigen(): Promise<Liga[]> {
        return this.ligaService.findAll();
    }

    @Get(':id')
    async getLiga(@Param('id') ligaId: number): Promise<Liga> {
        return this.ligaService.find(ligaId);
    }

    @Post()
    async createLiga(@Query('name') name: string): Promise<Liga> {
        return this.ligaService.create(name);
    }

    @Post(':id')
    async saveLiga(@Param('id') ligaId: number, @Query('name') name: string): Promise<Liga> {
        return this.ligaService.save(ligaId, name);
    }

    @Post(':id/saison/:saisonId')
    async addLigaSaison(@Param('id') ligaId: number, @Param('saisonId') saisonId: number): Promise<Liga> {
        this.logger.log('LigaId' + ligaId + ', SaisonId' + saisonId);
        return this.ligaService.saveLigaSaison(ligaId, saisonId);
    }

    @Delete(':id')
    async deleteLiga(@Param('id') ligaId: number): Promise<DeleteResult> {
        return this.ligaService.delete(ligaId);
    }
}
