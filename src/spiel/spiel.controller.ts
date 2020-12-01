import { SpielService } from './spiel.service';
import { Spiel } from './spiel.entity';
import { Get, Controller, Post, Body, Param } from '@nestjs/common';

@Controller('spiel')
export class SpielController {
    constructor(private readonly spielService: SpielService) {}

    @Get()
    async getSpiele(): Promise<Spiel[]> {
        return this.spielService.findAll();
    }

    @Get(':id')
    async getSpiel(@Param('id') id: number): Promise<Spiel> {
        return this.spielService.find(id);
    }

    @Post()
    async updateSpiele(@Body() spiele: Spiel[]): Promise<Spiel[]> {
        return this.spielService.updateSpiele(spiele)
    }
}
