import { CacheService } from './../cache/cache.service';
import { Mannschaft } from './../mannschaft/mannschaft.entity';
import { Spiel } from './spiel.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SpielService {
    constructor(
        @InjectRepository(Spiel)
        private readonly spielRepository: Repository<Spiel>,
        ) {
    }

    async findAll(): Promise<Spiel[]> {
        // return await this.spielRepository.find( { relations: ["heim", "gast"]});
        return await this.spielRepository.find();
    }

    async find(id: number): Promise<Spiel> {
        return await this.spielRepository.findOne(id);
    }

    async create(heimMannschaft: Mannschaft, gastMannschaft: Mannschaft, heimTore: number, gastTore: number): Promise<Spiel> {
        const spiel: Spiel = new Spiel();
        spiel.heimId = heimMannschaft.id;
        spiel.gastId = gastMannschaft.id;
        spiel.heimTore = heimTore;
        spiel.gastTore = gastTore;
        // this.cacheService.setSpiel(spiel);
        return await this.spielRepository.save(spiel);
    }

    async createSpielOhneTore(heimMannschaft: Mannschaft, gastMannschaft: Mannschaft): Promise<Spiel> {
        let spiel: Spiel = new Spiel();
        spiel.heimId = heimMannschaft.id;
        spiel.gastId = gastMannschaft.id;
        spiel.heimTore = -1;
        spiel.gastTore = -1;
        return await this.spielRepository.save(spiel);
    }

    async createSpiele(spiele: Spiel[]): Promise<Spiel[]> {
        // this.cacheService.setSpiele(spiele);
        return await this.spielRepository.save(spiele);
    }

    async updateSpiele(spiele: Spiel[]): Promise<Spiel[]> {
        // this.cacheService.setSpiele(spiele);
        return await this.spielRepository.save(spiele);
    }

    async deleteSpiele(spiele: Spiel[]): Promise<Spiel[]> {
        // TODO: cache
        return await this.spielRepository.remove(spiele);
    }
}