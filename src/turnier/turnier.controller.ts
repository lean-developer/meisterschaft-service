import { Controller, Get } from '@nestjs/common';
import { TurnierService } from './turnier.service';
import { Turnier } from './turnier.entity';

@Controller('turnier')
export class TurnierController {

    constructor(
        private readonly turnierService: TurnierService) {}

    @Get()
    async getSpieltage(): Promise<Turnier[]> {
        return this.turnierService.findAll();
    }
    
}
