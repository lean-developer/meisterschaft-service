import { SpielService } from './spiel.service';
import { Spiel } from './spiel.entity';
import { Get, Controller, Post, Body } from '@nestjs/common';

@Controller('spiel')
export class SpielController {
    constructor(private readonly spielService: SpielService) {}

    @Get()
    async getSpiele(): Promise<Spiel[]> {
        return this.spielService.findAll();
    }

    @Post()
    async updateSpiele(@Body() spiele: Spiel[]): Promise<Spiel[]> {
        return this.spielService.updateSpiele(spiele)
    }
}
