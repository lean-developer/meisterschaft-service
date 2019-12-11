import { MannschaftService } from './../mannschaft/mannschaft.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Turnier } from './turnier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TurnierService {
    private readonly logger = new Logger(TurnierService.name);

    constructor(
        @InjectRepository(Turnier) 
        private readonly turnierRepository: Repository<Turnier>,
        private readonly mannschaftService: MannschaftService) {
    }

    async findAll(): Promise<Turnier[]> {
        return await this.turnierRepository.find();
    }

    async createTurnier(nr: number, name: string) {
        let turnier: Turnier = new Turnier();
        turnier.nr = nr;
        turnier.name = name;
        return await this.turnierRepository.save(turnier);
    }

}
