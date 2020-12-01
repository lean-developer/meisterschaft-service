import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Injectable } from '@nestjs/common';
import { Saison } from './saison.entity';
import { Repository, DeleteResult } from 'typeorm';
import { Mannschaft } from 'src/mannschaft/mannschaft.entity';
import { MannschaftService } from 'src/mannschaft/mannschaft.service';

@Injectable()
export class SaisonService {
    private readonly logger = new Logger(SaisonService.name);

    constructor(
        @InjectRepository(Saison)
        private readonly saisonRepository: Repository<Saison>,
        private readonly mannschaftService: MannschaftService) {
    }

    async findAll(): Promise<Saison[]> {
        return await this.saisonRepository.find();
    }

    async find(id: number): Promise<Saison> {
        return await this.saisonRepository.findOne(id);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.saisonRepository.delete(id);
    }

    async create(name: string): Promise<Saison> {
        const saison: Saison = new Saison();
        saison.name = name;
        return await this.saisonRepository.save(saison);
    }

    async addMannschaften(id: number, mannschaften: Mannschaft[]): Promise<Saison> {
        const saison = await this.saisonRepository.findOne(id);
        if (saison) {
            for (const m of mannschaften) {
                if (!m.name && m.team) {
                    m.name = m.team;
                }
            }
            // ... Mannschaften speichern (neu erzeugen nur, wenn Mannschaft anhand UID nicht bereits in der Saison enthalten ist)
            await this.mannschaftService.saveOrCreateByUID(saison.id, mannschaften);
        }
        // Saison (mit den dann zugeordneten Mannschaften) laden (hier aktuell nicht nötig, weil nur die Saison ohne Mannschaft geliefert wird)
        return await this.find(id);
    }
}
