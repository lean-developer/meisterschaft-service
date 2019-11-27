import { Controller, Get, Post, Body, Delete, Param, Logger, Query } from '@nestjs/common';
import { Spieltag } from './spieltag.entity';
import { SpieltagService, CreateSpieltag } from './spieltag.service';
import { DeleteResult } from 'typeorm';

@Controller('spieltag')
export class SpieltagController {
    private readonly logger = new Logger(SpieltagController.name);
    
    constructor(
        private readonly spieltagService: SpieltagService) {}

    @Get()
    async getSpieltage(): Promise<Spieltag[]> {
        return this.spieltagService.findAll();
    }

    @Get(':nr')
    async getSpieltag(@Param('nr') nr: number): Promise<Spieltag> {
        return this.spieltagService.find(nr);
    }

    @Post('/random') 
    async createRandomSpieltage() {
        return this.spieltagService.createRandomSpieltage();
    }

    @Post()
    async createSpieltag(@Body() spieltage: CreateSpieltag[]): Promise<Spieltag[]> {
        for (let st of spieltage) {
            await this.spieltagService.delete(st.nr);
        }
        return this.spieltagService.createSpieltage(spieltage);
    }

    @Delete(':id')
    async deleteSpieltag(@Param() params: any): Promise<DeleteResult> {
        return this.spieltagService.delete(params.id);
    }
}