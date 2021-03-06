import { Score } from '../saison/score';
import { MannschaftService } from './mannschaft.service';
import { Controller, Get, Post, Body, Delete, Param, Logger } from '@nestjs/common';
import { Mannschaft } from './mannschaft.entity';
import { DeleteResult } from 'typeorm';

@Controller('mannschaft')
export class MannschaftController {
    private readonly logger = new Logger(MannschaftController.name);

    constructor(private readonly mannschaftService: MannschaftService) {}

    @Get()
    async getMannschaften(): Promise<Mannschaft[]> {
        this.logger.log('getMannschaften');
        return this.mannschaftService.findAll();
    }

    @Get('/club')
    async getClubMannschaften() {
        this.logger.log('getClubMannschaften');
        return await this.mannschaftService.findAllClubs();
    }

    @Get('/fifa')
    async getFifaMannschaften() {
        return this.mannschaftService.findAllFifa();
    }

    @Get('/saison/:id')
    async getMannschaftenBySaison(@Param('id') saisonId: number): Promise<Mannschaft[]> {
        return this.mannschaftService.findBySaison(saisonId);
    }

    @Get(':id')
    async getMannschaftById(@Param('id') id: number): Promise<Mannschaft> {
        return this.mannschaftService.find(id);
    }

    @Get(':id/matches')
    async getMannschaftByIdWithMatches(@Param('id') id: number): Promise<Mannschaft> {
        return this.mannschaftService.findWithMatches(id);
    }

    @Get('/fifa/:confederation')
    async getFifaMannschaftenForConfederation(@Param() params: any) {
        return this.mannschaftService.findAllFifaForConfederation(params.confederation);
    }

    @Get('/spiele')
    async getMannschaftenSpiele(): Promise<Mannschaft[]> {
        return this.mannschaftService.findAllSpiele();
    }

    @Get('/saison/:saisonId/:searchStr')
    async search(@Param('saisonId') saisonId: number, @Param('searchStr') searchStr: string): Promise<Mannschaft> {
        return this.mannschaftService.search(saisonId, searchStr);
    }

    @Get(':kuerzel')
    async getMannschaftByKuerzel(@Param() params: any): Promise<Mannschaft> {
        this.logger.log('getMannschaftByKuerzel');
        return this.mannschaftService.findByKuerzel(params.kuerzel);
    }

    @Get('/spiele/score')
    // @UseGuards(SessionGuard)
    async getMannschaftenScores(): Promise<Score[]> {
        this.logger.log('getScore');
        return await this.mannschaftService.getScores();
    }

    @Post()
    async createMannschaften(@Body() mannschaften: Mannschaft[]): Promise<Mannschaft[]> {
        return this.mannschaftService.createMannschaften(mannschaften);
    }

    @Delete(':id')
    async deleteMannschaft(@Param() params: any): Promise<DeleteResult> {
        return this.mannschaftService.delete(params.id);
    }
}
