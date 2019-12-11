import { SessionGuard } from './../shared/session/session.guard';
import { Score } from './score';
import { MannschaftService } from './mannschaft.service';
import { Controller, Get, Post, Body, Delete, Param, Logger, UseGuards } from '@nestjs/common';
import { Mannschaft } from './mannschaft.entity';
import { DeleteResult } from 'typeorm';

@Controller('mannschaft')
export class MannschaftController {
    private readonly logger = new Logger(MannschaftController.name);
    
    constructor(private readonly mannschaftService: MannschaftService) {}

    @Get()
    async getMannschaften(): Promise<Mannschaft[]> {
        return this.mannschaftService.findAll();
    }

    @Get('/fifa')
    async getFifaMannschaften() {
        return this.mannschaftService.findAllFifa();
    }

    @Get('/fifa/:confederation')
    async getFifaMannschaftenForConfederation(@Param() params: any) {
        return this.mannschaftService.findAllFifaForConfederation(params.confederation);
    }

    @Get('/spiele')
    async getMannschaftenSpiele(): Promise<Mannschaft[]> {
        return this.mannschaftService.findAllSpiele();
    }

    @Get(':kuerzel')
    async getMannschaftByKuerzel(@Param() params: any): Promise<Mannschaft> {
        this.logger.log('getMannschaftByKuerzel');
        return this.mannschaftService.findByKuerzel(params.kuerzel);
    }

    @Get('/spiele/score')
    @UseGuards(SessionGuard)
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