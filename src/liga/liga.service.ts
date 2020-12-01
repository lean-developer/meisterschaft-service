import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Liga } from './liga.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SaisonService } from 'src/saison/saison.service';
import { Saison } from 'src/saison/saison.entity';

@Injectable()
export class LigaService {
    private readonly logger = new Logger(LigaService.name);

    constructor(
        @InjectRepository(Liga)
        private readonly ligaRepository: Repository<Liga>,
        private readonly saisonService: SaisonService) {
    }

    async findAll(): Promise<Liga[]> {
        return await this.ligaRepository.find({ relations: ['saisons'] });
    }

    async find(id: number): Promise<Liga> {
        return await this.ligaRepository.findOne(id, ({ relations: ['saisons'] }));
    }

    async create(name: string): Promise<Liga> {
        const liga: Liga = new Liga();
        liga.name = name;
        return await this.ligaRepository.save(liga);
    }

    async save(id: number, name: string): Promise<Liga> {
        const liga: Liga = await this.ligaRepository.findOne(id);
        if (liga) {
            liga.name = name;
            return await this.ligaRepository.save(liga);
        }
        return liga;
    }

    async saveLigaSaison(id: number, saisonId: number): Promise<Liga> {
        const liga: Liga = await this.ligaRepository.findOne(id);
        const saison: Saison = await this.saisonService.find(saisonId);
        if (liga.saisons) {
            liga.saisons.push(saison);
        } else {
            const saisons: Saison[] = [];
            saisons.push(saison);
            liga.saisons = saisons;
        }
        return await this.ligaRepository.save(liga);
    }

    async delete(id: number): Promise<DeleteResult> {
        const liga: Liga = await this.find(id);
        if (liga && liga.saisons) {
            for (const s of liga.saisons) {
                await this.saisonService.delete(s.id);
            }
        }
        return this.ligaRepository.delete(id);
    }
}