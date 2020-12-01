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

    @Get(':nr/saison/:saisonId')
    async getSpieltagByNrAndBySaison(@Param('nr') nr: number, @Param('saisonId') saisonId: number): Promise<Spieltag> {
        this.logger.log('getSpieltagByIdAndBySaison ...');
        return this.spieltagService.findByNrAndBySaion(nr, saisonId);
    }

    @Get(':id')
    async getSpieltag(@Param('id') id: number): Promise<Spieltag> {
        return this.spieltagService.find(id);
    }

    @Get('/saison/:saisonId')
    async getSpieltageBySaison(@Param('saisonId') saisonId: number): Promise<Spieltag[]> {
        return this.spieltagService.findBySaison(saisonId);
    }

    @Post('/saison/:saisonId')
    async createSpieltag(@Param('saisonId') saisonId: number, @Body() spieltage: CreateSpieltag[]): Promise<Spieltag[]> {
        console.log('createSpieltag ...' + saisonId);
        /*
        for (let st of spieltage) {
            await this.spieltagService.delete(st.id);
        }
        */
        return this.spieltagService.createSpieltage(saisonId, spieltage);
    }

    @Post('/random') 
    async createRandomSpieltage() {
        return this.spieltagService.createRandomSpieltage();
    }

    /*
    @Delete(':id')
    async deleteSpieltag(@Param() params: any): Promise<DeleteResult> {
        return this.spieltagService.delete(params.id);
    }
    */
}